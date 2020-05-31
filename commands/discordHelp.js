const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');

module.exports = {
    name: 'discordHelp',
    description: 'dafdsaf',
    execute: async (message, args) => {
        let discordHelpEmbed = new MessageEmbed()
            .setTitle('Get Started with Discord')
            .setColor(colors.green)
            .addField(
                'Get started',
                '[Discord YouTube link](https://www.google.com/search?client=firefox-b-d&q=discord+for+dummies#kpvalbx=_xFfJXt7hAcbf9QP6lJ6ICQ48)'
            );

        message
            .delete()
            .catch(() =>
                console.log('[Warning]: DM to the bot cannot be deleted with `message.delete()` ')
            );
        message.author.send(discordHelpEmbed);
    },
};
