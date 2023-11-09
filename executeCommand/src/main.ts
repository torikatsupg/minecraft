import {
  ECSClient,
  ListTasksCommand,
  RunTaskCommand,
  StopTaskCommand,
} from "@aws-sdk/client-ecs";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

const ecsClient = new ECSClient({ region: "ap-northeast-1" });

export const handler: APIGatewayProxyHandler = async (
  event: unknown,
  context: unknown
): Promise<APIGatewayProxyResult> => {

  const command = (event as any).command || "";
  console.log('command: ', command);
  switch (command) {
    case "start":
      console.log('launch ecs task')
      await launchECSTask();
      break;
    case "stop":
      console.log('stop all ecs task')
      await stopAllECSTask();
      break;
    default:
      break;
  }
  return {statusCode: 200, body: "OK"}
};

const listECSTask = async (): Promise<string[]> => {
  const command = new ListTasksCommand({ cluster: "Minecraft" });
  const listTasksResponse = await ecsClient.send(command);
  return listTasksResponse.taskArns ?? [];
};

const launchECSTask = async () => {
  const taskArns = await listECSTask();
  if (taskArns.length !== 0) {
    return;
  }
  const command = new RunTaskCommand({
    cluster: "Minecraft",
    taskDefinition: "minecraft_server_family",
    launchType: "FARGATE",
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: ["subnet-00c4d7843896f85b9"],
        securityGroups: ["sg-0fe8ade6003614fc3"],
        assignPublicIp: "ENABLED",
      },
    },
  });
  try {
    console.log("launchECSTask");
    await ecsClient.send(command);
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    console.log("launchECSTask");
  }
};

const stopAllECSTask = async () => {
  const taskArns = await listECSTask();
  const targetTask = taskArns[0];
  if (targetTask == null || undefined) {
    return;
  }
  const command = new StopTaskCommand({
    cluster: "Minecraft",
    task: targetTask,
  });
  await ecsClient.send(command);
};
