FROM google/cloud-sdk:slim

# Install dependencies
RUN apt update  -y
RUN apt install -y openjdk-17-jdk-headless

# Install Minecraft
COPY minecraft minecraft
WORKDIR minecraft

# Start
ENTRYPOINT ["/bin/sh", "/minecraft/start.sh"]



