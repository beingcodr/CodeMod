const { Client, Collection, MessageEmbed } = require('discord.js');
require('dotenv').config();
const mongoose = require('mongoose');
const { prefix, moderation, adminRole, colors } = require('./json/config.json');
const { moderateMessagesCommand } = require('./helpers/index');
const downvote = require('./commands/downvote');
const { messageErrorAsync, botChannelAsync, memberErrorAsync } = require('./helpers/message');
const fs = require('fs');
const { addMemberEvent } = require('./helpers/member');
const Member = require('./server/models/Member');
const bot = new Client();
bot.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
});

bot.once('ready', () => {
    console.log('The bot is now ready to receive commands');
    bot.user.setActivity('messages', { type: 'WATCHING' });
});

bot.on('message', (message) => {
    let args = [];
    if (message.author === bot.user) {
        return;
    } else {
        if (moderation) {
            let slangsUsed = moderateMessagesCommand(message);
            if (slangsUsed.length) {
                let slangEmbed = new MessageEmbed()
                    .setTitle('Warning for using slang')
                    .setThumbnail(message.author.avatarURL())
                    .setColor(colors.red)
                    .addField('Cursed in', `<#${message.channel.id}>`, true)
                    .addField('Warned user', `<@!${message.author.id}>`, true)
                    .addField(
                        'Content',
                        `${message.content} [Message link](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`
                    );
                // .addField('Message Link');
                botChannelAsync(message, slangEmbed);
                message.reply(
                    `**Just used \`${slangsUsed.join(', ')}\` in his/her message, take a look <@&${
                        process.env.CM_ADMIN_ROLE || adminRole
                    }>**`
                );
                args = [{ id: `${message.author.id}`, bypass: true }, 'slang'];
                return downvote.execute(message, args);
            }
        }
        if (!message.content.startsWith(`${prefix}`)) return;

        let splitCommand = message.content.substr(prefix.length).split(' ');
        let commandName = splitCommand[0];
        args = splitCommand.slice(1);
        console.log(`Args: ${args}`);

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

    addMemberEvent(member).catch((err) => console.error(err));
});

bot.on('guildMemberRemove', (member) => {
    console.log(`${member.user.username} left`);
    Member.findOneAndDelete({ discordId: member.user.id }).catch((err) => {
        console.log(err);
        return;
    });
});

// ! make a request to the server for updating member details in the database
// bot.on('guildMemberUpdate',  (oldMember, newMember) => {
//     const filteredMember = members.filter((member) => member.id === newMember.user.id);
//     if (!filteredMember.length) {
//         filteredMember[0] = {
//             id: newMember.user.id,
//             discriminator: `#${newMember.user.discriminator}`,
//             username: newMember.user.username,
//             nickName: newMember.nickname,
//             avatar: newMember.user.avatarURL(),
//             server: newMember.guild.name,
//             roles: [...newMember._roles],
//             level: 0,
//             totalPoints: 0,
//         };
//     } else {
//         filteredMember[0] = {
//             id: newMember.user.id,
//             discriminator: `#${newMember.user.discriminator}`,
//             username: newMember.user.username,
//             nickName: newMember.nickname,
//             avatar: newMember.user.avatarURL(),
//             server: newMember.guild.name,
//             roles: [...newMember._roles],
//             level: 0,
//             totalPoints: 0,
//         };

//         members.pop(newMember.user.id);
//     }
//     members.push(filteredMember[0]);

//     try {
//         fs.writeFileSync('./json/members.json', JSON.stringify(members));
//     } catch (error) {
//         console.error(error);
//     }
//     console.log(filteredMember);
// });

bot.login(process.env.CM_TOKEN);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
    console.log('Database connection established')
);
