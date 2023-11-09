#!/bin/sh

source /etc/environment

cd /minecraft
rm "backup.tar.gz"
tar -zcvf \
    "backup.tar.gz" \
    libraries \
    versions \
    world \
    banned-ips.json \
    banned-players.json \
    usercache.json \
    eula.txt \
    server.jar \
    ops.json \
    server.properties \
    whitelist.json

aws s3 cp "backup.tar.gz" "put your s3 path here"
