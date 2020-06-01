const { Client, MessageEmbed, Collection } = require('discord.js');
require('dotenv').config();
const { prefix, colors } = require('./json/config.json');
const { moderateMessagesCommand } = require('./helpers/index');
const { memberCommands, adminCommands } = require('./json/commands.json');
const fs = require('fs');
const members = require('./json/members.json');
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

bot.on('message', async (message) => {
    if (message.author === bot.user) {
        return;
    } else {
        if (moderateMessagesCommand(message)) return;
        if (!message.content.startsWith(`${prefix}`)) return;

        let splitCommand = message.content.substr(prefix.length).split(' ');
        let commandName = splitCommand[0];
        let args = splitCommand.slice(1);

        if (!bot.commands.has(commandName)) return;
        let command = bot.commands.get(commandName);

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

bot.on('guildMemberAdd', async (member) => {
    let newMember = {
        id: `${member.user.id}`,
        discriminator: `#${member.user.discriminator}`,
        username: `${member.user.username}`,
        nickName: null,
        roles: [],
        server: `${member.guild.name}`,
        level: 0,
        totalPoints: 0,
    };

    // STEP 2: Adding new data to users object
    members.push(newMember);

    // Writing data to the file
    try {
        fs.writeFileSync('./json/members.json', JSON.stringify(members));
    } catch (err) {
        console.error(err);
    }

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

bot.on('guildMemberUpdate', async (oldMember, newMember) => {
    console.log(newMember);

    const filteredMember = members.filter((member) => member.id === newMember.user.id);
    if (!filteredMember.length) {
        filteredMember[0] = {
            id: newMember.user.id,
            discriminator: `#${newMember.user.discriminator}`,
            username: newMember.user.username,
            nickName: newMember.nickname,
            avatar: newMember.user.avatarURL(),
            server: newMember.guild.name,
            roles: [...newMember._roles],
            level: 0,
            totalPoints: 0,
        };
    } else {
        filteredMember[0] = {
            id: newMember.user.id,
            discriminator: `#${newMember.user.discriminator}`,
            username: newMember.user.username,
            nickName: newMember.nickname,
            avatar: newMember.user.avatarURL(),
            server: newMember.guild.name,
            roles: [...newMember._roles],
            level: 0,
            totalPoints: 0,
        };

        members.pop(newMember.user.id);
    }
    members.push(filteredMember[0]);

    try {
        fs.writeFileSync('./json/members.json', JSON.stringify(members));
    } catch (error) {
        console.error(error);
    }
    console.log(filteredMember);
});

const processCommand = (message) => {
    switch (primaryCommand) {
        //todo: rules, ama
        case 'resources':
            resourcesCommand(message);
            break;

        case 'help':
            helpCommand(message);
            break;

        case 'discordHelp':
            discordHelpCommand(message);
            break;

        case 'jobChallenge':
            jobChallengeCommand(message);
            break;

        case 'socialLinks':
            socialLinksCommand(message);
            break;

        case 'faq':
            faqCommand(message, arguments);
            break;

        case 'prune':
            pruneCommand(message, arguments);
            break;

        case 'kick':
            kickCommand(message);
            break;

        case 'ban':
            banCommand(message);
            break;

        case 'send':
            sendCommand(message, arguments);
            break;

        case 'serverInfo':
            serverInfo(message);
            break;

        case 'botInfo':
            botInfo(message);
            break;

        default:
            message
                .delete()
                .catch(() =>
                    console.log(
                        '[Warning]: DM to the bot cannot be deleted with `message.delete()` '
                    )
                );
            message.author.send(
                'Invalid command. Run `/help` on the server channels to know all the valid commands'
            );
            break;
    }
};

bot.login(process.env.token);
