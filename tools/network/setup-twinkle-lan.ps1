# requires -RunAsAdministrator

$RuleName = "T-Winkle-LAN-TCP-5656"
$RuleDisplayName = "T-Winkle LAN Access TCP 5656"
$Port = 5656
$Interface = "Wi-Fi"
$Profile = "Public"
$RemoteAddress = "LocalSubnet4"

Write-Host "========================================"
Write-Host "T-WINKLE LAN ACCESS SETUP"
Write-Host "========================================"

# 1. Check existing rule
$existingRule = Get-NetFirewallRule -Name $RuleName -ErrorAction SilentlyContinue

if ($existingRule) {
    Write-Host "[INFO] Firewall rule '$RuleName' already exists. Skipping creation." -ForegroundColor Yellow
} else {
    Write-Host "[INFO] Creating narrow firewall rule for T-Winkle LAN Access..." -ForegroundColor Cyan
    New-NetFirewallRule -Name $RuleName `
                        -DisplayName $RuleDisplayName `
                        -Direction Inbound `
                        -Action Allow `
                        -Protocol TCP `
                        -LocalPort $Port `
                        -InterfaceAlias $Interface `
                        -Profile $Profile `
                        -RemoteAddress $RemoteAddress `
                        -Enabled True | Out-Null
    Write-Host "[SUCCESS] Firewall rule created." -ForegroundColor Green
}

# 2. Get current PC IPv4 on Wi-Fi
$ipInfo = Get-NetIPAddress -InterfaceAlias $Interface -AddressFamily IPv4 -ErrorAction SilentlyContinue
if ($ipInfo) {
    $ipAddress = $ipInfo.IPAddress
    Write-Host ""
    Write-Host "========================================"
    Write-Host "NETWORK INFORMATION"
    Write-Host "========================================"
    Write-Host "Interface: $Interface"
    Write-Host "IPv4 Address: $ipAddress"
    Write-Host ""
    Write-Host "--> Expected Access URL: http://${ipAddress}:${Port}" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Could not detect IPv4 address for interface '$Interface'." -ForegroundColor Red
}

# 3. Verify Listener Status
Write-Host ""
Write-Host "========================================"
Write-Host "LISTENER STATUS (TCP $Port)"
Write-Host "========================================"
$listener = netstat -ano | findstr :$Port
if ($listener) {
    Write-Host $listener
    Write-Host "[SUCCESS] Application is actively listening on port $Port." -ForegroundColor Green
} else {
    Write-Host "[WARNING] No listener found on port $Port. Please ensure T-Winkle is running (server.address=0.0.0.0, server.port=$Port)." -ForegroundColor Red
}

Write-Host "========================================"
Write-Host "Setup Complete."
