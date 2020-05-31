const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { memberCommands, adminCommands } = require('../json/commands.json');

module.exports = {
    name: 'help',
    description: 'dlsj;fld',
    execute: async (message, args) => {
        let memberEmbed = new MessageEmbed()
            .setTitle('Member commands')
            .setColor(colors.green)
            .addFields([...memberCommands]);

        let adminEmbed = new MessageEmbed()
            .setTitle('Admin commands')
            .setColor(colors.green)
            .addFields([...adminCommands]);

        message
            .delete()
            .catch(() =>
                console.log('[Warning]: DM to the bot cannot be deleted with `message.delete()` ')
            );
        if (message.member.hasPermission(['ADMINISTRATOR'])) {
            message.author.send(memberEmbed);
            message.author.send(adminEmbed);
        } else {
            message.author.send(memberEmbed);
        }
    },
};
