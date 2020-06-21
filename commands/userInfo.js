const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { formatDate } = require('../helpers/index');
const { messageErrorAsync, deleteMessage } = require('../helpers/message');
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
        let rolesArray = [];
        deleteMessage(message, 0);
        try {
            if (!args.length) {
                const returnedMember = await Member.findOne({ discordId: message.author.id });
                if (!returnedMember) {
                    deleteMessage(message, 0);
                    return messageErrorAsync(
                        message,
                        "You're not in the DB, try adding yourself in the database with the `/add` command",
                        `<@!${message.author.id}>, No such member found, try adding yourself in the database with the \`/add\` command`
                    );
                }

                returnedMember.roles.forEach((role) => {
                    let guildRole = message.member.roles.cache.find(
                        (guildRoleId) => role === guildRoleId.id
                    );
                    console.log(guildRole);
                    if (guildRole) rolesArray.push(`**${guildRole.name}**`);
                });
                console.log(rolesArray);

                userEmbed = new MessageEmbed()
                    .setTitle("User's info")
                    .setThumbnail(returnedMember.avatar)
                    .setColor(colors.green)
                    .addField('Username', `${returnedMember.username}`, true)
                    .addField('Joined server on', formatDate(returnedMember.joinedAt), true)
                    .addField('\u200b', '\u200b')
                    .addField('Level', `${returnedMember.level}`, true)
                    .addField('TotalPoints', `${returnedMember.totalPoints}`, true)
                    .addField('\u200b', '\u200b')
                    .addField('Points needed to level up', `${returnedMember.levelUp}`, true)
                    .addField('Warned', `${returnedMember.warn.length} times`, true)
                    .addField('Roles', `${rolesArray.join(', ')}` || 'No roles');

                messageErrorAsync(
                    message,
                    userEmbed,
                    `<@!${message.author.id}> I wasn't able to send the user information`
                );
            } else {
                const mentionedUser = message.mentions.users.first();
                if (!mentionedUser) return message.reply('No valid mentions found');
                const member = message.guild.member(mentionedUser);
                if (!member) {
                    return messageErrorAsync(
                        message,
                        `<@!${mentionedUser.id}> is not a member of **${message.guild.name}**`,
                        `<@!${message.author.id}>, <@!${mentionedUser.id}> is not a member of **${message.guild.name}**`
                    );
                }

                const returnedMember = await Member.findOne({ discordId: mentionedUser.id });
                if (!returnedMember) {
                    return messageErrorAsync(
                        message,
                        'This user is not registered in the DB',
                        `<@!${message.author.id}>, <@!${mentionedUser.id}> is not registered in the DB`
                    );
                }

                userEmbed = new MessageEmbed()
                    .setTitle("User's info")
                    .setThumbnail(returnedMember.avatar)
                    .setColor(colors.green)
                    .addField('Username', `${returnedMember.username}`, true)
                    .addField('Joined server on', formatDate(returnedMember.joinedAt), true)
                    .addField('\u200b', '\u200b')
                    .addField('Level', `${returnedMember.level}`, true)
                    .addField('TotalPoints', `${returnedMember.totalPoints}`, true)
                    .addField('\u200b', '\u200b')
                    .addField('Points needed to level up', `${returnedMember.levelUp}`, true)
                    .addField('Warned', `${returnedMember.warn.length} times`, true)
                    .addField('Roles', `${rolesArray.join(', ')}` || 'No roles');

                messageErrorAsync(message, userEmbed, `<@!${message.author.id}> `);
            }
        } catch (error) {
            console.log(error);
            return messageErrorAsync(
                message,
                'There was an error while fetching the user information. Try again later',
                `<@!${message.author.id}>, there was an error while fetching the user information. Try again later`
            );
        }
    },
};
