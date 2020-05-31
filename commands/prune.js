module.exports = {
    name: 'prune',
    description: 'kldsjflk;d',
    execute: async (message, args) => {
        let member = message.guild.member(message.author);
        if (member.hasPermission('ADMINISTRATOR', 'MANAGE_MESSAGES')) {
            let amount = parseInt(args[0]) + 1;

            if (isNaN(amount)) {
                message.author.send("That doesn't seem to be a valid number.");
                return;
            } else if (amount <= 1 || amount > 100) {
                message.author.send('you need to input a number between 2 and 99.');
                return;
            }

            message.channel.bulkDelete(amount).catch((err) => {
                console.error(err);
                message.channel.send(
                    'there was an error trying to prune messages in this channel!'
                );
            });
        } else {
            message.reply("You don't have permissions to delete messages on the server ");
            return;
        }
    },
};
