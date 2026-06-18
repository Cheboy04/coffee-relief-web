// Subsample a frame-sequence directory: keep 1 of every N frames and rename
// the survivors to a contiguous 0-indexed sequence (frame_000000.webp ...).
// The canvas loaders build URLs by index, so frames MUST stay contiguous.
//
// Usage: node scripts/subsample-frames.mjs <dir> <factor>
//   node scripts/subsample-frames.mjs public/frames 2
//
// Reversible via git (operate on committed assets, verify, then commit).

import fs from 'node:fs'
import path from 'node:path'

const [, , dir, factorArg] = process.argv
const factor = Number(factorArg)

if (!dir || !Number.isInteger(factor) || factor < 2) {
  console.error('Usage: node scripts/subsample-frames.mjs <dir> <factor>=2..')
  process.exit(1)
}

const pad = (n) => String(n).padStart(6, '0')

const frames = fs
  .readdirSync(dir)
  .filter((f) => /^frame_\d{6}\.webp$/.test(f))
  .sort()

if (frames.length === 0) {
  console.error(`No frame_NNNNNN.webp files in ${dir}`)
  process.exit(1)
}

// Keep every Nth frame (indices 0, N, 2N, ...).
const kept = frames.filter((_, i) => i % factor === 0)

// Stage survivors in a temp dir with new contiguous names, then swap in.
const tmp = path.join(dir, '__subsample_tmp')
fs.rmSync(tmp, { recursive: true, force: true })
fs.mkdirSync(tmp)

kept.forEach((name, i) => {
  fs.copyFileSync(path.join(dir, name), path.join(tmp, `frame_${pad(i)}.webp`))
})

// Remove all originals, move the renumbered survivors back.
for (const f of frames) fs.rmSync(path.join(dir, f))
for (const f of fs.readdirSync(tmp)) {
  fs.renameSync(path.join(tmp, f), path.join(dir, f))
}
fs.rmSync(tmp, { recursive: true, force: true })

console.log(`${dir}: ${frames.length} -> ${kept.length} frames (factor ${factor})`)
