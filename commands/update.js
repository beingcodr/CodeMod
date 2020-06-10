const Member = require('../server/models/Member');

module.exports = {
    name: 'update',
    description: 'This command updates the users information in the database',
    aliases: ['updateuser'],
    guildOnly: true,
    execute: async (message, args) => {
        if (message.guild.member(message.author)) {
            let returnedMember = await Member.findOne({ discordId: message.author.id });
            if (!returnedMember) {
                message.delete();

                try {
                    await message.author.send(
                        "You're not in the database. You can add your details with `add` command"
                    );
                } catch (error) {
                    message.client.channels.fetch(process.env.CM_BOT_CHANNEL).then((channel) => {
                        channel.send(
                            `${message.author}, you\'re not in the database, add your details with \`add\` command. Your DM is not accessible. **User settings > Privacy & safety > Allow messages from server members**. Please enable it`
                        );
                    });
                }
                return;
            }

            returnedMember.discordId = message.author.id;
            returnedMember.discriminator = `#${message.author.discriminator}`;
            returnedMember.username = message.author.username;
            returnedMember.nickName = message.member.nickname;
            returnedMember.avatar = message.author.avatarURL();
            returnedMember.server = message.guild.name;
            returnedMember.joinedAt = message.guild.joinedAt;
            returnedMember.roles = [...message.member._roles];

            message.delete();

            try {
                await returnedMember.save();
                try {
                    await message.author.send('Successfully updated your details to the database');
                } catch (error) {
                    message.client.channels.fetch(process.env.CM_BOT_CHANNEL).then((channel) => {
                        channel.send(
                            `<@!${message.author.id}> updated your details in the database. Your DM is not accessible, please enable it **User settings > Privacy & safety > Allow messages from server members**`
                        );
                    });
                }
            } catch (error) {
                message.channel.send(`${error}`);
            }
        } else {
            message.delete();

            try {
                await message.author.send(
                    "Something isn't right, DM <@!487310051393011713> to manually add you to the DB"
                );
            } catch (error) {
                message.client.channels.fetch(process.env.CM_BOT_CHANNEL).then((channel) => {
                    channel.send(
                        `Something isn't right, DM <@!487310051393011713> to manually add you to the DB. Your DM is not accessible, please enable it **User settings > Privacy & safety > Allow messages from server members**`
                    );
                });
            }
        }
    },
};
