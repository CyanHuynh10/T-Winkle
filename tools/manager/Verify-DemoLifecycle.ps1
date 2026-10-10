$ErrorActionPreference='Stop'
foreach($line in [IO.File]::ReadAllLines((Join-Path $PWD '.env'))) {if($line -match '^\s*(DB_USERNAME|DB_PASSWORD)\s*=\s*(.*)\s*$'){[Environment]::SetEnvironmentVariable($Matches[1],$Matches[2].Trim().Trim('"').Trim("'"),'Process')}}
$env:SQLCMDPASSWORD=$env:DB_PASSWORD
try {
 $before=& sqlcmd -S localhost -U $env:DB_USERNAME -d T_Winkle -b -W -i tools/manager/audit-non-demo.sql
 if($LASTEXITCODE -ne 0){throw 'Non-demo snapshot failed.'}
 ./tools/manager/Invoke-ManagerVerification.ps1 -Mode Cleanup
 $env:SQLCMDPASSWORD=$env:DB_PASSWORD
 $after=& sqlcmd -S localhost -U $env:DB_USERNAME -d T_Winkle -b -W -i tools/manager/audit-non-demo.sql
 if($LASTEXITCODE -ne 0){throw 'Post-cleanup snapshot failed.'}
 if(($before -join "`n") -ne ($after -join "`n")){throw 'Non-demo database changed during cleanup.'}
 & sqlcmd -S localhost -U $env:DB_USERNAME -d T_Winkle -b -Q "IF EXISTS(SELECT 1 FROM USERS WHERE email LIKE 'TWMGRDEMO%@example.invalid') OR EXISTS(SELECT 1 FROM ORDERS WHERE order_code LIKE 'TWMGRDEMO-%') OR EXISTS(SELECT 1 FROM PRODUCTS WHERE slug LIKE 'TWMGRDEMO-%') THROW 51004,'Synthetic data remains.',1;"
 if($LASTEXITCODE -ne 0){throw 'Demo cleanup incomplete.'}
 Write-Output 'Cleanup PASS: all demo data removed; non-demo counts and checksums preserved.'
 ./tools/manager/Invoke-ManagerVerification.ps1 -Mode Seed
 ./tools/manager/Invoke-ManagerVerification.ps1 -Mode Seed
 Write-Output 'Reseed complete; demo retained for visual review, accounts disabled.'
} finally {Remove-Item Env:SQLCMDPASSWORD -ErrorAction SilentlyContinue}
