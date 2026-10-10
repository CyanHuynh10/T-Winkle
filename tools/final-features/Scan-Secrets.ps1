$ErrorActionPreference='Stop'
$secrets=@()
foreach($line in [IO.File]::ReadAllLines((Join-Path $PWD '.env'))){
 if($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*(?:PASSWORD|KEY|TOKEN)[A-Za-z0-9_]*)\s*=\s*(.*)\s*$'){
  $value=$Matches[2].Trim().Trim('"').Trim("'");if($value.Length -ge 8){$secrets+=@{Name=$Matches[1];Value=$value}}
 }
}
$paths=& git -c core.quotepath=false ls-files --cached --others --exclude-standard
$hits=0;$scanned=0
foreach($entry in $paths){
 $file=Join-Path $PWD $entry
 if(!(Test-Path -LiteralPath $file -PathType Leaf) -or $entry -notmatch '\.(java|ts|tsx|js|mjs|cjs|css|sql|ps1|json|xml|md|html|properties|txt)$|\.env\.example$'){continue}
 $contents=[IO.File]::ReadAllText($file);$scanned++
 foreach($secret in $secrets){if($contents.Contains($secret.Value)){Write-Output "Potential credential match: $entry ($($secret.Name))";$hits++}}
 if($contents -match '(?:gsk_[A-Za-z0-9]{20,}|sk-proj-[A-Za-z0-9_-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)'){Write-Output "Potential token/private key pattern: $entry";$hits++}
}
if($hits){throw 'Secret scan found potential matches; values were not printed'}
Write-Output "Secret scan PASS: $scanned repository text files; no local secret values or token/private-key patterns"
