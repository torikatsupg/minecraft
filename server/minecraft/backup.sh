#!/bin/sh

source /etc/environment

cd /minecraft

BACKUP_FILENAME="backup.tar.gz"
REMOTE_BACKUP_PATH="s3://torikatsu-minecraft-backup/$BACKUP_FILENAME"

tar -zcvf \
    "$BACKUP_FILENAME" \
    libraries \
    versions \
    world \
    banned-ips.json \
    banned-players.json \
    usercache.json 

aws s3 cp "$BACKUP_FILENAME" "$REMOTE_BACKUP_PATH"
