#!/usr/bin/env bash
# Extract every chosen LTX clip (video/plates/ltx/<id>_l<take>.mp4, take from TAKES or 1) to JPG frames and rebuild clips.js
cd /c/AI/deep-learning-birthday; export PATH=/c/AI/ffmpeg:$PATH
OUT=video/animation/assets/clips; mkdir -p $OUT
for f in video/plates/ltx/*_l1.mp4 video/plates/lipsync/*.mp4; do
  [ -f "$f" ] || continue; id=$(basename $f .mp4); id=${id%_l1}
  [ -d $OUT/$id ] && [ $OUT/$id -nt $f ] && continue
  rm -rf $OUT/$id; mkdir -p $OUT/$id
  ffmpeg -loglevel error -y -i $f -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=24" -q:v 3 $OUT/$id/f%04d.jpg
done
{ echo "const CLIPS = {"; for d in $OUT/*/; do id=$(basename $d); echo "  '$id': $(ls $d | wc -l),"; done; echo "};"; } > video/animation/src/riso/clips.js
cat video/animation/src/riso/clips.js
