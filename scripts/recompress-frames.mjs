// Re-encode every frame_*.webp in a directory to a lower WebP quality.
// Background scrub frames (with grain + gradient overlays) don't need the
// near-lossless quality the source frames ship at.
//
// Usage: node scripts/recompress-frames.mjs <dir> [quality=76] [maxDim]
//   node scripts/recompress-frames.mjs public/frames 76
//   node scripts/recompress-frames.mjs public/images/origin/beat-1-origen 76 1280
//
// Reversible via git (operate on committed assets, verify, then commit).

import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const [, , dir, qualityArg, maxDimArg] = process.argv
const quality = Number(qualityArg ?? 76)
const maxDim = maxDimArg ? Number(maxDimArg) : null

if (!dir || !Number.isFinite(quality)) {
  console.error('Usage: node scripts/recompress-frames.mjs <dir> [quality=76] [maxDim]')
  process.exit(1)
}

const files = fs.readdirSync(dir).filter((f) => /^frame_\d{6}\.webp$/.test(f))
if (files.length === 0) {
  console.error(`No frame_NNNNNN.webp files in ${dir}`)
  process.exit(1)
}

let before = 0
let after = 0

for (const name of files) {
  const file = path.join(dir, name)
  const input = fs.readFileSync(file) // read fully so sharp never holds the file handle (Windows lock)
  before += input.length

  let pipe = sharp(input)
  if (maxDim) {
    pipe = pipe.resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
  }
  // Encode to a temp buffer first, then overwrite (sharp can't read+write same path).
  const buf = await pipe.webp({ quality, effort: 5 }).toBuffer()
  fs.writeFileSync(file, buf)
  after += buf.length
}

const mb = (b) => (b / 1e6).toFixed(1)
console.log(
  `${dir}: ${files.length} frames · ${mb(before)} -> ${mb(after)} MB ` +
    `(-${Math.round((1 - after / before) * 100)}%) q${quality}${maxDim ? ` cap ${maxDim}` : ''}`,
)
