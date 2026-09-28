param(
    [switch]$Api,
    # Use the 8-step XL Turbo DiT for fast drafts instead of the 50-step XL SFT quality model.
    [switch]$Turbo
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = 'C:\AI\deep-learning-birthday'
$Repo = Join-Path $ProjectRoot 'ACE-Step-1.5'
$Python = Join-Path $Repo '.venv\Scripts\python.exe'
$Checkpoints = Join-Path $ProjectRoot 'models\ACE-Step'
if (-not (Test-Path -LiteralPath $Python)) {
    throw "ACE-Step environment not found at $Python. Finish setup with README instructions."
}

function Test-Checkpoint([string]$Name) {
    $Dir = Join-Path $Checkpoints $Name
    $Index = Join-Path $Dir 'model.safetensors.index.json'
    if (Test-Path -LiteralPath $Index) {
        $Shards = (Get-Content -LiteralPath $Index -Raw | ConvertFrom-Json).weight_map.PSObject.Properties.Value | Sort-Object -Unique
        return @($Shards | Where-Object { -not (Test-Path -LiteralPath (Join-Path $Dir $_)) }).Count -eq 0
    }
    return Test-Path -LiteralPath (Join-Path $Dir 'model.safetensors')
}

$env:ACESTEP_CHECKPOINTS_DIR = $Checkpoints
# Upstream's best-quality pairing for 24 GB: XL SFT DiT + 4B LM. Fall back if downloads are incomplete.
$DiTOrder = if ($Turbo) { 'acestep-v15-xl-turbo', 'acestep-v15-turbo' } else { 'acestep-v15-xl-sft', 'acestep-v15-xl-turbo', 'acestep-v15-turbo' }
$env:ACESTEP_CONFIG_PATH = $DiTOrder | Where-Object { Test-Checkpoint $_ } | Select-Object -First 1
$env:ACESTEP_LM_MODEL_PATH = 'acestep-5Hz-lm-4B', 'acestep-5Hz-lm-1.7B' | Where-Object { Test-Checkpoint $_ } | Select-Object -First 1
Write-Host "ACE-Step DiT: $env:ACESTEP_CONFIG_PATH  LM: $env:ACESTEP_LM_MODEL_PATH"
$env:ACESTEP_INIT_LLM = 'auto'
$env:HF_HOME = Join-Path $ProjectRoot 'cache\huggingface'
$env:HF_HUB_CACHE = Join-Path $env:HF_HOME 'hub'
$env:UV_CACHE_DIR = Join-Path $ProjectRoot 'cache\uv'
$env:UV_PYTHON_INSTALL_DIR = Join-Path $ProjectRoot 'tools\python'

Push-Location $Repo
try {
    if ($Api) {
        & $Python -m acestep.api_server --host 127.0.0.1 --port 8001
    } else {
        & $Python -m acestep.acestep_v15_pipeline --server-name 127.0.0.1 --port 7860 --config_path $env:ACESTEP_CONFIG_PATH --lm_model_path $env:ACESTEP_LM_MODEL_PATH
    }
} finally {
    Pop-Location
}
