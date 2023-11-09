const commands = [
  {
    name: "hello", // コマンド
    type: 1, // CHAT_INPUT
    description: "Lambda で実装したコマンド", // コマンドの説明
  },
];

await fetch(
  `https://discord.com/api/v8/applications/${process.env["APPLICATION_ID"]}/commands`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${process.env["BOT_ACCESS_TOKEN"]}`,
    },
    body: JSON.stringify(commands),
  }
);