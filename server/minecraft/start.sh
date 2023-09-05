#!/bin/sh

# Restore buckup files
if [ -z "${GOOGLE_APPLICATION_CREDENTIALS}" ]; then
  echo "launch on local"
  gcloud auth activate-service-account --key-file=/tmp/credentials.json
fi

gcloud storage cp -r 'gs://katz_minecraft_backup/*' .


on_exit() {
  echo "backup"
  if [ -n "$MC_PID" ]; then
    kill "$MC_PID"
  fi

  gcloud storage cp -r \
      libraries \
      versions \
      world \
      banned-ips.json \
      banned-players.json \
      ops.json \
      usercache.json \
      whitelist.json \
      'gs://katz_minecraft_backup'

  exit 0

}
trap 'on_exit' TERM

# Start Minecraft server
java -Xmx1024M -Xms1024M -jar minecraft_server.1.20.1.jar nogui &
MC_PID=$!
echo "minecraft_server pid: " $MC_PID

wait
