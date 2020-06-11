const Member = require('../server/models/Member');
const { botChannel } = require('../json/config.json');
const { messageErrorAsync, botChannelAsync } = require('../helpers/message');

module.exports = {
    name: 'upvote',
    desciption: 'This command lets the user upvote other users for their help',
    guildOnly: true,
    args: true,
    usage: '@username <keyword>',
    execute: async (message, args) => {
        mentionedMember = message.mentions.users.first();
        if (!mentionedMember) return;

        const member = await Member.findOne({ discordId: message.mentions.users.first().id });
        if (!member) {
            messageErrorAsync(
                message,
                `<@!${mentionedMember.id}> is not registered in the database`,
                `<@!${message.author.id}>, the user you mentioned is not registered in the DB`
            );
        }

        switch (args.slice(1)) {
            case value:
                break;

            default:
                break;
        }
    },
};
