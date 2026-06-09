#!/bin/bash
# Encode all character/transition videos with keyed-out white background.
# Output: VP9 WebM with alpha channel, scaled to 1920px wide (half source res).
# Run once during development; outputs replace source .mp4 references in code.
#
# Usage: bash scripts/encode-alpha-videos.sh
# Requires: ffmpeg with libvpx-vp9

set -e

FFMPEG_FLAGS="-vf format=rgba,colorkey=white:0.20:0.05,scale=1920:-2 \
  -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 28 -auto-alt-ref 0 -cpu-used 4 -an"

CHARS_DIR="public/assets/videos/chars"
TRANS_DIR="public/assets/videos/transitions"

total=0
done=0

count_videos() {
  local dir=$1
  echo $(ls "$dir"/*.mp4 2>/dev/null | wc -l | tr -d ' ')
}

CHAR_COUNT=$(count_videos "$CHARS_DIR")
TRANS_COUNT=$(count_videos "$TRANS_DIR")
total=$((CHAR_COUNT + TRANS_COUNT))

echo "Encoding $total videos with alpha key..."
echo ""

encode() {
  local input=$1
  local output="${input%.mp4}.webm"
  local name=$(basename "$input")
  done=$((done + 1))
  echo "[$done/$total] $name"
  ffmpeg -y -i "$input" $FFMPEG_FLAGS "$output" 2>/dev/null
  local in_size=$(du -sh "$input" | cut -f1)
  local out_size=$(du -sh "$output" | cut -f1)
  echo "       $in_size → $out_size"
}

for f in "$CHARS_DIR"/*.mp4; do
  encode "$f"
done

for f in "$TRANS_DIR"/*.mp4; do
  encode "$f"
done

echo ""
echo "Done. Update CYCLE in Hero.tsx to use .webm extensions."

# ── HEVC alpha MOV (Safari) ──────────────────────────────────────────────────
# Safari does not decode VP9 alpha from WebM. Transcode the already-keyed .webm
# files to HEVC alpha .mov — reuses the same alpha masks, no re-keying needed.

HEVC_FLAGS="-c:v hevc_videotoolbox -allow_sw 1 -alpha_quality 0.75 -tag:v hvc1 -an"

echo ""
echo "Transcoding $total WebM → HEVC alpha MOV (Safari)..."
echo ""

done=0
encode_hevc() {
  local input="${1%.mp4}.webm"
  local output="${1%.mp4}.mov"
  local name=$(basename "$input")
  done=$((done + 1))
  echo "[$done/$total] $name"
  ffmpeg -y -i "$input" $HEVC_FLAGS "$output" 2>/dev/null
  local in_size=$(du -sh "$input" | cut -f1)
  local out_size=$(du -sh "$output" | cut -f1)
  echo "       $in_size → $out_size"
}

for f in "$CHARS_DIR"/*.mp4; do encode_hevc "$f"; done
for f in "$TRANS_DIR"/*.mp4; do encode_hevc "$f"; done

echo ""
echo "Done."
