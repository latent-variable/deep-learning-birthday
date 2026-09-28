#!/usr/bin/env bash
# Full render: frames (6 workers) → master (CRF 20) + 1080p share copy (12 Mbps, ~290 MB) + 720p.
# usage: FRESH=1 bash video/make_final.sh [name]
cd /c/AI/deep-learning-birthday/video/animation
export PATH=/c/AI/deep-learning-birthday/tools/node:/c/AI/ffmpeg:$PATH; export CHROME_PATH="$LOCALAPPDATA/Google/Chrome/Application/chrome.exe"
name=${1:-happy-birthday-to-me}; SONG=assets/song_credits.m4a
[ "$FRESH" = 1 ] && rm -rf out/frames
node render.mjs --frames --workers=6 2>&1 | grep -v ERR_FILE | tail -2
mkdir -p ../final
ffmpeg -loglevel error -y -framerate 24 -i out/frames/f%05d.jpg -i $SONG -map 0:v -map 1:a -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -profile:v high -c:a aac -b:a 320k -shortest -movflags +faststart ../final/$name-master.mp4
ffmpeg -loglevel error -y -i ../final/$name-master.mp4 -c:v libx264 -preset slow -b:v 12M -maxrate 16M -bufsize 24M -pass 1 -an -f mp4 -passlogfile out/x264pass NUL
ffmpeg -loglevel error -y -i ../final/$name-master.mp4 -c:v libx264 -preset slow -b:v 12M -maxrate 16M -bufsize 24M -pass 2 -passlogfile out/x264pass -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart ../final/$name.mp4
ffmpeg -loglevel error -y -i ../final/$name-master.mp4 -vf scale=1280:720 -c:v libx264 -preset slow -b:v 6M -maxrate 8M -bufsize 12M -c:a aac -b:a 192k -movflags +faststart ../final/$name-720p.mp4
ls -la ../final/
