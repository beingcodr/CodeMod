const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { formatDate } = require('../helpers/index');
const { messageErrorAsync, deleteMessage } = require('../helpers/message');
const Member = require('../server/models/Member');
const Server = require('../server/models/Server');

// me command can add the user in the database with all the args required
module.exports = {
    name: 'userInfo',
    description: 'This command fetches information about the user',
    aliases: ['userinfo'],
    guildOnly: true,
    usage: '@username',
    execute: async (message, args) => {
        let hasMentions = false;
        if (message.mentions.users.size) hasMentions = true;
        let returnedServer = await Server.findOne({ serverId: message.guild.id });
        if (!returnedServer) {
            return messageErrorAsync(
                message,
                'This server is not registered. Please register it first with `/addServer` command',
                `<@${message.author.id}>, this server is not registered. Please register it first with \`/addServer\` command`
            );
        }
        const userEmbed = (returnedMember) => {
            return new MessageEmbed()
                .setTitle("User's info")
                .setThumbnail(
                    returnedMember.avatar
                        ? returnedMember.avatar
                        : hasMentions
                        ? message.guild
                              .member(message.mentions.users.first())
                              .user.displayAvatarURL()
                        : message.author.displayAvatarURL()
                )
                .setColor(colors.green)
                .addField('Username', `${returnedMember.username}`, true)
                .addField('Server name', `${returnedMember.serverId.name}`, true)
                .addField('Joined server on', formatDate(returnedMember.joinedAt), true)
                .addField('\u200b', '\u200b')
                .addField('Level', `${returnedMember.level}`, true)
                .addField('TotalPoints', `${returnedMember.totalPoints}`, true)
                .addField('\u200b', '\u200b')
                .addField('Points needed to level up', `${returnedMember.levelUp}`, true)
                .addField('Warned', `${returnedMember.warn.length} times`, true)
                .addField('\u200b', '\u200b')
                .addField('Roles', `${rolesArray.join(', ')}` || 'No roles');
        };

        const setRoles = (returnedMember) => {
            returnedMember.roles.forEach((role) => {
                let guildRole = message.member.roles.cache.find(
                    (guildRoleId) => role === guildRoleId.id
                );
                if (guildRole) rolesArray.push(`**${guildRole.name}**`);
            });
        };
        let rolesArray = [];
        deleteMessage(message, 0);
        try {
            if (!args.length) {
                const returnedMember = await Member.findOne({
                    discordSlug: `${message.author.id}${message.guild.id}`,
                }).populate('serverId');
                if (!returnedMember) {
                    return messageErrorAsync(
                        message,
                        "You're not in the DB, try adding yourself in the database with the `/add` command",
                        `<@!${message.author.id}>, No such member found, try adding yourself in the database with the \`/add\` command`
                    );
                }

                setRoles(returnedMember);
                messageErrorAsync(
                    message,
                    userEmbed(returnedMember),
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

                const returnedMember = await Member.findOne({
                    discordId: mentionedUser.id,
                }).populate('serverId');
                if (!returnedMember) {
                    return messageErrorAsync(
                        message,
                        'This user is not registered in the DB',
                        `<@!${message.author.id}>, <@!${mentionedUser.id}> is not registered in the DB`
                    );
                }

                setRoles(returnedMember);
                messageErrorAsync(message, userEmbed(returnedMember), `<@!${message.author.id}> `);
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
