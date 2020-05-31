const { Client, MessageEmbed, Collection } = require('discord.js');
require('dotenv').config();
const { prefix, colors } = require('./json/config.json');
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
    bot.user.setActivity('messages', { type: 'LISTENING' });
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
