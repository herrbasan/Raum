<#
.SYNOPSIS
  Generate TTS audio for a RAUM blog post via nSpeech (default: MiniMax 2.8 Turbo).

.DESCRIPTION
  Reads a post markdown file from MCP storage (canonical), strips YAML
  frontmatter + heading markers, injects a spoken publication-date line, and
  sends the text to nSpeech. Server-side stitch mode produces one seamless MP3,
  saved canonically to storage blog/posts/tts/ and mirrored to content/audio/.

  Engine/voice map (Agents.md §10): default tier is MiniMax Speech 2.8 Turbo
  (Melon_best EN / Simon_DE DE). -Tier hd|eleven switches to premium engines.

.PARAMETER Slug
  The post slug (matches the filename without .md and the index.json slug field).

.PARAMETER Language
  Optional. "en" (default) or "de". Determines which markdown file to read
  and what audio filename to produce.

.PARAMETER Tier
  Optional. hd (default, MiniMax Speech 2.8 HD) | turbo | eleven.
  ElevenLabs only on explicit request.

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
    [string]$Tier = 'hd',

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

# --- Canonical locations (storage is the source of truth, the repo mirrors) ---
$StoragePosts = 'X:\blog\posts'   # MCP storage mount
$StorageTts   = Join-Path $StoragePosts 'tts'
$RepoPosts    = Join-Path $ProjectRoot 'content\posts'
$RepoAudio    = Join-Path $ProjectRoot 'content\audio'

if (-not (Test-Path $StoragePosts)) {
    Write-Error "Storage not reachable at $StoragePosts — is the X: mount up?"
    exit 1
}

# --- Resolve markdown file (canonical: storage) ---
$MdFile = if ($Language -eq 'de') { "${Slug}_de.md" } else { "${Slug}.md" }
$MdPath = Join-Path $StoragePosts $MdFile

if (-not (Test-Path $MdPath)) {
    Write-Error "Post not found in storage: $MdPath"
    exit 1
}

# Drift check: the repo mirror should be byte-identical to the canonical.
# Audio is generated from the storage text; a stale repo copy means the
# published page and the audio would disagree.
$RepoCopy = Join-Path $RepoPosts $MdFile
if (Test-Path $RepoCopy) {
    $a = [System.IO.File]::ReadAllBytes($MdPath)
    $b = [System.IO.File]::ReadAllBytes($RepoCopy)
    if (-not ($a.Length -eq $b.Length -and -not (Compare-Object $a $b))) {
        Write-Host "WARNING: repo mirror differs from storage canonical ($MdFile) — sync before publishing." -ForegroundColor Red
    }
} else {
    Write-Host "WARNING: no repo mirror at $RepoCopy — sync before publishing." -ForegroundColor Red
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

# --- Prepare output path (canonical: storage posts/tts/, mirrored to repo) ---
if (-not (Test-Path $StorageTts)) {
    New-Item -ItemType Directory -Path $StorageTts | Out-Null
    Write-Host "Created: $StorageTts" -ForegroundColor DarkGray
}
if (-not (Test-Path $RepoAudio)) {
    New-Item -ItemType Directory -Path $RepoAudio | Out-Null
    Write-Host "Created: $RepoAudio" -ForegroundColor DarkGray
}

$langSuffix = if ($Language -eq 'de') { '_de' } else { '' }
$AudioFile = "${Slug}${langSuffix}_${version}.mp3"
$AudioPath = Join-Path $StorageTts $AudioFile

# Cost rule (Agents.md §10): one version, one file — never regenerate over an
# existing rendition of the same version.
if (Test-Path $AudioPath) {
    Write-Host "Audio already exists for version $version — nothing to do: $AudioPath" -ForegroundColor Yellow
    exit 0
}

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
    if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
    Write-Error ("nSpeech request failed: " + $_.Exception.Message)
    exit 1
}

# --- Save audio (storage canonical, then mirror to repo) ---
[System.IO.File]::WriteAllBytes($AudioPath, $response.RawContentStream.ToArray())
Copy-Item $AudioPath (Join-Path $RepoAudio $AudioFile) -Force
$sizeKb = [math]::Round((Get-Item $AudioPath).Length / 1KB)

Write-Host ""
Write-Host "Done! Saved: $AudioPath ($sizeKb KB)" -ForegroundColor Green
Write-Host "Mirrored: $(Join-Path $RepoAudio $AudioFile)" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
$label = if ($Language -eq 'de') { 'Diesen Artikel anhören' } else { 'Listen to this article' }
Write-Host "  1. Player block in the canonical post (blog/posts/$MdFile), after the byline block:" -ForegroundColor White
Write-Host "       <!-- mb:block preset=player kind=audio -->" -ForegroundColor DarkGray
Write-Host "       [$label](tts/$AudioFile)" -ForegroundColor DarkGray
Write-Host "       <!-- mb:/block -->" -ForegroundColor DarkGray
Write-Host "  2. Manifest: add `"$Language`": `"$AudioFile`" to the post's audio object in content/index.json" -ForegroundColor White
Write-Host "  3. Mirror the post into the repo, then rebuild (node tools/build.mjs)" -ForegroundColor White
