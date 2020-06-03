# 📝 Configuring the bot

Haven't setup the bot yet? Check out [Setting up the bot](https://github.com/rahul1116/CodeMod/blob/master/docs/setup.md) first!

## Table of contents

-   [Configuration file](https://github.com/rahul1116/CodeMod/blob/master/docs/configuration.md#configuration-file) (start here)
-   [Required options](https://github.com/rahul1116/CodeMod/blob/master/docs/configuration.md#required-options)
-   [Other options](https://github.com/rahul1116/CodeMod/blob/master/docs/configuration.md#other-options)
-   [Environment variables](https://github.com/rahul1116/CodeMod/blob/master/docs/configuration.md#environment-variables)

## Configuration file

All bot options are saved in a configuration file in the bot's folder. This is created during the [setup](https://github.com/rahul1116/CodeMod/blob/master/docs/setup.md) and is generally, `config.json`.

## Required options

### token [Type: String]

**Default:** `none`  
The bots token from [Discord Developer Portal](https://discordapp.com/developers). (**Note: This parameter has to be configured in the environment variables to avoid the token being shared with anyone**)

### adminRole [Type: String]

**Default:** `none`  
Admin role id of the server, wrapped in quotes.

## Other options

### prefix [Type: String]

**Default:** `/`  
The bot prefix for commands.

### moderaton [Type: Boolean]

**Default**: `true`  
This config determines whether to moderate all the messages for slang words or not, not wrapped in quotes.

### colors [Type: Object]

```json
{
    "green": "#4ecfb8",
    "yellow": "#FFC000",
    "red": "#ff0000"
}
```

You can add colors to it or edit the colors. These colors are used in the **Message Embeds** sent to the users

## Environment variables

Config options `adminRole` and `token` can be passed via environment variables for safety.

To set the name of the corresponding environment variable for an option, convert the option to **SNAKE_CASE** and add `CM_` as a prefix.

**Examples**

-   `token` -> `CM_TOKEN`
-   `adminRole` -> `CM_ADMIN_ROLE`
