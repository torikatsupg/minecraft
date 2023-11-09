import { Handler } from "aws-lambda";
import axios from "axios";

const sendMessage = async (text: string) => {
  const webhookURL =
    "pub your discord webhook url here";
  try {
    const response = await axios.post(webhookURL, {
      content: text,
    });
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const handler: Handler = async (event: unknown, context: unknown) => {
  await sendMessage(`サーバを停止したよ`);
};
