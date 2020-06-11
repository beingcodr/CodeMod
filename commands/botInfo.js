const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { formatDate } = require('../helpers/index');
const { messageErrorAsync } = require('../helpers/message');

module.exports = {
    name: 'botInfo',
    description: 'This command sends information about the bot',
    guildOnly: true,
    aliases: ['botinfo'],
    usage: ' ',
    execute: async (message, args) => {
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
        messageErrorAsync(
            message,
            botInfoEmbed,
            `<@!${message.author.id}>, I can't send the embed`
        );
    },
};
