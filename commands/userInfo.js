const { MessageEmbed } = require('discord.js');
const { formatDate } = require('../helpers/index');
const { messageErrorAsync } = require('../helpers/message');
const Member = require('../server/models/Member');

// me command can add the user in the database with all the args required
module.exports = {
    name: 'userInfo',
    description: 'This command fetches information about the user',
    aliases: ['userinfo'],
    guildOnly: true,
    usage: '@username',
    execute: async (message, args) => {
        let userEmbed;
        try {
            if (!args.length) {
                const member = await Member.findOne({ discordId: message.author.id });
                if (!member) {
                    message.delete();
                    messageErrorAsync(
                        message,
                        'No such member found, try adding yourself in the database with the `/add` command',
                        `<@!${message.author.id}>, No such member found, try adding yourself in the database with the \`/add\` command`
                    );
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

                messageErrorAsync(
                    message,
                    userEmbed,
                    `<@!${message.author.id}> Cannot send the embed`
                );
            } else {
                const mentionedUser = message.mentions.users.first();
                if (!mentionedUser) return message.reply('No valid mentions found');
                const member = message.guild.member(mentionedUser);
                if (!member) {
                    message.delete();
                    messageErrorAsync(
                        message,
                        `<@!${mentionedUser.id}> is not a member of ${message.guild.name}`,
                        `<@!${message.author.id}>, <@!${mentionedUser.id}> is not a member of ${message.guild.name}`
                    );
                    return;
                }

                const returnedMember = await Member.findOne({ discordId: mentionedUser.id });
                if (!returnedMember) {
                    message.delete();
                    messageErrorAsync(
                        message,
                        'This user is not registered in the DB',
                        `<@!${message.author.id}>, <@!${mentionedUser.id}> is not registered in the DB`
                    );
                    return;
                }

                userEmbed = new MessageEmbed()
                    .setTitle("User's info")
                    .setThumbnail(returnedMember.avatar)
                    .addField('Username', `${returnedMember.username}`, true)
                    .addField('Joined server on', formatDate(returnedMember.joinedAt), true)
                    .addField('Level', `${returnedMember.level}`, true);

                message.delete();
                messageErrorAsync(message, userEmbed, `<@!${message.author.id}> `);
            }
        } catch (error) {
            console.log(error);
        }
    },
};
