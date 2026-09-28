# Starts the isolated music ComfyUI (MiniMax Music 3) on localhost:8189.
# Separate from the FineBusiness video install in C:\AI\ComfyUI_windows_portable (port 8188).
param(
    [int]$Port = 8189,
    [switch]$Foreground
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = 'C:\AI\deep-learning-birthday'
$ComfyRoot = Join-Path $ProjectRoot 'ComfyUI-music'
$Python = Join-Path $ComfyRoot '.venv\Scripts\python.exe'
$Url = "http://127.0.0.1:$Port"

if (-not (Test-Path -LiteralPath $Python)) {
    throw "Music ComfyUI environment not found at $Python."
}

try {
    Invoke-WebRequest "$Url/system_stats" -UseBasicParsing -TimeoutSec 3 | Out-Null
    Write-Host "Music ComfyUI already running at $Url"
    return
} catch { }

$ComfyArgs = @('-s', 'main.py', '--listen', '127.0.0.1', '--port', "$Port", '--reserve-vram', '3', '--disable-smart-memory')
if ($Foreground) {
    Push-Location $ComfyRoot
    try { & $Python @ComfyArgs } finally { Pop-Location }
    return
}

$LogDir = Join-Path $ProjectRoot 'cache\logs'
New-Item -ItemType Directory -Force $LogDir | Out-Null
Start-Process -FilePath $Python -ArgumentList $ComfyArgs -WorkingDirectory $ComfyRoot -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $LogDir 'music-comfyui.out.log') `
    -RedirectStandardError (Join-Path $LogDir 'music-comfyui.err.log')

$Deadline = (Get-Date).AddMinutes(3)
while ((Get-Date) -lt $Deadline) {
    Start-Sleep -Seconds 3
    try {
        Invoke-WebRequest "$Url/system_stats" -UseBasicParsing -TimeoutSec 3 | Out-Null
        Write-Host "Music ComfyUI ready at $Url"
        return
    } catch { }
}
throw "Music ComfyUI did not start; see $LogDir\music-comfyui.err.log"
