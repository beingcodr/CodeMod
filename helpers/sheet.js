const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { botChannelAsync, submissionChannelAsync } = require('./message');

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

const projectNames = [
    'cliapp',
    'portfolio',
    'portfolio',
    'portfolio',
    'portfolio',
    'portfolio',
    'portfolio',
    'portfolio',
    'portfolio',
    'portfolio',
];

const getByDiscordTag = async (rows, tag) => {
    const user = rows.filter((row) => {
        return row.discordTag === tag;
    });
    return user;
};

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

const processReview = async (message, mentionedUser, checklist, args) => {
    let reviewParam;
    let reviewCount = 0;
    reviewParam = formatReviewParam(checklist.length, args);
    console.log('ReviewParam: ', reviewParam);
    // Updating the reviewCount to see if the project satisfies the checklist
    // If yes then this submittion is counted a valid project submission against NeogCamp eligibility
    reviewParam.split('').forEach((arg) => {
        if (+arg >= 1) {
            reviewCount += 1;
        }
    });
    return botChannelAsync(
        message,
        `<@!${mentionedUser.id}>, your latest submission has been reviewed\n\n${reviewParam
            .split('')
            .map((arg, index) => {
                return `${+arg >= 1 ? '✅    ' : '❌    '}${checklist[index]}`;
            })
            .join('\n\n')}\n\n${
            reviewCount === checklist.length
                ? `You're ${1} project away from qualifying for NeogCamp level 1`
                : `**Please integrate the functionalities marked with ❌ and re-submit the project.**\n\nYou may use the command \`/nc -rsp<project-num>\`.\n**For example:** \`/nc -rsp1\` for re-submitting \`project 1\`, \`/nc -rsp2\` for re-submitting \`project 2\` and so on.`
        }`
    );
};

module.exports = {
    getByDiscordTag,
    recordSubmissions: async (message, args, projectNum, rows, flag, sheet) => {
        try {
            let user = await getByDiscordTag(rows, message.author.tag);
            // let user = await getByDiscordTag(rows, args);
            // console.log('User', user);

            let submissionEmbed = new MessageEmbed()
                .setTitle(
                    `✅   ${!user.length ? 'New Submission!!' : 'Replaced hosted-url (submission)'}`
                )
                .setThumbnail(message.author.avatarURL() || message.author.displayAvatarURL())
                .setColor(colors.green)
                .addField('User', `<@!${message.author.id}>`, true)
                .addField('\u200b', '\u200b')
                .addField(
                    'Project',
                    `${projectNames[+projectNum.slice(projectNum.length - 1) - 1]}`,
                    true
                )
                .addField('Project link', `[Go to project](${args})`, true);

            if (!user.length) {
                await sheet.addRow({
                    discordId: message.author.id,
                    discordTag: message.author.tag,
                    [`${projectNum}`]: args,
                });
                submissionChannelAsync(message, submissionEmbed);
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
                        `<@!${message.author.id}>, You've already submitted ${projectNum}\n\nIf you wish to replace the existing project URL, use the command \`/nc ${flag}R ${args}\``
                    );
                    return 'true';
                }

                // updating the row
                rows[user[0].rowIndex - 2][`${projectNum}`] = `${args}`;
                // saving the updated row
                await rows[user[0].rowIndex - 2].save();
                submissionChannelAsync(message, submissionEmbed);
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
    submitReview: async (message, args, doc) => {
        let mentionedUser;
        if (!message.mentions.users.size)
            return submissionChannelAsync(
                message,
                `<@!${message.author.id}>, please **@tag** a valid user to submit the review`
            );

        mentionedUser = message.mentions.users.first();
        // *console.log
        console.log('pure args', args);
        args = args.filter((arg) => arg !== '');
        // *console.log
        console.log(`Review args: ${args}`);
        let projectName = args[0];

        switch (projectName) {
            case '-rp1':
                reviewCount = processReview(message, mentionedUser, cliChecklist, args[2]);
                break;

            case '-rp2':
                reviewCount = processReview(message, mentionedUser, portfolioChecklist, args[2]);
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp3':
                reviewCount = processReview(message, mentionedUser, portfolioChecklist, args[2]);
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp4':
                reviewCount = processReview(message, mentionedUser, portfolioChecklist, args[2]);
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp5':
                reviewCount = processReview(message, mentionedUser, portfolioChecklist, args[2]);
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp6':
                reviewCount = processReview(message, mentionedUser, portfolioChecklist, args[2]);
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp7':
                reviewCount = processReview(message, mentionedUser, portfolioChecklist, args[2]);
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp8':
                reviewCount = processReview(message, mentionedUser, portfolioChecklist, args[2]);
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp9':
                reviewCount = processReview(message, mentionedUser, portfolioChecklist, args[2]);
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp10':
                reviewCount = processReview(message, mentionedUser, portfolioChecklist, args[2]);
                break;

            default:
                // ! This has to be the neogcampPrivateChannel
                botChannelAsync(
                    message,
                    `<@!${message.author.id}>, Please pass valid **flags**\nFor example: \`-rp1\` for project 1, \`-rp2\` for project 2 and so on`
                );
                break;
        }
    },
};
