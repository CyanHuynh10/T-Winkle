$ErrorActionPreference='Stop'
$projectRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
Push-Location -LiteralPath $projectRoot
try {
 foreach($line in [IO.File]::ReadAllLines((Join-Path $projectRoot '.env'))) {
  if($line -match '^\s*(DB_USERNAME|DB_PASSWORD)\s*=\s*(.*)\s*$'){[Environment]::SetEnvironmentVariable($Matches[1],$Matches[2].Trim().Trim('"').Trim("'"),'Process')}
 }
 $env:TWMGRDEMO_PASSWORD=[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(24))
 $cryptoJar=Join-Path $env:USERPROFILE '.m2/repository/org/springframework/security/spring-security-crypto/7.1.1/spring-security-crypto-7.1.1.jar'
 $hash=& 'C:/Program Files/Java/jdk-21.0.12.1/bin/java.exe' --class-path $cryptoJar tools/manager/PrepareManagerReview.java
 if($LASTEXITCODE -ne 0){throw 'Local password encoding failed.'}
 $env:SQLCMDPASSWORD=$env:DB_PASSWORD
 & sqlcmd -S localhost -U $env:DB_USERNAME -d T_Winkle -b -Q "SET NOCOUNT ON; UPDATE USERS SET password_hash='$hash',is_enabled=1 WHERE email IN('TWMGRDEMO-manager@example.invalid','TWMGRDEMO-customer10@example.invalid','TWMGRDEMO-support@example.invalid'); IF @@ROWCOUNT<>3 THROW 51003,'Install the demo seed first.',1;"
 if($LASTEXITCODE -ne 0){throw 'Local demo setup failed.'}
 Write-Output 'Local demo enabled. Private temporary login is in ignored target/manager-review/login.json. Disable account after review.'
} finally {Remove-Item Env:TWMGRDEMO_PASSWORD,Env:SQLCMDPASSWORD -ErrorAction SilentlyContinue;Pop-Location}
