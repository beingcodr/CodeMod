const Member = require('../server/models/Member');

module.exports = {
    name: 'add',
    guildOnly: true,
    aliases: ['adduser'],
    execute: async (message, args) => {
        if (message.guild.member(message.author)) {
            let returnedMember = await Member.findOne({ discordId: message.author.id });
            if (returnedMember) {
                message.delete();

                try {
                    await message.author.send(
                        "you're already in the database. Update your details with `update` command"
                    );
                } catch (error) {
                    message.client.channels.fetch(process.env.CM_BOT_CHANNEL).then((channel) => {
                        channel.send(
                            `<@!${message.author.id}> you're already in the database. Update your details with \`update\` command. Your DM is not accessible, please enable it **User settings > Privacy & safety > Allow messages from server members**`
                        );
                    });
                }
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

                try {
                    await message.author.send('You have been successfully added to the database');
                } catch (error) {
                    message.reply(
                        ' successfully added your details, your DM is not accessible. Please enable it **User settings > Privacy & safety > Allow messages from server members**'
                    );
                }
            } catch (error) {
                message.channel.send(`${error}`);
            }
        } else {
            message.author.send(
                "Something isn't right, DM <@!487310051393011713> to manually add you to the DB"
            );
        }
    },
};
