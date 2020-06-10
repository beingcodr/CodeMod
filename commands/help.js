const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { memberCommands, adminCommands } = require('../json/commands.json');

module.exports = {
    name: 'help',
    description: 'dlsj;fld',
    guildOnly: true,
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
        try {
            if (message.member.hasPermission(['ADMINISTRATOR'])) {
                await message.author.send(memberEmbed);
                await message.author.send(adminEmbed);
            } else {
                await message.author.send(memberEmbed);
            }
        } catch (error) {
            message.reply(
                'Your DM is not accessible. **User settings > Privacy & safety > Allow messages from server members**. Please enable it'
            );
        }
    },
};
