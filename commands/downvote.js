const Member = require('../server/models/Member');
const {
    messageErrorAsync,
    botChannelAsync,
    deleteMessage,
    memberErrorAsync,
} = require('../helpers/message');
const { addMemberEvent } = require('../helpers/member');

const downvoteValidator = (member) => {
    let currentLevel = member.level;
    let totalLevelUp = currentLevel === 0 ? 100 : (currentLevel + currentLevel) * 100;

    if (member.levelUp > totalLevelUp) {
        let level = currentLevel === 0 ? 0 : currentLevel - 1;
        let levelUp = member.levelUp - totalLevelUp;
        return {
            level: level,
            levelUp: currentLevel === 0 ? Math.abs(100 + levelUp) : Math.abs(levelUp),
            leveledDown: true,
        };
    }
    return { leveledDown: false };
};

module.exports = {
    name: 'downvote',
    desciption: 'This command lets the user upvote other users for their help',
    args: true,
    guildOnly: true,
    adminOnly: true,
    aliases: ['dvote', 'dv'],
    usage: `@username <keyword>\`\n\n The keywords can be one of the following:\n**spam**: -10 points\n**abuse**: -10 points\n**slang**: -15 points`,
    execute: async (message, args) => {
        typeof args[0] !== 'object' && deleteMessage(message, 0);
        if (!message.member.hasPermission('ADMINISTRATOR'))
            return messageErrorAsync(
                message,
                "You can't you the `/downvote` command",
                `<@!${message.author.id}>, you can't user the \`/downvote\` command`
            );

        let result = {};
        let mentionedMember = message.mentions.users.first() || args[0];
        if (!mentionedMember) {
            return messageErrorAsync(
                message,
                `Invalid mention`,
                `<@!${message.author.id}>, There was no mention found`
            );
        }

        let guildMember = message.guild.member(mentionedMember.id);
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

        console.log(`${typeof args[0]}`);
        if (typeof args[0] !== 'object') {
            if (result.success && result.member) {
                if (result.member.discordId === message.author.id) {
                    return botChannelAsync(
                        message,
                        `<@!${message.author.id}>, come on! You can't downvote yourself :man_shrugging:`
                    );
                }
            } else {
                if (member.discordId === message.author.id) {
                    return botChannelAsync(
                        message,
                        `<@!${message.author.id}>, come on! You can't downvote yourself :man_shrugging:`
                    );
                }
            }
        }

        args = args.slice(1);

        if (!args.length) {
            return messageErrorAsync(
                message,
                `The proper usage would be: \`/downvote @username <keyword>\`\n\n The keywords can be one of the following:\n**spam**: -10 points\n**abuse**: -10 points\n**slang**: -15 points`,
                `<@!${message.author.id}>, the proper usage would be: \`/downvote @username <keyword>\`\n\n The keywords can be one of the following:\n**spam**: -10 points\n**abuse**: -10 points\n**slang**: -15 points`
            );
        }

        if (args.length <= 1) {
            switch (args[0]) {
                case 'slang':
                    if (result.success && result.member) {
                        result.member.points.slang -= 15;
                        result.member.totalPoints -= 15;
                        result.member.levelUp += 15;
                    } else {
                        member.points.slang -= 15;
                        member.totalPoints -= 15;
                        member.levelUp += 15;
                    }
                    break;

                case 'spam':
                    if (result.success && result.member) {
                        result.member.points.spam -= 10;
                        result.member.totalPoints -= 10;
                        result.member.levelUp += 10;
                    } else {
                        member.points.spam -= 10;
                        member.totalPoints -= 10;
                        member.levelUp += 10;
                    }
                    break;

                case 'abuse':
                    if (result.success && result.member) {
                        result.member.points.abuse -= 10;
                        result.member.totalPoints -= 10;
                        result.member.levelUp += 10;
                    } else {
                        member.points.abuse -= 10;
                        member.totalPoints -= 10;
                        member.levelUp += 10;
                    }
                    break;

                case 'rage':
                    if (result.success && result.member) {
                        result.member.points.rage -= 10;
                        result.member.totalPoints -= 10;
                        result.member.levelUp += 10;
                    } else {
                        member.points.rage -= 10;
                        member.totalPoints -= 10;
                        member.levelUp += 10;
                    }
                    break;

                default:
                    return messageErrorAsync(
                        message,
                        'Invalid argument to downvote a user',
                        `<@!${message.author.id}>, you used an invalid argument to downvote the user`
                    );
            }
        } else {
            return messageErrorAsync(
                message,
                `Please upvote for only one type of help at a time.`,
                `<@!${message.author.id}>, please upvote for only one type of help at a time`
            );
        }

        let downvoteResult =
            result.success && result.member
                ? downvoteValidator(result.member)
                : downvoteValidator(member);

        if (downvoteResult.leveledDown) {
            if (result.success && result.member) {
                result.member.level = downvoteResult.level;
                result.member.levelUp = downvoteResult.levelUp;

                memberErrorAsync(
                    message,
                    guildMember,
                    `You have been demoted to **Level ${result.member.level}**`,
                    `<@!${result.member.discordId}>, you have been demoted to **Level ${result.member.level}**`
                );
            } else {
                member.level = downvoteResult.level;
                member.levelUp = downvoteResult.levelUp;
                
                memberErrorAsync(
                    message,
                    guildMember,
                    `You have been demoted to **Level ${member.level}**`,
                    `<@!${member.discordId}>, you have been demoted to **Level ${member.level}**`
                );
            }
        }

        try {
            if (result.success && result.member) {
                await result.member.save();
                memberErrorAsync(
                    message,
                    guildMember,
                    `You were downvoted. You need **${result.member.levelUp}** points to level up`,
                    `<@!${guildMember.id}>, you were downvoted. You need **${result.member.levelUp}** points to level up`
                );
            } else {
                await member.save();
                memberErrorAsync(
                    message,
                    guildMember,
                    `You were downvoted. You need **${member.levelUp}** points to level up`,
                    `<@!${guildMember.id}>, you were downvoted. You need **${member.levelUp}** points to level up`
                );
            }
        } catch (error) {
            console.error(error);
        }
    },
};
