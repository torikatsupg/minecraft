import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventHeaders,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { Lambda } from "aws-sdk";
import { verifyKey } from "discord-interactions";

const executeCommandArn = 'put your lambda arn here'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: unknown
): Promise<APIGatewayProxyResult> => {
  const isValidRequest = verifyRequest(event.headers, event.body);
  if (!isValidRequest) {
    return {
      statusCode: 401,
      body: JSON.stringify("Bad request"),
    };
  }

  const command = JSON.parse(event.body || "{}")?.["data"]?.["name"];
  console.log("command: ", command);
  const lambda = new Lambda({ region: "ap-northeast-1" });

  try {
    switch (command) {
      case "start":
        await lambda.invoke({
          FunctionName: executeCommandArn,
          InvocationType: 'Event',  // 非同期実行
          Payload: JSON.stringify({command: "start"})
      }).promise();
        return responseWithMessage("サーバを起動するよ");
      case "stop":
        await lambda.invoke({
          FunctionName: executeCommandArn,
          InvocationType: 'Event',  // 非同期実行
          Payload: JSON.stringify({command: "stop"})
      }).promise();
        return responseWithMessage("サーバを停止するよ");
      case "hello":
        return responseWithMessage("hello!");
      default:
        return responseWithMessage(`${command}: unknown command`);
    }
  } catch (e) {
    console.log(e);
    return responseWithMessage(
      `何か問題が発生している\nhandleSlashCommand\n${e}`
    );
  }
};

const verifyRequest = (
  header: APIGatewayProxyEventHeaders,
  body: string | null
): boolean => {
  const signature = header["x-signature-ed25519"];
  const timestamp = header["x-signature-timestamp"];

  if (signature === undefined || timestamp === undefined || body == null) {
    return false;
  }

  return verifyKey(
    body,
    signature,
    timestamp,
    "put your discord key here"
  );
};

const responseWithMessage = (message: string) => {
  return {
    headers: {
      "Content-Type": "application/json",
    },
    statusCode: 200,
    body: JSON.stringify({
      type: 4,
      data: {
        content: message,
      },
    }),
  };
}
