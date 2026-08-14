<#
.SYNOPSIS
  Generate TTS audio for a RAUM blog post via nSpeech (ElevenLabs, Melon 3).

.DESCRIPTION
  Reads a post markdown file, strips YAML frontmatter + H1 + byline,
  sends the clean prose to nSpeech, and saves the MP3 to content/audio/.

  The audio filename follows the same convention as the markdown:
    EN: content/audio/{slug}.mp3
    DE: content/audio/{slug}_de.mp3

  After generation, the script prints a reminder to add the audio path
  to content/index.json if not already present.

.PARAMETER Slug
  The post slug (matches the filename without .md and the index.json slug field).

.PARAMETER Language
  Optional. "en" (default) or "de". Determines which markdown file to read
  and what audio filename to produce.

.PARAMETER NSpeechUrl
  Optional. Defaults to http://192.168.0.100:2233.

.EXAMPLE
  .\tools\generate-tts.ps1 -Slug the-hand-that-draws-itself
  .\tools\generate-tts.ps1 -Slug the-hand-that-draws-itself -Language de
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Slug,

    [ValidateSet('en', 'de')]
    [string]$Language = 'en',

    [string]$NSpeechUrl = 'http://192.168.0.100:2233'
)

$ErrorActionPreference = 'Stop'

# --- Config ---
$VoiceId   = 'tLz0KTPteAXd06XSE8k3'   # Melon 3 (ElevenLabs)
$Model     = 'elevenlabs'
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

# --- Generate (server-side auto-chunking) ---
# nSpeech handles chunking transparently when text exceeds engine limits.
# batch=true enables seamless stitching: overlap paragraph + forced-alignment
# trim via the local MMS aligner (eliminates cold-start artifact at joints).
$apiUrl = "$NSpeechUrl/v1/audio/speech"

$body = @{
    model           = $Model
    input           = $clean
    voice           = $VoiceId
    response_format = 'mp3'
    extra_body      = @{
        model = 'eleven_v3'
        batch = $true
    }
} | ConvertTo-Json -Depth 5
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)

Write-Host "Generating audio via nSpeech ($Model / Melon 3, batch stitching)..." -ForegroundColor Yellow

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
