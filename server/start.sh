#!/bin/sh

# set workdir
cd /

# Restore backup if needed
if [ ! -f "/minecraft/server.jar" ]; then
  aws s3 cp "put your s3 restore path here" .
  (cd /minecraft && tar xzf "/backup.tar.gz")
fi

# Start scheduled jobs
env | sed 's/^\(.*\)$/export \1/g' > /etc/environment
service cron start &

# Start Minecraft server
(cd /minecraft && java -Xmx1024M -Xms1024M -jar server.jar nogui)