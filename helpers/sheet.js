const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { botChannelAsync } = require('./message');

const cliChecklist = [
    'functionality 1',
    'functionality 2',
    'functionality 3',
    'functionality 4',
    'functionality 5',
];
const portfolioChecklist = [
    'portfolio functionality 1',
    'portfolio functionality 2',
    'portfolio functionality 3',
    'portfolio functionality 4',
    'portfolio functionality 5',
];

const getByDiscordTag = async (rows, tag) => {
    const user = rows.filter((row) => {
        return row.discordTag === tag;
    });
    return user;
};

module.exports = {
    getByDiscordTag,
    recordSubmissions: async (message, args, projectNum, rows, flag) => {
        try {
            let user = await getByDiscordTag(rows, message.author.tag);
            // let user = await getByDiscordTag(rows, args);
            // console.log('User', user);

            if (!user.length) {
                await sheet.addRow({
                    discordId: message.author.id,
                    discordTag: message.author.tag,
                    [`${projectNum}`]: args,
                });
                return true;
            } else {
                const isAvailable =
                    rows[user[0].rowIndex - 2][`${projectNum}`] !== undefined &&
                    flag
                        .split('')
                        .slice(flag.length - 1)
                        .join('') !== 'R'
                        ? true
                        : false;
                if (isAvailable) {
                    botChannelAsync(
                        message,
                        `<@!${message.author.id}>, You've already submitted ${projectNum}\n\nIf you wish to replace the existing project URL, use the command \`/nc ${flag}R <new-hosted-url>\``
                    );
                    return 'true';
                }

                // updating the row
                rows[user[0].rowIndex - 2][`${projectNum}`] = `${args}`;
                // saving the updated row
                await rows[user[0].rowIndex - 2].save();
                return true;
            }
        } catch (error) {
            console.log(error);
            botChannelAsync(message, `${error.message}`);
            return false;
        }
    },
    fetchSubmission: async (message, rows) => {
        try {
            let hasMentions = false;
            let messageEmbed;
            if (message.mentions.users.size) hasMentions = true;

            const mentionedUser = hasMentions ? message.mentions.users.first() : message.author;
            let fetchedSubmission = [];

            // fetching the row that matches the discordTag
            fetchedSubmission = rows.filter(
                (row) =>
                    row.discordUsername ===
                    `${mentionedUser.username}#${mentionedUser.discriminator}`
            );

            if (fetchedSubmission.length) {
                // Constructing a common message embed for both cases
                messageEmbed = new MessageEmbed()
                    .setTitle('✅   Submission Details')
                    .setThumbnail(mentionedUser.avatarURL())
                    .setColor(colors.green)
                    .addField('Fetched user', `<@!${mentionedUser.id}>`, true)
                    .addField('\u200b', '\u200b')
                    .addField(
                        'Project links',
                        `${fetchedSubmission[0].projectUrls
                            .split(', ')
                            .map(
                                (url, index) =>
                                    ` [project ${index + 1}](${
                                        url.includes('https://' || 'http://')
                                            ? url
                                            : `https://${url}`
                                    })`
                            )}`,
                        true
                    );
            } else {
                botChannelAsync(
                    message,
                    `<@!${message.author.id}>, There is no entry ${
                        hasMentions ? 'for the mentioned user' : 'of your submission'
                    }`
                );
            }

            botChannelAsync(message, messageEmbed);
        } catch (error) {
            console.error(error);
            botChannelAsync(message, error.message);
        }
    },
    submitReview: async (message, args) => {
        let mentionedUser;
        if (!message.mentions.users.size)
            // ! This has to be the neogcampPrivateChannel
            return botChannelAsync(
                message,
                `<@!${message.author.id}>, please @tag a valid user to submit the review`
            );

        const formatReviewParam = (checklistLength, reviewParam) => {
            if (checklistLength !== reviewParam.length) {
                if (reviewParam.length < checklistLength) {
                    return reviewParam.padEnd(checklistLength, '0');
                } else if (reviewParam.length > checklistLength) {
                    return reviewParam.substring(0, checklistLength);
                }
            }
            return true;
        };

        mentionedUser = message.mentions.users.first();
        console.log('pure args', args);
        args = args.filter((arg) => arg !== '').slice(1);
        console.log(`Review args: ${args}`);
        let projectName = args[0];

        let reviewParam;
        switch (projectName) {
            case 'cliapp':
                reviewParam = formatReviewParam(cliChecklist.length, args.slice(1).join(''));
                botChannelAsync(
                    message,
                    `<@!${
                        mentionedUser.id
                    }>, your latest submission has been reviewed\n\n${reviewParam
                        .split('')
                        .map(
                            (arg, index) =>
                                `${+arg >= 1 ? '✅    ' : '❌    '}${cliChecklist[index]}`
                        )
                        .join('\n\n')}`
                );
                break;

            case 'portfolio':
                reviewParam = formatReviewParam(portfolioChecklist.length, args.slice(1).join(''));
                botChannelAsync(
                    message,
                    `<@!${
                        mentionedUser.id
                    }>, your latest submission has been reviewed\n\n${reviewParam
                        .split('')
                        .map(
                            (arg, index) =>
                                `${+arg >= 1 ? '✅    ' : '❌    '}${portfolioChecklist[index]}`
                        )
                        .join('\n\n')}`
                );
                break;

            default:
                // ! This has to be the neogcampPrivateChannel
                botChannelAsync(
                    message,
                    `<@!${message.author.id}>, Please enter a valid project name\nFor example: cliapp, portfolio,etc are valid project names as of now`
                );
                break;
        }
    },
};
