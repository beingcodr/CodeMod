const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');

module.exports = {
    name: 'send',
    description: 'lkadsjf',
    execute: async (message, args) => {
        if (args.length < 2) {
            message.author.send(
                'Try the command like this `/send @mentionsomeone type your message`'
            );
        }
        let user = message.guild.member(message.mentions.users.first());
        if (!user) message.author.send(`There is no user as ${args[0]}`);

        message
            .delete()
            .catch(() =>
                console.log('[Warning]: DM to the bot cannot be deleted with `message.delete()` ')
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

        message
            .delete()
            .catch(() =>
                console.log('[Warning]: DM to the bot cannot be deleted with `message.delete()` ')
            );
        user.send(sendEmbed);
    },
};
