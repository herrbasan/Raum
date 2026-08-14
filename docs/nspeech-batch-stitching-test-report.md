# Report: Server-Side Batch Stitching — First Test Results

> **From:** RAUM project (client)
> **Date:** 2026-08-14
> **Re:** `docs/nspeech-chunking-handover.md` — the auto-chunking you implemented
> **Test setup:** ElevenLabs / Melon 3 (`tLz0KTPteAXd06XSE8k3`) / `eleven_v3`, `extra_body: { batch: true }`, MP3 out

## What works ✅

| Test | Input | Result |
|---|---|---|
| Single chunk | ~20 chars | OK, **4.0 s**, 26 KB |
| Two chunks | 6000 chars (AI-makes-mistakes excerpt) | OK, **200.5 s**, 7642 KB |
| Four chunks | 14,123 chars (the-ghost-in-the-agent, full post) | **FAILED** — connection closed by server after **607.3 s** (client timeout was 900 s, so this is not a client-side abort). No output. |

The 2-chunk response is a valid MP3 of the expected size. Client-side chunking logic removed from RAUM's script — we now send the full text in one request with `batch: true`, server handles the rest. Exactly the API we hoped for.

## What concerns us ⚠️

### 1. 200 s for 2 chunks is slower than the naive client loop

Old client-side approach (2 × ~4000-char streaming requests + 5 s sleep): **~90–120 s** total.
New server-side batch stitching, same text length: **200 s**.

Per-chunk cost roughly doubled. Suspects (please verify):
- **Batch endpoint latency**: the ElevenLabs adapter's batch path posts to the *non-streaming* `/text-to-speech` endpoint, which we suspect is slower per chunk than the streaming one. Since stitching buffers everything in PCM anyway, chunk generation could keep using the streaming endpoint — TTFC advantage is irrelevant here, but throughput may be better.
- **Overlap re-render**: chunk N regenerates chunk N−1's last paragraph. Expected cost (~10–15% more text per joint) — doesn't fully explain 2×.
- **Alignment serialization**: are joints aligned strictly after all generation? If so, pipelining (align joint N while ElevenLabs generates chunk N+1) would hide most of the align cost.
- **Align worker cold start** on first-ever request (worker spawned at our first test). The 4 s short test came after, so probably not a factor in the 200 s — but worth logging.

### 2. No progress visibility killed the big job (probably unnecessarily)

The real target — 14,123 chars (4 chunks) — we **aborted client-side after ~5–6 min** of silence. Server status showed the STT worker `inFlight: 1`, so it was working, likely just slow (at the observed rate: ~400+ s total). Two problems:
- **`/v1/admin/events` carries no per-request progress.** For a 4+ chunk job the client stares at a black box for minutes. Please emit events like `chunk_generated {n, total, ms}`, `joint_aligned {n, ms}`, `stitch_complete {ms}`.
- **Client abort = leaked visible work.** After our abort, `inFlight` stayed 1. Verify the request path cleans up (or is idempotent) when the HTTP client disconnects mid-batch.

### 3. Seam quality: unverified

We didn't save the 2-chunk test audio, so no listening verdict on the overlap-trim seam yet. Will re-run and report. If the joint is clean, the 2× duration may still be acceptable for offline rendering; but it compounds badly at 4+ chunks.

## Suggested next steps (priority order)

1. **Emit per-request progress events** — makes every other debugging step tractable.
2. **Profile where the 200 s goes** (generation vs align vs transcode) — the events from (1) give you this for free.
3. **Pipeline align with generation** — likely the biggest easy win for long texts.
4. **Consider streaming endpoint for chunk generation** in batch mode if the profile shows the non-streaming calls are the slow part.
5. **Verify abort cleanup** (inFlight leak).

## Reproduction

```powershell
# The 2-chunk test (200.5 s)
$text = <6000 chars from any RAUM post>   # content/posts/ai-makes-mistakes.md, cleaned
$body = @{ model='elevenlabs'; input=$text; voice='tLz0KTPteAXd06XSE8k3';
           response_format='mp3'; extra_body=@{ model='eleven_v3'; batch=$true } }
# POST http://192.168.0.100:2233/v1/audio/speech (UTF-8 bytes)

# The aborted 4-chunk job
# .\tools\generate-tts.ps1 -Slug the-ghost-in-the-agent   (14,123 chars)
```
