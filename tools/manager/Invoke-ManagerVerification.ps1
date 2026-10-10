param([ValidateSet('Audit','FinalAudit','Migrate','Seed','Cleanup','Test','Package','Run')][string]$Mode='Test')
$ErrorActionPreference='Stop'
$projectRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
foreach($line in [IO.File]::ReadAllLines((Join-Path $projectRoot '.env'))) {
 if($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$') {
  [Environment]::SetEnvironmentVariable($Matches[1],$Matches[2].Trim().Trim('"').Trim("'"),'Process')
 }
}
$env:JAVA_HOME='C:\Program Files\Java\jdk-21.0.12.1'
Push-Location -LiteralPath $projectRoot
try {
 if($Mode -in @('Audit','FinalAudit','Migrate','Seed','Cleanup')) {
  $env:SQLCMDPASSWORD=$env:DB_PASSWORD
  if($Mode -eq 'Audit') {
   & sqlcmd -S localhost -U $env:DB_USERNAME -d T_Winkle -b -Q "SET NOCOUNT ON; SELECT TABLE_NAME,COLUMN_NAME,DATA_TYPE,IS_NULLABLE,CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME IN ('USERS','ROLES','USER_ROLES','STORES','CATEGORIES','BRANDS','PRODUCTS','PRODUCT_IMAGES','PRODUCT_VARIANTS','STORE_INVENTORY','ORDERS','ORDER_ITEMS','PAYMENTS','ORDER_STATUS_HISTORY','ORDER_CANCELLATIONS','SUPPORT_CONVERSATIONS','SUPPORT_MESSAGES','STORE_STAFF_ASSIGNMENTS','PROMOTIONS','PRODUCT_PROMOTIONS') ORDER BY TABLE_NAME,ORDINAL_POSITION" -W
  } elseif($Mode -eq 'FinalAudit') {
   & sqlcmd -S localhost -U $env:DB_USERNAME -d T_Winkle -b -f 65001 -W -i tools/manager/final-db-audit.sql
  } else {
   $scriptPath=switch($Mode){'Migrate'{'src/main/resources/db/migration-manager-console.sql'} 'Seed'{'src/main/resources/db/demo/seed-manager-console-demo.sql'} 'Cleanup'{'src/main/resources/db/demo/cleanup-manager-console-demo.sql'}}
   & sqlcmd -S localhost -U $env:DB_USERNAME -d T_Winkle -b -f 65001 -i $scriptPath
  }
 } elseif($Mode -eq 'Test') { & .\mvnw.cmd clean test }
 elseif($Mode -eq 'Package') { & .\mvnw.cmd clean package '-DskipTests' }
 elseif($Mode -eq 'Run') { & "$env:JAVA_HOME\bin\java.exe" -jar target/t-winkle-0.0.1-SNAPSHOT.jar '--server.port=5657' '--server.address=127.0.0.1' '--app.base-url=http://localhost:5657' }
 if($LASTEXITCODE -ne 0){throw "Manager verification $Mode failed."}
} finally { Remove-Item Env:SQLCMDPASSWORD -ErrorAction SilentlyContinue; Pop-Location }
