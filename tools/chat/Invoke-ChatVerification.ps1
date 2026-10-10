param([ValidateSet('Migrate','Test','Package','Run')][string]$Mode='Test')
$ErrorActionPreference='Stop'
$projectRoot=[System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
# Load into this process only. Never echo secret values or mutate the local .env.
foreach ($line in [System.IO.File]::ReadAllLines((Join-Path $projectRoot '.env'))) {
    if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$') {
        $key=$Matches[1]
        $value=$Matches[2].Trim()
        if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
            $value=$value.Substring(1,$value.Length-2)
        }
        [Environment]::SetEnvironmentVariable($key,$value,'Process')
    }
}
$env:JAVA_HOME='C:\Program Files\Java\jdk-21.0.12.1'
Push-Location -LiteralPath $projectRoot
try {
    switch ($Mode) {
        'Migrate' {
            $env:SQLCMDPASSWORD=$env:DB_PASSWORD
            $databaseUser=if($env:DB_USERNAME){$env:DB_USERNAME}else{'sa'}
            & sqlcmd -S localhost -U $databaseUser -d T_Winkle -b -i src/main/resources/db/migration-chat-support.sql
            if ($LASTEXITCODE -ne 0) { throw 'Migration failed.' }
            & sqlcmd -S localhost -U $databaseUser -d T_Winkle -b -i src/main/resources/db/migration-chat-support.sql
            if ($LASTEXITCODE -ne 0) { throw 'Migration idempotency verification failed.' }
            Write-Output 'Chat migration applied twice successfully.'
        }
        'Test' {
            & .\mvnw.cmd clean test
            if ($LASTEXITCODE -ne 0) { throw 'Maven tests failed.' }
        }
        'Package' {
            & .\mvnw.cmd clean package '-DskipTests'
            if ($LASTEXITCODE -ne 0) { throw 'Maven packaging failed.' }
        }
        'Run' { & "$env:JAVA_HOME\bin\java.exe" -jar target/t-winkle-0.0.1-SNAPSHOT.jar }
    }
} finally {
    Remove-Item Env:SQLCMDPASSWORD -ErrorAction SilentlyContinue
    Pop-Location
}
