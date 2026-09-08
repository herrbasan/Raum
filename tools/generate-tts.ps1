<#
.SYNOPSIS
  Generate TTS audio for a RAUM blog post via nSpeech (default: MiniMax 2.8 Turbo).

.DESCRIPTION
  Reads a post markdown file, strips YAML frontmatter + heading markers,
  injects a spoken publication-date line, and sends the text to nSpeech.
  Server-side stitch mode produces one seamless MP3, saved to content/audio/.

  Engine/voice map (Agents.md §10): default tier is MiniMax Speech 2.8 Turbo
  (Melon_best EN / Simon_DE DE). -Tier hd|eleven switches to premium engines.

.PARAMETER Slug
  The post slug (matches the filename without .md and the index.json slug field).

.PARAMETER Language
  Optional. "en" (default) or "de". Determines which markdown file to read
  and what audio filename to produce.

.PARAMETER Tier
  Optional. turbo (default) | hd | eleven. Premium tiers only on explicit request.

.PARAMETER NSpeechUrl
  Optional. Defaults to http://192.168.0.100:2233.

.EXAMPLE
  .\tools\generate-tts.ps1 -Slug the-hand-that-draws-itself
  .\tools\generate-tts.ps1 -Slug the-hand-that-draws-itself -Language de
  .\tools\generate-tts.ps1 -Slug the-rupture -Tier eleven
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

# --- Resolve markdown file ---
$MdFile = if ($Language -eq 'de') { "${Slug}_de.md" } else { "${Slug}.md" }
$MdPath = Join-Path $ProjectRoot "content\posts\$MdFile"

if (-not (Test-Path $MdPath)) {
    Write-Error "Post not found: $MdPath"
    exit 1
}

Write-Host "Reading: $MdPath" -ForegroundColor Cyan

# --- Read markdown ---
$raw = Get-Content $MdPath -Raw -Encoding UTF8

# --- Extract metadata from YAML frontmatter ---
$versionMatch = $raw -match '(?m)^version:\s*["'']?(\d{4}-\d{2}-\d{2})["'']?\s*$'
$version = if ($versionMatch) { $Matches[1] } else { (Get-Date -Format 'yyyy-MM-dd') }
Write-Host "Post version: $version" -ForegroundColor Cyan

# Extract date (created) from frontmatter
$dateMatch = $raw -match '(?m)^created:\s*(\d{4}-\d{2}-\d{2})'
$date = if ($dateMatch) { $Matches[1] } else { '' }

# --- Compose TTS input from markdown ---
# Strip YAML frontmatter only.
$clean = $raw -replace '(?s)^---\r?\n.*?\r?\n---\r?\n?', ''

# Strip markdown heading markers (#, ##, ###) — keep the text, just remove
# the # symbols so the TTS engine doesn't vocalize them.
$clean = $clean -replace '(?m)^(#{1,6})\s+', ''

# Insert the publication date after the byline
if ($date) {
    if ($Language -eq 'de') {
        # Format: 30.07.2026
        $dateFormatted = [datetime]::ParseExact($date, 'yyyy-MM-dd', $null).ToString('dd.MM.yyyy')
        $dateLine = "Veröffentlicht am $dateFormatted"
    } else {
        $dateLine = "Published at $date"
    }
    $clean = $clean -replace '(?m)^(\*(?:by|von)\s+.+\*?\s*)$', "`$1`n`n$dateLine`n"
}

# Strip markdown formatting that TTS shouldn't read literally:
#   - Image syntax ![alt](url) -> alt text
$clean = $clean -replace '!\[([^\]]*)\]\([^)]+\)', '$1'
#   - Link URLs: [text](url) -> text
$clean = $clean -replace '\[([^\]]*)\]\([^)]+\)', '$1'
#   - Horizontal rules
$clean = $clean -replace '(?m)^---+$', ''
# Collapse multiple blank lines
$clean = $clean -replace '(\r?\n){3,}', "`n`n"
$clean = $clean.Trim()

if ([string]::IsNullOrWhiteSpace($clean)) {
    Write-Error "No text content found after cleaning."
    exit 1
}

$charCount = $clean.Length
$wordCount = ($clean -split '\s+').Count
Write-Host "Text: $wordCount words, $charCount characters" -ForegroundColor Cyan

# --- Prepare output path ---
$AudioDir = Join-Path $ProjectRoot 'content\audio'
if (-not (Test-Path $AudioDir)) {
    New-Item -ItemType Directory -Path $AudioDir | Out-Null
    Write-Host "Created: $AudioDir" -ForegroundColor DarkGray
}

$langSuffix = if ($Language -eq 'de') { '_de' } else { '' }
$AudioFile = "${Slug}${langSuffix}_${version}.mp3"
$AudioPath = Join-Path $AudioDir $AudioFile

# --- Generate (server-side stitch pipeline) ---
# mode:stitch = seamless joins (overlap + forced-alignment trim) server-side.
# clean:true = server-authoritative markdown cleaning on top of our light pre-clean.
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
        -TimeoutSec 600 `
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
Write-Host "Next: add to content/index.json under this post:" -ForegroundColor Cyan
$langKey = $Language
Write-Host ('  "audio": { "' + $langKey + '": "' + $AudioFile + '" }') -ForegroundColor White
Write-Host "(merge into existing audio object if one already exists)" -ForegroundColor DarkGray
