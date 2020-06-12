const Member = require('../server/models/Member');
const {
    messageErrorAsync,
    botChannelAsync,
    deleteMessage,
    memberErrorAsync,
} = require('../helpers/message');

const levelChecker = (member, levelUp) => {
    if (levelUp === 0) {
        let level = member.level + 1;
        return {
            level: level,
            levelUp: (level + level) * 100,
            leveledUp: true,
        };
    } else if (levelUp < 0) {
        let level = member.level + 1;
        return {
            level: level,
            levelUp: (level + level) * 100,
            leveledUp: true,
            extraPoints: Math.abs(levelUp),
        };
    }
    return { leveledUp: false };
};

module.exports = {
    name: 'upvote',
    desciption: 'This command lets the user upvote other users for their help',
    guildOnly: true,
    args: true,
    usage: '@username <keyword>',
    execute: async (message, args) => {
        let mentionedMember = message.mentions.users.first();
        if (!mentionedMember) {
            deleteMessage(message, 0);
            messageErrorAsync(
                message,
                `Invalid mention`,
                `<@!${message.author.id}>, There was no mention found`
            );
            return;
        }

        let guildMember = message.guild.member(mentionedMember);
        if (!guildMember) {
            deleteMessage(message, 0);
            messageErrorAsync(
                message,
                `<@!${mentionedMember.id}> is not a member of ${message.guild.name}`,
                `<@!${message.author.id}>, <@!${mentionedMember.id}> is not a member of ${message.guild.name}`
            );
            return;
        }

        const member = await Member.findOne({ discordId: mentionedMember.id });
        if (!member) {
            deleteMessage(message, 0);
            messageErrorAsync(
                message,
                `<@!${mentionedMember.id}> is not registered in the database`,
                `<@!${message.author.id}>, <@!${mentionedMember.id}> is not registered in the DB`
            );
            return;
        }

        if (member.discordId === message.author.id) {
            deleteMessage(message, 0);
            botChannelAsync(
                message,
                `<@!${message.author.id}>, come on! You can't upvote yourself :man_shrugging:`
            );
            return;
        }

        args = args.slice(1);

        if (args.length <= 1) {
            switch (args[0]) {
                case 'codeError':
                    member.points.codeError += 15;
                    member.totalPoints += 15;
                    member.levelUp -= 15;
                    break;

                case 'contribution':
                    member.points.contribution += 10;
                    member.totalPoints += 10;
                    member.levelUp -= 10;
                    break;

                case 'verbalDoubt':
                    member.points.verbalDoubt += 10;
                    member.totalPoints += 10;
                    member.levelUp -= 10;
                    break;

                case 'codeDoubt':
                    member.points.codeDoubt += 10;
                    member.totalPoints += 10;
                    member.levelUp -= 10;
                    break;

                case 'sharedResource':
                    member.points.sharedResource += 5;
                    member.totalPoints += 5;
                    member.levelUp -= 5;
                    break;

                case 'slangUsed':
                    member.points.slangUsed -= 5;
                    member.totalPoints -= 5;
                    member.levelUp += 5;
                    break;

                default:
                    messageErrorAsync(
                        message,
                        'Invalid argument to upvote a user',
                        `<@!${message.author.id}>, you used an invalid argument to upvote the user`
                    );
            }
        } else {
            deleteMessage(message, 0);
            messageErrorAsync(
                message,
                `Please upvote for only one type of help at a time.`,
                `<@!${message.author.id}>, please upvote for only one type of help at a time`
            );
            return;
        }

        let result = levelChecker(member, member.levelUp);

        if (result.leveledUp) {
            member.level = result.level;
            member.levelUp = result.levelUp;
            if (result.extraPoints) {
                member.totalPoints += result.extraPoints;
                member.levelUp -= result.extraPoints;
            }

            botChannelAsync(
                message,
                `<@!${message.author.id}>, has reached level **${member.level}**`
            );
        }

        console.log(levelChecker(member, member.levelUp));

        deleteMessage(message, 0);
        try {
            await member.save();
            memberErrorAsync(
                message,
                guildMember,
                `<@!${message.author.id}> upvoted you with keyword ${args[0]}. Your \`totalPoints\` is **${member.totalPoints}**`,
                `<@!${guildMember.id}>, you were upvoted by <@!${message.author.id}>. Your \`totalPoints\` is **${member.totalPoints}**`
            );
        } catch (error) {
            console.log(error);
        }
    },
};
