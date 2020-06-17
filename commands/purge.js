const { messageErrorAsync, botChannelAsync } = require('../helpers/message');

module.exports = {
    name: 'purge',
    description: 'This command deletes the number of recent messages specified by the user',
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
                return messageErrorAsync(
                    message,
                    "That doesn't seem to be a valid number.",
                    `<@!${message.author.id}>, it doesn't seem to be a valid number.`
                );
            } else if (amount <= 1 || amount > 100) {
                return messageErrorAsync(
                    message,
                    'you need to pass a number between 1w and 99.',
                    `<@!${message.author.id}>, you need to pass a number between 2 and 99.`
                );
            }

            message.channel.bulkDelete(amount).catch((err) => {
                console.error(err);
                return botChannelAsync(
                    message,
                    `<@!${message.author.id}>, there was an error trying to delete messages in <#${message.channel.id}>!`
                );
            });
        } else {
            return botChannelAsync(
                message,
                `<@!${message.author.id}>, You don't have permissions to delete messages on the server`
            );
        }
    },
};
