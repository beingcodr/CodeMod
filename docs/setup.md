# 🛠️ Setting up the bot

This bot runs on your machine or a server. To keep the bot running you might need to deploy the code to a server using Heroku, DigitalOcean or any other service of your choice

## Terminology

1. **Main server** (guild) is the server on which the bot is invited and operated from
1. **Inbox server** (bot DM channel) is the channel that the bot will send most of the information requested by the server members to avoid clutter in the channel
1. A **member** in CodeMod's context, is a server member who requests information from the bot
1. An **admin** in CodeMod's context, is the moderator/owner of the server who has **ADMINISTRATOR, KICK_MEMEBERS, BAN_MEMBERS** permissions

## Prerequisites

Assuming that you already have a discord account and a server.

1. Login to your [Discord account](https://discordapp.com/login)
1. Create a bot account through the [Discord Developer Portal](https://discordapp.com/developers/)
1. Add a bot user by selecting your bot > Bot tab > Add user. You'll get your bot token there, copy and save it for later steps. (**Note:** Never share your bot token anywhere/anyone)
1. Navigate to the [discord applications page](https://discord.com/developers/applications) > select your bot > in the general information, copy the CLIENT ID (**Note:** Do not copy the CLIENT SECRET by mistake). You'll need it in the next step. You can change the display name and image for the bot
1. Invite the [bot to your server directly](https://discordapi.com/permissions.html) or [read documentation on how to properly invite the bots](https://discordjs.guide/preparations/adding-your-bot-to-servers.html)
1. Install Node.js 12^ or higher for your OS from [here](https://www.nodejs.org)
1. Download the [latest bot version and configure git](https://github.com/rahul1116/CodeMod/blob/master/docs/settingupgit.md)
1. In the bot's folder, make a copy of the file `.env.example` and rename the copy to `.env`

## Bot setup

1. We recommend you to copy the bot code and make a bot of your own. To have the flexibility to choose the permissions as per the functionality you want from the bot
1. Go through the [prerequisites](https://github.com/rahul1116/CodeMod/blob/master/docs/setup.md#prerequisites) above first!
1. Open `.env` in a text editor like **VS Code** or any other of your choice and fill in the required values. `token` should be set to your bot token. You can get that from the **Bot** tab in the [Bot Application page](https://discord.com/developers/applications). (**Note: The bot token should never be shared anywhere**)
1. In the root directory, open terminal and run `npm install` to install all the dependencies for the bot
1. Run `npm run dev` to start the bot process, now go to any of the channels on your server and type `/serverInfo`. If the message is automatically deleted from the channel and the bot pinged in your DM with the server's details then everything is setup properly and you're ready to proceed.
1. Want to change FAQ's? See [FAQ configuration](https://github.com/rahul1116/CodeMod/blob/master/docs/faqconfiguration.md)
 