# 🛠️ Setting up the bot

This bot runs on your machine or a server. To keep the bot running you might need to deploy the code to a server using Heroku, DigitalOcean or any other service of your choice

## Terminology

1. **Main server** (guild) is the server on which the bot is invited and operated from
1. **Inbox server** (bot DM channel) is the channel that the bot will send most of the information requested by the server members
1. A **member** in CodeMod's context, is a server member who requests information from the bot
1. An **admin** in CodeMod's context, is the moderator/owner of the server who has access to change the data that the **members** can request for

## Prerequisites

Assuming that you already have a discord account and a server.

1. Login to your [Discord account](https://discordapp.com/login)
1. Create a bot account through the [Discord Developer Portal](https://discordapp.com/developers/)
1. Set the [bot permissions](https://discordjs.guide/preparations/setting-up-a-bot-application.html) and invite the created [bot to your server](https://discordjs.guide/preparations/adding-your-bot-to-servers.html)
1. Install Node.js 12^
1. Download the latest bot version from the `Clone or download button`, Download the zip and extract it
1. In the bot's folder, make a copy of the file `.env.example` and rename the copy to `.env`

## Bot setup

1. Go through the prerequisites above first!
1. Open `.env` in a text editor and fill in the required values. `token` should be set to your bot token
