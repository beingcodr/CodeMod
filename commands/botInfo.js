const { Client, MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { formatDate } = require('../helpers/index');

module.exports = {
    name: 'botInfo',
    description: 'kdsljf',
    execute: async (message, args) => {
        // const bot = new Client();

        let botInfoEmbed = new MessageEmbed()
            .setTitle(`${message.client.user.username}'s Info`)
            .setColor(colors.green)
            .setThumbnail(message.client.user.displayAvatarURL())
            .addField('Bot Name', message.client.user.username, true)
            .addField('First time cried on', formatDate(message.client.user.createdAt), true)
            .addField('\u200b', '\u200b')
            .addField('Server', message.guild.name, true)
            .addField('Joined server on', formatDate(message.guild.joinedAt), true)
            .addField('\u200b', '\u200b')
            .addField('Wanna operate me?', '[Github](https://github.com/rahul1116/codemod)', true)
            .addField('Son Of', '[Rahul Ravindran](https://github.com/rahul1116)', true);

        message
            .delete()
            .catch(() =>
                console.log('[Warning]: DM to the bot cannot be deleted with `message.delete()` ')
            );
        message.author.send(botInfoEmbed);
    },
};
