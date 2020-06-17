const Member = require('../server/models/Member');
const { messageErrorAsync, deleteMessage } = require('../helpers/message');
const { addMember } = require('../helpers/member');

module.exports = {
    name: 'add',
    guildOnly: true,
    aliases: ['adduser', 'register'],
    usage: ' ',
    execute: async (message, args) => {
        deleteMessage(message, 0);
        if (message.guild.member(message.author)) {
            let result = await addMember(message);
            if (result.success) {
                messageErrorAsync(
                    message,
                    'You have been successfully added to the database',
                    `<@!${message.author.id}>, you have been successfully added to the database`
                );
                return;
            } else {
                messageErrorAsync(
                    message,
                    `There was an error adding you to the database. Please try again later`,
                    `<@!${message.author.id}>, there was an error adding you to the database. Please try again later`
                );
                return;
            }
        } else {
            messageErrorAsync(
                message,
                "Something isn't right, DM <@!487310051393011713> to manually add you to the DB",
                `<@!${message.author.id}>, **something isn't right, DM <@!487310051393011713> to manually add you to the DB**`
            );
            return;
        }
    },
};
