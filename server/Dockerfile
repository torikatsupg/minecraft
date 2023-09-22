FROM ubuntu:latest

# Install dependencies
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update  -y
RUN apt install -y openjdk-17-jdk-headless
RUN apt install -y awscli
RUN apt install -y cron

# Register & Run scheduled jobs
COPY crontab /etc/cron.d/crontab
RUN chmod 0644 /etc/cron.d/crontab
RUN crontab /etc/cron.d/crontab


# Install Minecraft
COPY minecraft minecraft
WORKDIR minecraft

EXPOSE 25565

# Start
ENTRYPOINT ["/bin/sh", "/minecraft/start.sh"]
