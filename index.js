const { Client, Collection, MessageEmbed } = require('discord.js');
require('dotenv').config();
const mongoose = require('mongoose');
const { prefix, moderation, colors, submissionChannel } = require('./json/config.json');
const { moderateMessagesCommand } = require('./helpers/index');
const downvote = require('./commands/downvote');
const { botChannelAsync, memberErrorAsync } = require('./helpers/message');
const fs = require('fs');
const { addMemberEvent } = require('./helpers/member');
const bot = new Client();
bot.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
});

bot.once('ready', () => {
    console.log('The bot is now ready to receive commands');
    bot.user.setActivity('messages', { type: 'LISTENING' });
});

bot.on('message', (message) => {
    // const checkMessage = async (message) => {
    //     const msgggg = await message.guild.channels.cache
    //         .get('775203477172912139')
    //         .messages.fetch('775688813120061471');

    //     console.log('cehcking: ', msgggg.delete());
    // };
    // checkMessage(message);
    // console.log(
    //     'Message: ',
    //     message.embeds.map((embed) => embed.fields.map((field) => field.name))
    // );
    console.log(
        'submission channel msg: ',
        message.client.channels
            .fetch(process.env.CM_SUBMISSION_CHANNEL || submissionChannel)
            .then((channel) => channel.type) 
            .catch((error) => console.log(error))
    );
    let moderationCheck = process.env.CM_MODERATION || moderation;
    let args = [];
    if (message.author === bot.user || message.author.bot) {
        return;
    } else {
        if (moderationCheck) {
            let slangsUsed = moderateMessagesCommand(message);
            if (slangsUsed.length) {
                let slangEmbed = new MessageEmbed()
                    .setTitle('Slang used')
                    .setThumbnail(message.author.avatarURL())
                    .setColor(colors.red)
                    .setURL(`${message.url}`)
                    .addField('Cursed in', `<#${message.channel.id}>`, true)
                    .addField('Warned user', `<@!${message.author.id}>`, true)
                    .addField('\u200b', '\u200b')
                    .addField('Detected slangs', `${slangsUsed.join(', ')}`, true)
                    .addField('Message link', `[Link](${message.url})`, true)
                    .addField('Content', `${message.content}`);

                slangEmbed.length > 1000
                    ? botChannelAsync(
                          message,
                          `<@!${
                              message.author.id
                          }> You used a slang word that's not permitted in this server\n\nCursed in : <#${
                              message.channel.id
                          }>\nDetected slang words: ${slangsUsed.join(
                              ', '
                          )}\n**Content of the message:** ${message.content}`
                      )
                    : botChannelAsync(message, slangEmbed);
                args = [{ id: `${message.author.id}` }, 'slang'];
                return downvote.execute(message, args);
            }
        }
        if (!message.content.startsWith(`${prefix}`)) return;

        let splitCommand = message.content.substr(prefix.length).split(' ');
        let commandName = splitCommand[0];
        args = splitCommand.slice(1);

        const command =
            bot.commands.get(commandName) ||
            bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return message.reply(
                'Invalid command. Try `/help` to learn more about available commands'
            );
        }

        if (command.guildOnly && message.channel.type !== 'text') {
            return message.reply("I can't execute that command inside DMs!");
        }

        if (command.adminOnly && !message.member.hasPermission('ADMINISTRATOR')) {
            return botChannelAsync(
                message,
                `<@!${message.author.id}>, you can't use \`${command.name}\` command`
            );
        }

        if (command.args && !args.length) {
            let reply = "You didn't provide any arguments!";

            if (command.usage)
                reply += `\t The proper usage would be: \`${prefix}${command.name} ${command.usage}\``;

            return message.reply(reply);
        }

        try {
            command.execute(message, args);
        } catch (error) {
            botChannelAsync(
                message,
                `<@!${message.author.id}> There was an error trying to execute ${commandName}`
            );
        }
    }
});

bot.on('guildMemberAdd', (member) => {
    let { commands } = member.client;
    let data = [];
    let isAdmin = false;
    if (member.hasPermission(['ADMINISTRATOR'])) isAdmin = true;

    data.push("Here's a list of all the available commands  ");
    data.push(
        isAdmin
            ? commands
                  .map((command) => {
                      return `\`${command.name}\``;
                  })
                  .join(', ')
            : commands
                  .filter((command) => !command.adminOnly)
                  .map((cmnd) => {
                      return `\`${cmnd.name}\``;
                  })
                  .join(', ')
    );
    data.push(
        `\n\nYou can send \`${prefix}help <commandName>\` to get info on a specific command!`
    );

    memberErrorAsync({}, member, data, `<@!${member.user.id}>,\n${data}`);

    return addMemberEvent(member, 'guildMemberAdd event');
});

bot.login(process.env.CM_TOKEN);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
    console.log('Database connection established')
);
