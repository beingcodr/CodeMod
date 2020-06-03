const { Client, MessageEmbed, Collection } = require('discord.js');
require('dotenv').config();
const { prefix, colors, moderation, adminRole } = require('./json/config.json');
const { moderateMessagesCommand } = require('./helpers/index');
const { memberCommands, adminCommands } = require('./json/commands.json');
const fs = require('fs');
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
    if (message.author === bot.user) {
        return;
    } else {
        if (moderation) {
            let slangsUsed = moderateMessagesCommand(message);
            if (slangsUsed.length) {
                message.author.send(
                    '**[Warning] This message is to notify you that your message contained a slang word which is not permitted in this server. You might get banned if you continue to voilate the rules**'
                );
                message.reply(
                    `**Just used \`${slangsUsed.join(', ')}\` in his/her message, take a look <@&${
                        process.env.CM_ADMIN_ROLE || adminRole
                    }>**`
                );
                return;
            }
        }
        if (!message.content.startsWith(`${prefix}`)) return;

        let splitCommand = message.content.substr(prefix.length).split(' ');
        let commandName = splitCommand[0];
        let args = splitCommand.slice(1);

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

            message.reply(reply);
            return;
        }

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }
    }
});

bot.on('guildMemberAdd', (member) => {
    let memberEmbed = new MessageEmbed()
        .setTitle('Member commands')
        .setColor(colors.green)
        .addFields([...memberCommands]);

    let adminEmbed = new MessageEmbed()
        .setTitle('Admin commands')
        .setColor(colors.green)
        .addFields([...adminCommands]);

    if (member.hasPermission(['ADMINISTRATOR'])) {
        member.send(memberEmbed);
        member.send(adminEmbed);
    } else {
        member.send(memberEmbed);
    }
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
