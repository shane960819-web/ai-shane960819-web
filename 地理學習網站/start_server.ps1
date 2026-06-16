# Windows Built-in HTTP Local Server for Social Studies Learning Hub
# Runs purely on PowerShell without external dependencies (Node/Python)

$workspace = $PSScriptRoot
$port = 8080
$listener = New-Object System.Net.HttpListener

# Try to listen on all interfaces first (allows other devices on same Wi-Fi)
$listenAll = $true
try {
    $listener.Prefixes.Add("http://+:$port/")
    $listener.Start()
    
    # Add firewall rule if it doesn't exist (requires admin)
    if (-not (Get-NetFirewallRule -DisplayName "Social Studies Learning Hub (Port 8080)" -ErrorAction SilentlyContinue)) {
        New-NetFirewallRule -DisplayName "Social Studies Learning Hub (Port 8080)" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow -ErrorAction SilentlyContinue
    }
} catch {
    # If fails (e.g. Access Denied), fall back to localhost only
    $listenAll = $false
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
}

Write-Host "==========================================" -ForegroundColor Green
Write-Host "  Social Studies Hub Local Server" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

if ($listenAll) {
    Write-Host "Server started successfully (Multi-Device Support Enabled)!" -ForegroundColor Green
    Write-Host "On this computer, open:" -ForegroundColor Yellow
    Write-Host "  http://localhost:$port/index.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "On other devices (phones, tablets) connected to the same Wi-Fi, open:" -ForegroundColor Yellow
    
    # Get all active IPv4 addresses of this machine
    $ips = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object -ExpandProperty IPAddress
    foreach ($ip in $ips) {
        Write-Host "  http://$ip`:$port/index.html" -ForegroundColor Cyan
    }
} else {
    Write-Host "Server started successfully (Local Connection Only)" -ForegroundColor Yellow
    Write-Host "On this computer, open:" -ForegroundColor Yellow
    Write-Host "  http://localhost:$port/index.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "NOTE: To enable connection for other devices (phones/tablets):" -ForegroundColor Red
    Write-Host "  Please close this window, right-click '啟動學習網站.bat'," -ForegroundColor Red
    Write-Host "  and select 'Run as Administrator' (以系統管理員身分執行)." -ForegroundColor Red
}

Write-Host "------------------------------------------"
Write-Host "Close this window or press Ctrl+C to stop." -ForegroundColor Gray
Write-Host "=========================================="

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/") { $urlPath = "/index.html" }
        
        # Prevent path traversal
        $normalizedPath = $urlPath.Replace("\", "/").TrimStart('/')
        $filePath = Join-Path $workspace $normalizedPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Determine mime-type
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "application/octet-stream"
            switch ($ext) {
                ".html" { $contentType = "text/html; charset=utf-8" }
                ".css"  { $contentType = "text/css; charset=utf-8" }
                ".js"   { $contentType = "text/javascript; charset=utf-8" }
                ".png"  { $contentType = "image/png" }
                ".jpg"  { $contentType = "image/jpeg" }
                ".jpeg" { $contentType = "image/jpeg" }
                ".svg"  { $contentType = "image/svg+xml; charset=utf-8" }
                ".json" { $contentType = "application/json; charset=utf-8" }
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 File Not Found</h1><p>The requested file could not be found.</p>")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} catch {
    # Silence loop exit exceptions on stop
} finally {
    if ($listener) {
        $listener.Stop()
    }
}
