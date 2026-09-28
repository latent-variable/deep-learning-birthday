# Renders short chorus clips for each style caption in music\style-tests, scores lyric clarity, and copies
# the clearest take per style to music\renders\LATEST. Each round gets its own folder under
# music\renders\style-tests\<Round>. Use this to lock the sound before spending GPU time on full-length takes.
param(
    [Parameter(Mandatory)] [string]$Round,
    [Parameter(Mandatory)] [string[]]$Styles,
    [Parameter(Mandatory)] [string]$LyricsPath,
    [string]$Tag = 'clip',
    [double]$Duration = 50,
    [int]$AceTakes = 4,
    [int]$MiniMaxTakes = 0,
    [int]$YuE2Takes = 0
)

$ProjectRoot = 'C:\AI\deep-learning-birthday'
$StyleDir = Join-Path $ProjectRoot 'music\style-tests'
$Out = Join-Path $ProjectRoot "music\renders\style-tests\$Round"
$Latest = Join-Path $ProjectRoot 'music\renders\LATEST'
New-Item -ItemType Directory -Force $Out | Out-Null

function Stop-MusicComfy {
    Get-CimInstance Win32_Process -Filter "name='python.exe'" | Where-Object { $_.CommandLine -match 'ComfyUI-music' } |
        ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
}

if ($AceTakes -gt 0) {
    Stop-MusicComfy
    Write-Host 'STYLE stage: acestep'
    $env:ACESTEP_CHECKPOINTS_DIR = Join-Path $ProjectRoot 'models\ACE-Step'
    $env:HF_HOME = Join-Path $ProjectRoot 'cache\huggingface'
    $env:HF_HUB_CACHE = Join-Path $env:HF_HOME 'hub'
    $env:PYTHONIOENCODING = 'utf-8'
    # @() keeps a single caption from being splatted to python one character at a time.
    $Captions = @($Styles | ForEach-Object { Join-Path $StyleDir "$_.caption.txt" })
    Push-Location (Join-Path $ProjectRoot 'ACE-Step-1.5')
    & .\.venv\Scripts\python.exe (Join-Path $PSScriptRoot 'run_acestep_batch.py') --caption @Captions --lyrics $LyricsPath `
        --name 'style' --per-caption-names --out-dir $Out --duration $Duration --rounds 1 --batch $AceTakes *>&1 |
        Where-Object { "$_" -match '^saved |round |Error|failed' } | ForEach-Object { "$_" }
    Pop-Location
    Get-ChildItem $Out -Filter 'style-*-xl-sft-seed*.flac' | Rename-Item -NewName { $_.Name -replace '-xl-sft-', "-acestep-$Tag-" }
}

foreach ($Run in @(@{ Model = 'minimax'; Takes = $MiniMaxTakes; Caption = 'minimax-caption' }, @{ Model = 'yue2'; Takes = $YuE2Takes; Caption = 'caption' })) {
    if ($Run.Takes -lt 1) { continue }
    Write-Host "STYLE stage: $($Run.Model)"
    foreach ($Style in $Styles) {
        try {
            & (Join-Path $PSScriptRoot 'run_comfy_song.ps1') -Model $Run.Model -Takes $Run.Takes -Duration $Duration `
                -CaptionPath (Join-Path $StyleDir "$Style.$($Run.Caption).txt") -LyricsPath $LyricsPath `
                -OutputName "style-$Style-$($Run.Model)-$Tag" -RenderDir $Out
        } catch { Write-Host "STYLE $($Run.Model) $Style FAILED: $_" }
    }
}
Stop-MusicComfy

Write-Host 'STYLE stage: scoring'
$env:HF_HOME = Join-Path $ProjectRoot 'cache\huggingface'
$env:HF_HUB_DISABLE_SYMLINKS_WARNING = '1'
& (Join-Path $ProjectRoot 'tools\whisper-venv\Scripts\python.exe') (Join-Path $PSScriptRoot 'score_lyrics.py') $LyricsPath $Out `
    --device cuda --pick-best $Latest *>&1 | Where-Object { "$_" -notmatch 'HF_TOKEN|warn|^scored' } | ForEach-Object { "$_" }
Write-Host 'STYLE done'
