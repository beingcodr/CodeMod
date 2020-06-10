const { MessageEmbed } = require('discord.js');
const { formatDate } = require('../helpers/index');
const Member = require('../server/models/Member');

// me command can add the user in the database with all the args required
module.exports = {
    name: 'userInfo',
    description: 'This command fetches information about the user',
    aliases: ['userinfo'],
    guildOnly: true,
    execute: async (message, args) => {
        let userEmbed;
        try {
            if (!args.length) {
                const member = await Member.findOne({ discordId: message.author.id });
                if (!member) {
                    message.delete();
                    try {
                        await message.author.send(
                            'No such member found, try adding yourself in the database with the `/add` command'
                        );
                    } catch (error) {
                        message.client.channels
                            .fetch(process.env.CM_BOT_CHANNEL)
                            .then((channel) => {
                                channel.send(
                                    'No such member found, try adding yourself in the database with the `/add` command'
                                );
                                channel.send(userEmbed);
                            });
                    }
                    return;
                }

                userEmbed = new MessageEmbed()
                    .setTitle("User's info")
                    .setThumbnail(message.author.avatarURL())
                    .addField('Username', `${message.author.username}`, true)
                    .addField('Joined server on', formatDate(message.guild.joinedAt), true)
                    .addField('Level', `${member.level}`, true)
                    .addField('Username', `${message.author.username}`, true);

                message.delete();
                try {
                    await message.author.send(userEmbed);
                } catch (error) {
                    message.client.channels.fetch(process.env.CM_BOT_CHANNEL).then((channel) => {
                        channel.send(
                            'Your DM is not accessible. Please enable it **User settings > Privacy & safety > Allow messages from server members**'
                        );
                        channel.send(userEmbed);
                    });
                }
            } else {
                const mentionedUser = message.mentions.users.first();
                if (!mentionedUser) return message.reply('No valid mentions found');
                const member = message.guild.member(mentionedUser);
                if (!member) {
                    message.delete();
                    try {
                        message.author.send(
                            `<@!${mentionedUser.id}> is not a member of ${message.guild.name}`
                        );
                    } catch (error) {
                        message.client.channels
                            .fetch(process.env.CM_BOT_CHANNEL)
                            .then((channel) => {
                                channel.send(
                                    `<@!${mentionedUser.id}> is not a member of ${message.guild.name}`
                                );
                            });
                    }
                    return;
                }

                const returnedMember = await Member.findOne({ discordId: mentionedUser.id });
                if (!returnedMember) {
                    message.delete();
                    return message.author.send('This user is not registered in the DB');
                }

                userEmbed = new MessageEmbed()
                    .setTitle("User's info")
                    .setThumbnail(returnedMember.avatar)
                    .addField('Username', `${returnedMember.username}`, true)
                    .addField('Joined server on', formatDate(returnedMember.joinedAt), true)
                    .addField('Level', `${returnedMember.level}`, true);

                message.delete();
                try {
                    await message.author.send(userEmbed);
                } catch (error) {
                    message.client.channels.fetch(process.env.CM_BOT_CHANNEL).then((channel) => {
                        channel.send(
                            `<@!${message.author.id}> Your DM is not accessible. Please enable it **User settings > Privacy & safety > Allow messages from server members**`
                        );
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
};
