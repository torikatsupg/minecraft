TOKEN="put your discord app token here"
APP_ID="put your discord app id here"

curl -X POST \
     -H "Content-Type: application/json" \
     -H "Authorization: Bot ${TOKEN}" \
     -d @commands.json \
     "https://discord.com/api/v8/applications/${APP_ID}/commands"
