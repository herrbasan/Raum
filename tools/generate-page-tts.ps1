<#
.SYNOPSIS
  Generate TTS audio for a RAUM page (religion/about) via nSpeech (default: MiniMax 2.8 Turbo).

.DESCRIPTION
  Long-form stitch pipeline: single POST with the RAW markdown; the server
  cleans it (extra_body.clean = true — strips frontmatter + markdown syntax)
  and stitches chunks seamlessly (extra_body.mode = "stitch"). Saves the MP3
  to content/audio/.

  Engine/voice map (Agents.md §10): default tier is MiniMax Speech 2.8 Turbo
  (Melon_best EN / Simon_DE DE). -Tier hd|eleven switches to premium engines.

.PARAMETER Slug
  The page slug (e.g. religion). Reads content/pages/{slug}.md / {slug}_de.md.

.PARAMETER Language
  Optional. "en" (default) or "de".

.PARAMETER Tier
  Optional. turbo (default) | hd | eleven. Premium tiers only on explicit request.

.EXAMPLE
  .\tools\generate-page-tts.ps1 -Slug religion
  .\tools\generate-page-tts.ps1 -Slug religion -Language de
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Slug,

    [ValidateSet('en', 'de')]
    [string]$Language = 'en',

    [ValidateSet('turbo', 'hd', 'eleven')]
    [string]$Tier = 'turbo',

    [string]$NSpeechUrl = 'http://192.168.0.100:2233'
)

$ErrorActionPreference = 'Stop'

# --- Engine / voice map (Agents.md §10) ---
$Tiers = @{
    turbo  = @{ Model = 'minimax_speech_2_8_turbo'; Voices = @{ en = 'Melon_best';           de = 'Simon_DE' } }
    hd     = @{ Model = 'minimax_speech_2_8_hd';    Voices = @{ en = 'Melon_best';           de = 'Simon_DE' } }
    eleven = @{ Model = 'eleven_v3';                Voices = @{ en = 'tLz0KTPteAXd06XSE8k3'; de = 'XUk2s7njTDG9hbcyjzP1' } }
}
$Model   = $Tiers[$Tier].Model
$VoiceId = $Tiers[$Tier].Voices[$Language]
$ProjectRoot = $PSScriptRoot | Split-Path -Parent

# --- Resolve markdown file (pages live in content/pages/) ---
$MdFile = if ($Language -eq 'de') { "${Slug}_de.md" } else { "${Slug}.md" }
$MdPath = Join-Path $ProjectRoot "content\pages\$MdFile"

if (-not (Test-Path $MdPath)) {
    Write-Error "Page not found: $MdPath"
    exit 1
}

Write-Host "Reading: $MdPath" -ForegroundColor Cyan

# --- Read markdown ---
$raw = Get-Content $MdPath -Raw -Encoding UTF8

# --- Extract version from YAML frontmatter (may be YYYY-MM-DD or YYYY-MM-DD-vN) ---
$versionMatch = $raw -match '(?m)^version:\s*["'']?([A-Za-z0-9\.\-]+)["'']?\s*$'
$version = if ($versionMatch) { $Matches[1] } else { (Get-Date -Format 'yyyy-MM-dd') }
Write-Host "Page version: $version" -ForegroundColor Cyan

# --- TTS input is the RAW markdown; the server cleans it (extra_body.clean:true) ---
# Server-side cleaning is authoritative (2026-08-18 architecture): strips frontmatter,
# markdown syntax, adds header periods, spells out acronyms, etc.
$clean = $raw

if ([string]::IsNullOrWhiteSpace($clean)) {
    Write-Error "No text content found after cleaning."
    exit 1
}

$charCount = $clean.Length
$wordCount = ($clean -split '\s+').Count
Write-Host "Text: $wordCount words, $charCount characters (raw MD; server cleans)" -ForegroundColor Cyan

# --- Prepare output path ---
$AudioDir = Join-Path $ProjectRoot 'content\audio'
if (-not (Test-Path $AudioDir)) {
    New-Item -ItemType Directory -Path $AudioDir | Out-Null
}

$langSuffix = if ($Language -eq 'de') { '_de' } else { '' }
$AudioFile = "${Slug}${langSuffix}_${version}.mp3"
$AudioPath = Join-Path $AudioDir $AudioFile

if (Test-Path $AudioPath) {
    Write-Host "Audio already exists for this version: $AudioFile" -ForegroundColor DarkYellow
    Write-Host "Delete it first if you want to regenerate." -ForegroundColor DarkGray
    exit 0
}

# --- Generate (new stitch pipeline) ---
$apiUrl = "$NSpeechUrl/v1/audio/speech"

$body = @{
    model           = $Model
    input           = $clean
    voice           = $VoiceId
    response_format = 'mp3'
    extra_body      = @{
        mode  = 'stitch'
        clean = $true
    }
} | ConvertTo-Json -Depth 5
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)

Write-Host "Generating audio via nSpeech ($Model / $VoiceId, stitch)..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $apiUrl -Method Post `
        -Headers @{ 'Content-Type' = 'application/json; charset=utf-8' } `
        -Body $bodyBytes `
        -TimeoutSec 900 `
        -UseBasicParsing
} catch {
    Write-Error ("nSpeech request failed: " + $_.Exception.Message)
    if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
    exit 1
}

# --- Save audio ---
[System.IO.File]::WriteAllBytes($AudioPath, $response.RawContentStream.ToArray())
$sizeKb = [math]::Round((Get-Item $AudioPath).Length / 1KB)

Write-Host ""
Write-Host "Done! Saved: $AudioPath ($sizeKb KB)" -ForegroundColor Green
Write-Host ""
Write-Host "Next: add to content/index.json under this page:" -ForegroundColor Cyan
Write-Host ('  "audio": { "' + $Language + '": "' + $AudioFile + '" }') -ForegroundColor White