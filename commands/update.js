const Member = require('../server/models/Member');
const { messageErrorAsync, botChannelAsync, deleteMessage } = require('../helpers/message');
const { botCount } = require('../helpers');

module.exports = {
    name: 'update',
    description: 'This command updates the users information in the database',
    aliases: ['updateuser'],
    guildOnly: true,
    usage: ' ',
    execute: async (message, args) => {
        deleteMessage(message, 0);
        let botCountResult;
        botCountResult = botCount(message);
        if (message.guild.member(message.author)) {
            let returnedMember = await Member.findOne({
                discordSlug: `${message.author.id}${message.guild.id}`,
            });
            if (!returnedMember) {
                return messageErrorAsync(
                    message,
                    "You're not in the database. You can add your details with `add` command",
                    `**<@!${message.author.id}>, you're not in the database, add your details with \`add\` command.**`
                );
            }

            returnedMember.discordId = message.author.id;
            returnedMember.discordSlug = `${message.author.id}${message.guild.id}`;
            returnedMember.discriminator = `#${message.author.discriminator}`;
            returnedMember.username = message.author.username;
            returnedMember.nickName = message.member.nickname;
            returnedMember.avatar = message.author.avatarURL();
            returnedMember.joinedAt = message.member.joinedAt;
            returnedMember.roles = [...message.member._roles];

            try {
                await returnedMember.save();
                messageErrorAsync(
                    message,
                    'Successfully updated your details to the database',
                    `**<@!${message.author.id}> updated your details in the database.**`
                );
            } catch (error) {
                console.log(error);
                return botChannelAsync(
                    message,
                    `<@!${message.author.id}>, there was an error while updating your details`
                );
            }
        } else {
            return messageErrorAsync(
                message,
                "You're not a member of this server, DM <@!487310051393011713> if you're a member and this error still persists",
                `**<@!${message.author.id}> you're not a member of this server, DM <@!487310051393011713> if you're a member and this error still persists**`
            );
        }
    },
};
