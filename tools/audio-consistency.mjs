// Pre-deploy consistency sweep (2026-09-25): audio/manifest/canonical cross-checks.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';

const m = JSON.parse(readFileSync('content/index.json', 'utf8'));
const problems = [];
const audioDir = readdirSync('content/audio');

// 1. Every manifest audio file exists in repo, is non-trivial, and is referenced
// by a player block in the canonical with the SAME filename.
for (const p of m.posts) {
  for (const [lang, file] of Object.entries(p.audio || {})) {
    if (!audioDir.includes(file)) { problems.push(`${p.slug} [${lang}]: manifest audio missing in repo: ${file}`); continue; }
    const size = statSync(`content/audio/${file}`).size;
    if (size < 500_000) problems.push(`${p.slug} [${lang}]: suspiciously small audio (${size}B): ${file}`);
    const mdFile = lang === 'de' ? p.de.file : p.file;
    const md = readFileSync(`content/posts/${mdFile}`, 'utf8');
    if (!md.includes('preset=player')) problems.push(`${p.slug} [${lang}]: audio wired but no player block in ${mdFile}`);
    else if (!md.includes(`](tts/${file})`)) problems.push(`${p.slug} [${lang}]: player block references a different file than manifest: ${file}`);
  }
}

// 2. Reverse: every player block in a canonical has a manifest audio entry.
for (const p of m.posts) {
  for (const [file, hasDe] of [[p.file, false], p.de ? [p.de.file, true] : [null, false]]) {
    if (!file) continue;
    const md = readFileSync(`content/posts/${file}`, 'utf8');
    const players = [...md.matchAll(/\]\(tts\/([^)]+\.mp3)\)/g)].map(x => x[1]);
    for (const pf of players) {
      const lang = hasDe ? 'de' : 'en';
      if (p.audio?.[lang] !== pf) problems.push(`${p.slug} [${lang}]: player references ${pf} but manifest has ${p.audio?.[lang] ?? 'nothing'}`);
      if (!audioDir.includes(pf)) problems.push(`${p.slug}: player references ${pf} not present in repo audio`);
    }
  }
}

// 3. dist check: every DE/EN post page with a manifest audio entry serves the MP3.
//    (build copies content/audio wholesale, so repo presence ⇒ dist presence; spot-check count)
const distAudio = existsSync('dist/content/audio') ? readdirSync('dist/content/audio') : [];
const repoAudioCount = audioDir.filter(f => f.endsWith('.mp3')).length;
const distAudioCount = distAudio.filter(f => f.endsWith('.mp3')).length;
if (repoAudioCount !== distAudioCount) problems.push(`dist audio count (${distAudioCount}) != repo audio count (${repoAudioCount})`);

console.log(problems.length ? `PROBLEMS (${problems.length}):\n` + problems.join('\n') : `ALL CHECKS PASS — ${repoAudioCount} MP3s, manifest/player/reference cross-consistent`);
