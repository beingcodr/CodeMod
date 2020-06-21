const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { messageErrorAsync, deleteMessage } = require('../helpers/message');

module.exports = {
    name: 'discordHelp',
    description: 'This command sends you resources to Get Started with Discord',
    aliases: ['discordhelp', 'discord'],
    usage: ' ',
    execute: async (message, args) => {
        deleteMessage(message, 0);
        let discordHelpEmbed = new MessageEmbed()
            .setTitle('Get Started with Discord')
            .setColor(colors.green)
            .addField(
                'Get started',
                '[Discord YouTube link](https://www.google.com/search?client=firefox-b-d&q=discord+for+dummies#kpvalbx=_xFfJXt7hAcbf9QP6lJ6ICQ48)'
            );

        messageErrorAsync(
            message,
            discordHelpEmbed,
            `<@!${message.author.id}>, I wasn't able to send the resource to Get Started with Discord`
        );
    },
};
