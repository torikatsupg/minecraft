#!/bin/sh

BACKUP_FILENAME="backup.tar.gz"
REMOTE_BACKUP_PATH="s3://torikatsu-minecraft-backup/$BACKUP_FILENAME"

# Restore backup
# FIXME
aws s3 cp "$REMOTE_BACKUP_PATH" .
tar xzf "$BACKUP_FILENAME"

on_exit() {
  echo "backup"
  if [ -n "$MC_PID" ]; then
    kill "$MC_PID"
  fi

  sh ./backup.sh
  exit 0
}
trap 'on_exit' TERM
trap 'on_exit' INT

# Start Minecraft server
java -Xmx1024M -Xms1024M -jar minecraft_server.1.20.2.jar nogui &
MC_PID=$!
echo "minecraft_server pid: " "$MC_PID"

# Start scheduled jobs
env | sed 's/^\(.*\)$/export \1/g' > /etc/environment
service cron start

wait
