const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { messageErrorAsync, deleteMessage } = require('../helpers/message');

module.exports = {
    name: 'send',
    description: 'This command sends a private message to @username specified by you',
    args: true,
    usage: '@user <your message>',
    guildOnly: true,
    execute: async (message, args) => {
        deleteMessage(message, 0);
        let user = message.guild.member(message.mentions.users.first());
        if (!user) return messageErrorAsync(
                       message,
                       `There is no user as **${args[0]}**`,
                       `<@!${message.author.id}>, there is no user as **${args[0]}**`
                   );

        mentionMessage = args.slice(1).join(' ');
        let sendEmbed = new MessageEmbed()
            .setTitle(`Private message`)
            .setColor(colors.green)
            .setThumbnail(message.author.displayAvatarURL())
            .addField('Sent By', message.author, true)
            .addField('Channel', message.channel, true)
            .addField('\u200b', '\u200b')
            .addField('Message', mentionMessage);

        user.send(sendEmbed).catch(() =>
            messageErrorAsync(
                message,
                "I couldn't send the message, the recipients DM is locked",
                `<@!${message.author.id}>, I couldn't send the message, the recipients DM is locked`
            )
        );
    },
};
