const { deleteMessage, messageErrorAsync } = require('../helpers/message');
const { addServer } = require('../helpers/member');

module.exports = {
    name: 'addServer',
    description:
        'This command adds the current server to the database so that all the fellow member details are properly linked with the server information ',
    aliases: ['addserver'],
    execute: async (message, args) => {
        let result = {};
        deleteMessage(message, 0);
        if (message.guild.member(message.author)) {
            result = await addServer(message);
            if (result.success) {
                return messageErrorAsync(
                    message,
                    'Server has been successfully registered',
                    `<@!${message.author.id}>, server has been successfully registered`
                );
            } else if (!result.success && result.message) {
                return;
            } else {
                return messageErrorAsync(
                    message,
                    `There was an error registering the server. Please try again later`,
                    `<@!${message.author.id}>, there was an error registering the server. Please try again later`
                );
            }
        }
    },
};
