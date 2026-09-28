#!/usr/bin/env bash
# Run GPU steps strictly one at a time with a health check between them (the 0x119 driver crash came from overlapping heavy jobs).
# usage: bash video/gpu_queue.sh "cmd1" "cmd2" ...
health() {
  read used total temp < <(nvidia-smi --query-gpu=memory.used,memory.total,temperature.gpu --format=csv,noheader,nounits | tr -d ',')
  while [ "$temp" -gt 80 ]; do echo "gpu hot ($temp C), cooling"; sleep 30; read used total temp < <(nvidia-smi --query-gpu=memory.used,memory.total,temperature.gpu --format=csv,noheader,nounits | tr -d ','); done
  echo "gpu ok: ${used}/${total} MiB, ${temp} C"
}
for c in "$@"; do health; echo ">> $c"; bash -c "$c" || { echo "STEP FAILED: $c"; exit 1; }; sleep 5; done
echo QUEUE_DONE
