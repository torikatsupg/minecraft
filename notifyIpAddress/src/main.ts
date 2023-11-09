import { ECSClient, DescribeTasksCommand, ListTasksCommand } from "@aws-sdk/client-ecs";
import { EC2Client, DescribeNetworkInterfacesCommand } from "@aws-sdk/client-ec2";
import { Handler } from "aws-lambda";
import axios from 'axios';

const sendMessage = async (text: string) => {
  const webhookURL = 'put your webhook url here';
  try {
    const response = await axios.post(webhookURL, {
        content: text
    });
    console.log('Response:', response.data);
  } catch (error) {
      console.error('Error sending message:', error);
  }
}

const getIPAddress = async (): Promise<string | undefined> => {
  const cluster = 'Minecraft';
  const ecsClient = new ECSClient({ region: "ap-northeast-1" });
  const ec2Client = new EC2Client({ region: "ap-northeast-1" });

  try {
    const listTasksResponse = await ecsClient.send(new ListTasksCommand({ cluster }));
    const taskArns = listTasksResponse.taskArns;

    const describeTasksResponse = await ecsClient.send(
      new DescribeTasksCommand({ cluster, tasks: taskArns })
    );

    const eniId = describeTasksResponse.tasks![0].attachments![0].details!.find(
      detail => detail.name === "networkInterfaceId"
    )?.value;

    if (eniId) {
      const describeNetworkInterfacesResponse = await ec2Client.send(
        new DescribeNetworkInterfacesCommand({ NetworkInterfaceIds: [eniId] })
      );

      return describeNetworkInterfacesResponse.NetworkInterfaces![0].Association?.PublicIp;
    } else {
      throw new Error("Network Interface ID not found.");
    }
  } catch (error) {
    console.error(error);
  }
}

export const handler: Handler = async (event: unknown, context: unknown) => {
  const ipAddress = await getIPAddress();
  await sendMessage(`サーバが起動したよ\nサーバのIPアドレスは \`${ipAddress}\``);
};
