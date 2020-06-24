const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { formatDate, botCount } = require('../helpers/index');
const { messageErrorAsync, deleteMessage } = require('../helpers/message');

module.exports = {
    name: 'serverInfo',
    description:
        'This command sends information about the server like no.of members, createdAt, etc',
    guildOnly: true,
    aliases: ['serverinfo'],
    usage: ' ',
    execute: async (message, args) => {
        deleteMessage(message, 0);

        let botCountResult = botCount(message);
        let memberCount = message.guild.memberCount - botCountResult;

        let serverEmbed = new MessageEmbed()
            .setTitle(`${message.guild.name}'s Info`)
            .setColor(colors.green)
            .setThumbnail(message.guild.iconURL())
            .addField('\u200b', '\u200b')
            .addField('Server Name:', message.guild.name, true)
            .addField('Server created at:', formatDate(message.guild.createdAt), true)
            .addField('You joined on: ', formatDate(message.member.joinedAt), true)
            .addField('Total members: ', memberCount, true)
            .addField('Total bots: ', botCountResult, true);

        messageErrorAsync(
            message,
            serverEmbed,
            `<@!${message.author.id}>, I wasn't able to send the server information`
        );
    },
};
