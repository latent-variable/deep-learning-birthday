# Renders full-length ACE-Step takes of a lyric in one style, scores lyric clarity, and copies the top 3 to
# music\renders\LATEST. Half the takes let the LM rewrite the caption (how the reference clip was made);
# half keep the caption verbatim so the locked style can't drift.
param(
    [Parameter(Mandatory)] [string]$Name,
    [Parameter(Mandatory)] [string]$LyricsPath,
    [string]$Style = 'H6-brat-bubblegum',
    [double]$Duration = 225,
    [int]$TakesPerMode = 4
)

$ProjectRoot = 'C:\AI\deep-learning-birthday'
$Caption = Join-Path $ProjectRoot "music\style-tests\$Style.caption.txt"
$Out = Join-Path $ProjectRoot "music\renders\full-takes\$Name"
New-Item -ItemType Directory -Force $Out | Out-Null

Get-CimInstance Win32_Process -Filter "name='python.exe'" | Where-Object { $_.CommandLine -match 'ComfyUI-music' } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force }

$env:ACESTEP_CHECKPOINTS_DIR = Join-Path $ProjectRoot 'models\ACE-Step'
$env:HF_HOME = Join-Path $ProjectRoot 'cache\huggingface'
$env:HF_HUB_CACHE = Join-Path $env:HF_HOME 'hub'
$env:PYTHONIOENCODING = 'utf-8'
Push-Location (Join-Path $ProjectRoot 'ACE-Step-1.5')
foreach ($Mode in @(@{ Tag = 'cot'; Args = @() }, @{ Tag = 'locked'; Args = @('--no-cot-caption') })) {
    Write-Host "FULL stage: $($Mode.Tag)"
    $Batch = [Math]::Min(2, $TakesPerMode)
    & .\.venv\Scripts\python.exe (Join-Path $PSScriptRoot 'run_acestep_batch.py') --caption $Caption --lyrics $LyricsPath `
        --name "$Name-$Style-$($Mode.Tag)" --out-dir $Out --duration $Duration `
        --rounds ([Math]::Ceiling($TakesPerMode / $Batch)) --batch $Batch @($Mode.Args) *>&1 |
        Where-Object { "$_" -match '^saved |round |Error|failed' } | ForEach-Object { "$_" }
}
Pop-Location

Write-Host 'FULL stage: scoring'
$env:HF_HUB_DISABLE_SYMLINKS_WARNING = '1'
& (Join-Path $ProjectRoot 'tools\whisper-venv\Scripts\python.exe') (Join-Path $PSScriptRoot 'score_lyrics.py') $LyricsPath $Out `
    --device cuda --pick-best (Join-Path $ProjectRoot 'music\renders\LATEST') --top 3 *>&1 |
    Where-Object { "$_" -notmatch 'HF_TOKEN|warn|^scored' } | ForEach-Object { "$_" }
Write-Host 'FULL done'
