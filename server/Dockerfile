FROM ubuntu:latest

# Install dependencies
RUN apt update  -y
RUN apt install -y openjdk-19-jdk-headless 

# Install Minecraft
RUN mkdir /minecraft
COPY minecraft minecraft
WORKDIR minecraft

# Start
CMD java -Xmx1024M -Xms1024M -jar minecraft_server.1.20.1.jar nogui

