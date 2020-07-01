const { messageErrorAsync, deleteMessage } = require('../helpers/message');
const { addMember, addMentionedMember } = require('../helpers/member');

module.exports = {
    name: 'add',
    description: 'This command allows you to add your details in the DB',
    guildOnly: true,
    aliases: ['adduser', 'register'],
    usage: ' ',
    execute: async (message, args) => {
        let result = {};
        deleteMessage(message, 0);
        if (message.guild.member(message.author)) {
            let hasMentions = false;
            if (message.mentions.users.size) hasMentions = true;
            if (hasMentions && !message.guild.member(message.author).hasPermission('ADMINISTRATOR'))
                return messageErrorAsync(
                    message,
                    "You can't add others to the database.",
                    `<@!${message.author.id}>, you can't add others to the database`
                );
            result = hasMentions
                ? await addMentionedMember(message, 'add command (mentioned)')
                : await addMember(message, 'add command');
            if (result.success) {
                return messageErrorAsync(
                    message,
                    'You have been successfully added to the database',
                    `<@!${message.author.id}>, you have been successfully added to the database`
                );
            } else if (!result.success && result.message) {
                return;
            } else {
                return messageErrorAsync(
                    message,
                    `There was an error adding you to the database. Please try again later`,
                    `<@!${message.author.id}>, there was an error adding you to the database. Please try again later`
                );
            }
        } else {
            return messageErrorAsync(
                message,
                "Something isn't right, DM <@!487310051393011713> to manually add you to the DB",
                `<@!${message.author.id}>, **something isn't right, DM <@!487310051393011713> to manually add you to the DB**`
            );
        }
    },
};
