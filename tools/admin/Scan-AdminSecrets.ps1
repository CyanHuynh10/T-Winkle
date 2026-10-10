$ErrorActionPreference='Stop'
$secrets=@()
foreach($line in [IO.File]::ReadAllLines((Join-Path $PWD '.env'))) {
 if($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*(?:PASSWORD|KEY|TOKEN|ACCOUNT_NO)[A-Za-z0-9_]*)\s*=\s*(.*)\s*$') {
  $value=$Matches[2].Trim().Trim('"').Trim("'")
  if($value.Length -ge 8){$secrets+=@{Name=$Matches[1];Value=$value}}
 }
}
$roots=@('src/main/java/cyan/project/twinkle/admin','src/main/java/cyan/project/twinkle/payment','src/test/java/cyan/project/twinkle/admin','src/main/resources/static/admin-assets','src/main/resources/templates/admin','frontend/admin/src','tools/admin')
$files=@($roots | ForEach-Object {Get-ChildItem -LiteralPath $_ -File -Recurse})
$files+=Get-Item src/main/resources/db/migration-admin-console.sql,src/main/java/cyan/project/twinkle/service/PricingService.java,src/main/java/cyan/project/twinkle/service/OrderPaymentRules.java
$matchesFound=0
foreach($file in $files){$text=[IO.File]::ReadAllText($file.FullName);foreach($secret in $secrets){if($text.Contains($secret.Value)){Write-Output "Potential secret match: $($file.FullName) ($($secret.Name))";$matchesFound++}}}
if($matchesFound){throw 'Secret scan found potential matches; no values printed.'}
Write-Output "Secret scan PASS: $($files.Count) Admin files; no local credential values found."

