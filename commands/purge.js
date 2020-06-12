const { messageErrorAsync, botChannelAsync } = require('../helpers/message');

module.exports = {
    name: 'purge',
    description: 'kldsjflk;d',
    args: true,
    usage: 'amount (range: 1-99)',
    guildOnly: true,
    adminOnly: true,
    aliases: ['delete'],
    execute: async (message, args) => {
        let member = message.guild.member(message.author);
        if (member.hasPermission('ADMINISTRATOR', 'MANAGE_MESSAGES')) {
            let amount = parseInt(args[0]) + 1;

            if (isNaN(amount)) {
                messageErrorAsync(
                    message,
                    "That doesn't seem to be a valid number.",
                    `<@!${message.author.id}>, it doesn't seem to be a valid number.`
                );
                return;
            } else if (amount <= 1 || amount > 100) {
                messageErrorAsync(
                    message,
                    'you need to pass a number between 2 and 99.',
                    `<@!${message.author.id}>, you need to pass a number between 2 and 99.`
                );
                return;
            }

            message.channel.bulkDelete(amount).catch((err) => {
                console.error(err);
                botChannelAsync(
                    message,
                    `<@!${message.author.id}>, there was an error trying to prune messages in this channel!`
                );
            });
        } else {
            botChannelAsync(
                message,
                `<@!${message.author.id}>, You don't have permissions to delete messages on the server`
            );
            return;
        }
    },
};
