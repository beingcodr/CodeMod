# 📝 Commands

## Table of content

1. [Inside server](https://github.com/rahul1116/CodeMod/blob/master/docs/commands.md#inside-server)
1. [Anywhere](https://github.com/rahul1116/CodeMod/blob/master/docs/commands.md#anywhere)
1. [Admin commands](https://github.com/rahul1116/CodeMod/blob/master/docs/commands.md#admin-commands)

**Note: Most of the response to the commands are sent to the user's DM by the bot to avoid clutter on the channels. If their DM's are locked the bot sends the message to the `botChannel` that is configured in the `./json/config.json`**

## Inside the server

These commands can only be used inside any channel on the server

### `/help <command name>[optional]` OR `/commands <command name>[optional]`

This command sends all the commands the user can use. Optionally you can get information on specific command by passing the name.  
**Example:** `/help` OR `/help upvote`

### `/send @username <message>`

This command sends a private message to the @username mentioned by the user  
**Example**: `/send @rahulravindran Hello mate, what's up?`

### `/add`

This command registers you to the database for user leveling  
**Example**: `/add`

### `/userInfo @username[optional]`

This command fetches information about the registered user  
**Example**: `/userInfo @username[optional]`

### `/update` OR `/updateuser`

This command updates the information of the registered user  
**Example**: `/update`

### `/upvote @username <keyword>` OR `/uvote @username <keyword>` OR `/uv @username <keyword>`

This command allows you to upvote another user for helping you/community  
**Example**: `/upvote @username <keyword>`

### `/serverInfo` OR `/serverinfo`

This command sends the information of the server

### `/botInfo` OR `/botinfo`

This command sends the information of the bot

## Anywhere

### `/discordHelp` OR `/discordhelp` OR `discord`

This command sends resources to Get Started with Discord

### `/resources` OR `/resource`

This command will ping you all the resources you might need for learning Web Development and Design

### `/jobChallenge` OR `/jobchallenge` OR `/ttjc`

This command provides you informative links for JobChallenge

### `/socialLinks` OR `/sociallinks` OR `/social` OR `/links`

This command sends all the social handles and initiatives of Tanay Pratap

### `/faq <keywords>`

This command shows the Frequently Asked Question specified by you.

> **Tip:** use specific keywords such as `coding, blogs, etc` and avoid generic keywords such as `what, how, where`

**Example**: `/faq new to coding`

## Admin commands

### `/kick @username`

This command kicks the member mentioned by the user  
**Example:** `/kick @username`

### `/ban @username`

This command bans the member mentioned by the user  
**Example:** `/ban @username`

### `/purge <number>` OR `/delete <number>`

This command deletes number of latest messages specified by the user  
**Example:** `/purge 20`

### `/addRole @username <Role name>` OR `/addrole @username <Role name>`

This command adds role to the specified user. The **Role name** is case sensitive  
**Example:** `/addRole @username admin`

### `/removeRole @username <Role name>` OR `/removerole @username <Role name>` OR `/rmrole @username <Role name>`

This command removes role from the specified user. The **Role name** is case sensitive  
**Example:** `/removeRole @username admin`

### `/downvote @username <keyword>` OR `/dvote @username <keyword>`

This command allows you to downvote another user for voilating server rules or spams  
**Example**: `/downvote @username <keyword>`

### `/warn @username <reason>`

This command allows you to warn another user for voilating server rules or spams  
**Example**: `/warn @username <reason>`
