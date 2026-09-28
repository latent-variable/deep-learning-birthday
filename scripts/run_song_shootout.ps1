# Renders the current lyric on every local song model back to back, then scores lyric intelligibility.
# One model holds the GPU at a time; keep the FineBusiness video ComfyUI (8188) idle while this runs.
param(
    [int]$AceRounds = 2,
    [int]$AceBatch = 2,
    [int]$YuE2Takes = 2,
    [int]$MiniMaxTakes = 3
)

$ProjectRoot = 'C:\AI\deep-learning-birthday'
$Renders = Join-Path $ProjectRoot 'music\renders'

function Stop-MusicComfy {
    Get-CimInstance Win32_Process -Filter "name='python.exe'" | Where-Object { $_.CommandLine -match 'ComfyUI-music' } |
        ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
}

# Let any take already running on the music ComfyUI finish, then collect its output.
try {
    while (((Invoke-RestMethod 'http://127.0.0.1:8189/queue' -TimeoutSec 5).queue_running.Count) -gt 0) { Start-Sleep 15 }
} catch { }
foreach ($Model in 'yue2', 'minimax') {
    New-Item -ItemType Directory -Force (Join-Path $Renders $Model) | Out-Null
    Get-ChildItem (Join-Path $ProjectRoot 'ComfyUI-music\output\audio') -Filter "look-what-we-see-now-v2-$Model-seed*" -File -ErrorAction SilentlyContinue |
        ForEach-Object { Copy-Item $_.FullName (Join-Path $Renders "$Model\$($_.Name -replace '_\d{5}_?(?=\.)', '')") -Force }
}
Stop-MusicComfy
Write-Host 'SHOOTOUT stage: acestep'

$env:ACESTEP_CHECKPOINTS_DIR = Join-Path $ProjectRoot 'models\ACE-Step'
$env:HF_HOME = Join-Path $ProjectRoot 'cache\huggingface'
$env:HF_HUB_CACHE = Join-Path $env:HF_HOME 'hub'
$env:PYTHONIOENCODING = 'utf-8'
Push-Location (Join-Path $ProjectRoot 'ACE-Step-1.5')
& .\.venv\Scripts\python.exe (Join-Path $PSScriptRoot 'run_acestep_batch.py') --rounds $AceRounds --batch $AceBatch *>&1 |
    Where-Object { "$_" -match '^saved |^round |Error|failed' } | ForEach-Object { "$_" }
Pop-Location

foreach ($Run in @(@{ Model = 'yue2'; Takes = $YuE2Takes }, @{ Model = 'minimax'; Takes = $MiniMaxTakes })) {
    if ($Run.Takes -lt 1) { continue }
    Write-Host "SHOOTOUT stage: $($Run.Model)"
    try { & (Join-Path $PSScriptRoot 'run_comfy_song.ps1') -Model $Run.Model -Takes $Run.Takes }
    catch { Write-Host "SHOOTOUT $($Run.Model) FAILED: $_" }
}
Stop-MusicComfy

Write-Host 'SHOOTOUT stage: scoring'
& (Join-Path $ProjectRoot 'tools\whisper-venv\Scripts\python.exe') (Join-Path $PSScriptRoot 'score_lyrics.py') `
    (Join-Path $ProjectRoot 'music\lyrics\look-what-we-see-now-v2.plain-tags.txt') `
    (Join-Path $Renders 'acestep') (Join-Path $Renders 'yue2') (Join-Path $Renders 'minimax') --device cuda *>&1 |
    Where-Object { "$_" -notmatch 'warn|symlink|developer|HF_TOKEN' } | ForEach-Object { "$_" }
Write-Host 'SHOOTOUT done'
