# Renders song takes with MiniMax Music 3 or YuE2 on the isolated music ComfyUI and copies them to music\renders.
param(
    [ValidateSet('minimax', 'yue2')]
    [string]$Model = 'minimax',
    [string]$CaptionPath,
    [string]$LyricsPath = 'C:\AI\deep-learning-birthday\music\lyrics\look-what-we-see-now-v2.plain-tags.txt',
    [string]$OutputName,
    [double]$Duration = 240,
    [long[]]$Seeds = @(),
    [int]$Takes = 1,
    [int]$Port = 8189,
    [string]$RenderDir,
    # Unload models from the FineBusiness video ComfyUI (8188) if its queue is idle, to free VRAM.
    [switch]$FreeVideoComfy
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = 'C:\AI\deep-learning-birthday'
$Lyrics = Join-Path $ProjectRoot 'music\lyrics'

# Per-model graph and node ids: text node(s), seed node(s), duration node, save node.
$Spec = @{
    minimax = @{
        Graph = 'minimax_music3_t2m_api.json'; Caption = 'look-what-we-see-now-v2.minimax-caption.txt'
        TextNodes = @(@{ Id = '4'; Caption = 'caption' }); SeedNodes = @('4', '7'); DurationNode = '4'; SaveNode = '9'
    }
    yue2 = @{
        Graph = 'yue2_t2m_api.json'; Caption = 'look-what-we-see-now-v2.caption.txt'
        TextNodes = @(@{ Id = '2'; Caption = 'style' }, @{ Id = '3'; Caption = 'style' }); SeedNodes = @('2', '3', '6'); DurationNode = '3'; SaveNode = '8'
    }
}[$Model]

if (-not $CaptionPath) { $CaptionPath = Join-Path $Lyrics $Spec.Caption }
if (-not $OutputName) { $OutputName = "look-what-we-see-now-v2-$Model" }
$Graph = Join-Path $ProjectRoot "music\workflows\$($Spec.Graph)"
$ComfyOutput = Join-Path $ProjectRoot 'ComfyUI-music\output'
$Renders = if ($RenderDir) { $RenderDir } else { Join-Path $ProjectRoot "music\renders\$Model" }
$Url = "http://127.0.0.1:$Port"

if ($FreeVideoComfy) {
    try {
        $Queue = Invoke-RestMethod 'http://127.0.0.1:8188/queue' -TimeoutSec 5
        if ($Queue.queue_running.Count -eq 0 -and $Queue.queue_pending.Count -eq 0) {
            Invoke-RestMethod 'http://127.0.0.1:8188/free' -Method Post -ContentType 'application/json' `
                -Body '{"unload_models": true, "free_memory": true}' | Out-Null
            Write-Host 'Unloaded models from the video ComfyUI on 8188.'
        } else {
            throw 'The video ComfyUI on 8188 is busy; wait for it to finish before rendering music.'
        }
    } catch [System.Net.WebException] {
        Write-Host 'Video ComfyUI on 8188 is not running.'
    }
}

& (Join-Path $PSScriptRoot 'start_music_comfyui.ps1') -Port $Port

$CaptionText = (Get-Content -LiteralPath $CaptionPath -Raw -Encoding UTF8).Trim()
$LyricsText = (Get-Content -LiteralPath $LyricsPath -Raw -Encoding UTF8).Trim()
if ($Seeds.Count -eq 0) { $Seeds = 1..$Takes | ForEach-Object { Get-Random -Minimum 1 -Maximum 2147483647 } }
New-Item -ItemType Directory -Force $Renders | Out-Null

foreach ($Seed in $Seeds) {
    $Prompt = Get-Content -LiteralPath $Graph -Raw | ConvertFrom-Json
    foreach ($Node in $Spec.TextNodes) {
        $Prompt.($Node.Id).inputs.($Node.Caption) = $CaptionText
        $Prompt.($Node.Id).inputs.lyrics = $LyricsText
    }
    foreach ($Id in $Spec.SeedNodes) { $Prompt.$Id.inputs.seed = $Seed }
    $Prompt.($Spec.DurationNode).inputs.max_duration = $Duration
    $Prompt.($Spec.SaveNode).inputs.filename_prefix = "audio/$OutputName-seed$Seed"

    $Body = @{ prompt = $Prompt; client_id = 'alexnet-music' } | ConvertTo-Json -Depth 20
    $Started = Get-Date
    $Id = (Invoke-RestMethod "$Url/prompt" -Method Post -ContentType 'application/json; charset=utf-8' `
        -Body ([Text.Encoding]::UTF8.GetBytes($Body))).prompt_id
    Write-Host "$Model seed $Seed queued as $Id"

    do {
        Start-Sleep -Seconds 10
        $History = (Invoke-RestMethod "$Url/history/$Id").$Id
        if ($History.status.status_str -eq 'error') {
            throw "$Model seed $Seed failed: $($History.status.messages | ConvertTo-Json -Depth 6 -Compress)"
        }
    } until ($History.outputs.($Spec.SaveNode))

    $File = $History.outputs.($Spec.SaveNode).audio[0]
    $Source = Join-Path (Join-Path $ComfyOutput $File.subfolder) $File.filename
    $Target = Join-Path $Renders "$OutputName-seed$Seed$([IO.Path]::GetExtension($File.filename))"
    Copy-Item -LiteralPath $Source -Destination $Target -Force
    Write-Host ("{0} seed {1} done in {2:N0}s -> {3}" -f $Model, $Seed, ((Get-Date) - $Started).TotalSeconds, $Target)
}
