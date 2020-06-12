const Member = require('../server/models/Member');
const { messageErrorAsync, botChannelAsync } = require('../helpers/message');

module.exports = {
    name: 'add',
    guildOnly: true,
    aliases: ['adduser', 'register'],
    usage: ' ',
    execute: async (message, args) => {
        if (message.guild.member(message.author)) {
            let returnedMember = await Member.findOne({ discordId: message.author.id });
            if (returnedMember) {
                message.delete();
                messageErrorAsync(
                    message,
                    "You're already in the database. Update your details with `update` command",
                    `**<@!${message.author.id}> you're already in the database. Update your details with \`update\` command.**`
                );
                return;
            }

            let newUser = new Member({
                entity: 'Member',
                discordId: message.author.id,
                discriminator: `#${message.author.discriminator}`,
                username: message.author.username,
                nickName: message.member.nickname,
                avatar: message.author.avatarURL(),
                server: message.guild.name,
                joinedAt: message.guild.joinedAt,
                level: 0,
                levelUp: 100,
                totalPoints: 0,
                points: {
                    codeError: 0,
                    verbalDoubt: 0,
                    codeDoubt: 0,
                    contribution: 0,
                    sharedResource: 0,
                    slangUsed: 0,
                },
                roles: [...message.member._roles],
            });

            message
                .delete()
                .catch(() =>
                    console.log(
                        '[Warning]: DM to the bot cannot be deleted with `message.delete()` '
                    )
                );
            try {
                await newUser.save();

                messageErrorAsync(
                    message,
                    'You have been successfully added to the database',
                    `<@!${message.author.id}>, you have been successfully added to the database`
                );
            } catch (error) {
                botChannelAsync(
                    message,
                    `<@!${message.author.id}>, there was an error adding you to the database. Please try again later`
                );
            }
        } else {
            messageErrorAsync(
                message,
                "Something isn't right, DM <@!487310051393011713> to manually add you to the DB",
                `<@!${message.author.id}>, **something isn't right, DM <@!487310051393011713> to manually add you to the DB**`
            );
        }
    },
};
