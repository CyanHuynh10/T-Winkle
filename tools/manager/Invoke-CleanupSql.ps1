param([Parameter(Mandatory=$true)][string]$SqlFile,[Parameter(Mandatory=$true)][string]$OutputFile)
$ErrorActionPreference='Stop'
$projectRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
foreach($line in [IO.File]::ReadAllLines((Join-Path $projectRoot '.env'))) {
 if($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$') {
  [Environment]::SetEnvironmentVariable($Matches[1],$Matches[2].Trim().Trim('"').Trim("'"),'Process')
 }
}
try {
 $env:SQLCMDPASSWORD=$env:DB_PASSWORD
 & sqlcmd -S localhost -U $env:DB_USERNAME -d T_Winkle -b -f 65001 -y 0 -i $SqlFile -o $OutputFile
 if($LASTEXITCODE -ne 0){throw 'Database audit/cleanup command failed; inspect the private local output.'}
}finally{Remove-Item Env:SQLCMDPASSWORD -ErrorAction SilentlyContinue}
