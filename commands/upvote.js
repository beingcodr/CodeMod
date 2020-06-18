const Member = require('../server/models/Member');
const {
    messageErrorAsync,
    botChannelAsync,
    deleteMessage,
    memberErrorAsync,
} = require('../helpers/message');
const { addMemberEvent } = require('../helpers/member');

const upvoteValidator = (member) => {
    if (member.levelUp === 0) {
        let level = member.level + 1;
        return {
            level: level,
            levelUp: (level + level) * 100,
            leveledUp: true,
        };
    } else if (member.levelUp < 0) {
        let level = member.level + 1;
        return {
            level: level,
            levelUp: (level + level) * 100,
            leveledUp: true,
            extraPoints: Math.abs(member.levelUp),
        };
    }
    return { leveledUp: false };
};

module.exports = {
    name: 'upvote',
    desciption: 'This command lets the user upvote other users for their help',
    guildOnly: true,
    args: true,
    aliases: ['uvote', 'uv'],
    usage: `@username <keyword>\`\n\n The keywords can be one of the following:\n**contribution**: +15 points\n**doubt**: +5 points\n**error**: +10 points\n**resource**: +5`,
    execute: async (message, args) => {
        deleteMessage(message, 0);
        let result = {};
        let mentionedMember = message.mentions.users.first();
        if (!mentionedMember) {
            messageErrorAsync(
                message,
                `Invalid mention`,
                `<@!${message.author.id}>, There was no mention found`
            );
            return;
        }

        let guildMember = message.guild.member(mentionedMember);
        if (!guildMember) {
            return messageErrorAsync(
                message,
                `<@!${mentionedMember.id}> is not a member of ${message.guild.name}`,
                `<@!${message.author.id}>, <@!${mentionedMember.id}> is not a member of ${message.guild.name}`
            );
        }

        const member = await Member.findOne({ discordId: mentionedMember.id });
        if (!member) {
            result = await addMemberEvent(guildMember);
        }

        if (result.success && result.member) {
            if (result.member.discordId === message.author.id) {
                return botChannelAsync(
                    message,
                    `<@!${message.author.id}>, come on! You can't upvote yourself :man_shrugging:`
                );
            }
        } else {
            if (member.discordId === message.author.id) {
                return botChannelAsync(
                    message,
                    `<@!${message.author.id}>, come on! You can't upvote yourself :man_shrugging:`
                );
            }
        }

        args = args.slice(1);
        if (!args.length) {
            return messageErrorAsync(
                message,
                `The proper usage would be: \`/upvote @username <keyword>\`\n\n The keywords can be one of the following:\n**contribution**: +15 points\n**doubt**: +10 points\n**error**: +10 points\n**resource**: +5`,
                `<@!${message.author.id}>, the proper usage would be: \`/upvote @username <keyword>\`\n\n The keywords can be one of the following:\n**contribution**: +15 points\n**doubt**: +10 points\n**error**: +10 points\n**resource**: +5`
            );
        }

        if (args.length <= 1) {
            switch (args[0]) {
                case 'contribution':
                    if (result.success && result.member) {
                        result.member.points.contribution += 15;
                        result.member.totalPoints += 15;
                        result.member.levelUp -= 15;
                    } else {
                        member.points.contribution += 15;
                        member.totalPoints += 15;
                        member.levelUp -= 15;
                    }
                    break;

                case 'error':
                    if (result.success && result.member) {
                        result.member.points.error += 10;
                        result.member.totalPoints += 10;
                        result.member.levelUp -= 10;
                    } else {
                        member.points.error += 10;
                        member.totalPoints += 10;
                        member.levelUp -= 10;
                    }
                    break;

                case 'doubt':
                    if (result.success && result.member) {
                        result.member.points.doubt += 10;
                        result.member.totalPoints += 10;
                        result.member.levelUp -= 10;
                    } else {
                        member.points.doubt += 10;
                        member.totalPoints += 10;
                        member.levelUp -= 10;
                    }
                    break;

                case 'resource':
                    if (result.success && result.member) {
                        result.member.points.resource += 5;
                        result.member.totalPoints += 5;
                        result.member.levelUp -= 5;
                    } else {
                        member.points.resource += 5;
                        member.totalPoints += 5;
                        member.levelUp -= 5;
                    }
                    break;

                default:
                    return messageErrorAsync(
                        message,
                        'Invalid argument to upvote a user',
                        `<@!${message.author.id}>, you used an invalid argument to upvote the user`
                    );
            }
        } else {
            return messageErrorAsync(
                message,
                `Please upvote for only one type of help at a time.`,
                `<@!${message.author.id}>, please upvote for only one type of help at a time`
            );
        }

        let upvoteResult =
            result.success && result.member
                ? upvoteValidator(result.member)
                : upvoteValidator(member);

        if (upvoteResult.leveledUp) {
            if (result.success && result.member) {
                result.member.level = upvoteResult.level;
                result.member.levelUp = upvoteResult.levelUp;
                if (upvoteResult.extraPoints) {
                    result.member.levelUp -= upvoteResult.extraPoints;
                }

                memberErrorAsync(
                    message,
                    guildMember,
                    `Congratulations <@!${guildMember.id}>, you have been promoted to level **${result.member.level}**`,
                    `Congratulations <@!${guildMember.id}>, you have been promoted to level **${result.member.level}**`
                );
            } else {
                member.level = upvoteResult.level;
                member.levelUp = upvoteResult.levelUp;
                if (upvoteResult.extraPoints) {
                    member.levelUp -= upvoteResult.extraPoints;
                }

                memberErrorAsync(
                    message,
                    guildMember,
                    `Congratulations <@!${guildMember.id}>, you have been promoted to level **${member.level}**`,
                    `Congratulations <@!${guildMember.id}>, you have been promoted to level **${member.level}**`
                );
            }
        }

        try {
            if (result.success && result.member) {
                await result.member.save();
                console.log(message);
                memberErrorAsync(
                    message,
                    guildMember,
                    `<@!${message.author.id}> upvoted you with the keyword **${args[0]}**. You need **${result.member.levelUp}** points to level up`,
                    `<@!${guildMember.id}>, you were upvoted by <@!${message.author.id}>. You need **${result.member.levelUp}** points to level up`
                );
                messageErrorAsync(
                    message,
                    `Successfully upvoted <@!${guildMember.id}>`,
                    `<@!${message.author.id}>, successfully upvoted <@!${guildMember.id}>`
                );
            } else {
                await member.save();
                memberErrorAsync(
                    message,
                    guildMember,
                    `<@!${message.author.id}> upvoted you with the keyword **${args[0]}**. You need **${member.levelUp}** points to level up`,
                    `<@!${guildMember.id}>, you were upvoted by <@!${message.author.id}>. You need **${member.levelUp}** points to level up`
                );
                messageErrorAsync(
                    message,
                    `Successfully upvoted <@!${guildMember.id}>`,
                    `<@!${message.author.id}>, successfully upvoted <@!${guildMember.id}>`
                );
            }
        } catch (error) {
            console.log(error);
        }
    },
};
