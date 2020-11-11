const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { colors, submissionChannel } = require('../json/config.json');
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

const getByDiscordTag = (rows, tag) => {
    const user = rows.filter((row) => {
        return row.discordTag === tag;
    });
    return user;
};

const getValidProjects = (submission) => {
    let validProjects = [];
    for (let i = 1; i <= 10; i++) {
        validProjects = [
            ...validProjects,
            { name: `project${i}`, link: submission[`project${i}`] },
        ];
    }
    return validProjects;
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

const processReview = async (
    message,
    projectNum,
    mentionedUser,
    checklist,
    args,
    submissionRows,
    reviewSheet
) => {
    let reviewParam;
    let reviewCount = 0;
    reviewParam = formatReviewParam(checklist.length, args);
    console.log('ReviewParam: ', reviewParam);
    const reviewRows = await reviewSheet.getRows();
    const submissionRecord = getByDiscordTag(submissionRows, `${mentionedUser.tag}`);
    const user = getByDiscordTag(reviewRows, `${mentionedUser.tag}`);
    // Updating the reviewCount to see if the project satisfies the checklist
    // If yes then this submittion is counted a valid project submission against NeogCamp eligibility
    reviewParam.split('').forEach((arg) => {
        if (+arg >= 1) {
            reviewCount += 1;
        }
    });

    // This is to check if the project<num> does have a URl and can be proceeded for review
    if (
        submissionRecord.length <= 0 ||
        submissionRecord[0][`${projectNum}`] === undefined ||
        submissionRecord[0][`${projectNum}`].length <= 0
    )
        return botChannelAsync(
            message,
            `<@!${message.author.id}>, There is no project URL for ${projectNum}, you can't review it`
        );

    if (reviewCount === checklist.length) {
        if (!user.length) {
            await reviewSheet.addRow({
                discordId: mentionedUser.id,
                discordTag: `${mentionedUser.username}#${mentionedUser.discriminator}`,
                totalProjectsReviewed: 1,
                projectsReviewed: `${projectNum}`,
                lastUpdatedOn: new Date(),
            });
        } else {
            // This piece of code checks if this project of a user has already been reviewed or not
            if (user[0].projectsReviewed.includes(`${projectNum}`))
                return botChannelAsync(
                    message,
                    `<@!${message.author.id}>, ${projectNum} has been reviewed previously`
                );

            // updating the row
            reviewRows[user[0].rowIndex - 2].totalProjectsReviewed =
                +reviewRows[user[0].rowIndex - 2].totalProjectsReviewed + 1;
            reviewRows[user[0].rowIndex - 2].lastUpdatedOn = new Date();
            reviewRows[user[0].rowIndex - 2].projectsReviewed = `${
                reviewRows[user[0].rowIndex - 2].projectsReviewed
            }, ${projectNum}`;
            // saving the updated row
            await reviewRows[user[0].rowIndex - 2].save();
        }
    }
    return botChannelAsync(
        message,
        `<@!${mentionedUser.id}>, your latest submission has been reviewed\n\n${reviewParam
            .split('')
            .map((arg, index) => {
                return `${+arg >= 1 ? '✅    ' : '❌    '}${checklist[index]}`;
            })
            .join('\n\n')}\n\n${
            reviewCount === checklist.length
                ? `🥳   **You're ${
                      10 -
                      (!user.length ? 1 : reviewRows[user[0].rowIndex - 2].totalProjectsReviewed)
                  } project away from qualifying for NeogCamp level 1**`
                : `**Please integrate the functionalities marked with ❌ and re-submit the project.**\n\nYou may use the command \`/nc -rsp<project-num>\`.\n**For example:** \`/nc -rsp1\` for re-submitting \`project 1\`, \`/nc -rsp2\` for re-submitting \`project 2\` and so on.`
        }`
    );
};

module.exports = {
    getByDiscordTag,
    recordSubmissions: async (
        message,
        args,
        projectNum,
        submissionRows,
        reviewRows,
        flag,
        sheet
    ) => {
        try {
            let user = getByDiscordTag(submissionRows, message.author.tag);
            let reviewRecord = getByDiscordTag(reviewRows, message.author.tag);
            const regexURLValidation = ((message, url) => {
                let regex = new RegExp(
                    'https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,}'
                );
                if (!url.match(regex)) {
                    botChannelAsync(
                        message,
                        `<@!${message.author.id}>, Please enter a valid URL.\n\n**For example:** \`https://hosted-url.com\` OR \`https://www.hosted-url.com\``
                    );
                    return false;
                }
                return true;
            })(message, args);

            if (!regexURLValidation) {
                return 'false';
            }
            // let user = await getByDiscordTag(rows, args);
            // console.log('User', user);

            let submissionEmbed = new MessageEmbed()
                .setTitle(`✅   New Submission!!`)
                .setThumbnail(message.author.avatarURL() || message.author.displayAvatarURL())
                .setColor(colors.green)
                .addField('User', `<@!${message.author.id}>`, true)
                .addField('\u200b', '\u200b')
                .addField(
                    'Project',
                    `${projectNames[+projectNum.slice(projectNum.length - 1) - 1]}`,
                    true
                )
                .addField('Project link', `[Review project](${args})`, true);

            if (!user.length) {
                // the user array is empty
                await sheet.addRow({
                    discordId: message.author.id,
                    discordTag: message.author.tag,
                    lastUpdatedOn: new Date(),
                    [`${projectNum}`]: args,
                });
                submissionChannelAsync(message, submissionEmbed);
                return true;
            } else {
                const isAvailable =
                    submissionRows[user[0].rowIndex - 2][`${projectNum}`] !== undefined &&
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

                // Check if the project URL that is going to be replaced/edited is reviewed or not
                // If the project is reviewed then the user can't change the hosted URL
                if (
                    reviewRecord.length > 0 &&
                    reviewRecord[0].projectsReviewed.includes(`${projectNum}`)
                ) {
                    botChannelAsync(
                        message,
                        `<@!${message.author.id}>, This project has passed the review and you can't change the hosted URL for it anymore.\n\nIn case your reason falls under any of the below reasons then you can tag **@OG Admins** to look into it:\n\n1. You messed up deployment and redeployed with another domain\n2. Added a custom domain\n3. Generated new credentials/app for deployment (firebase)`
                    );
                    return 'false';
                }
                // updating the row
                submissionRows[user[0].rowIndex - 2][`${projectNum}`] = `${args}`;
                submissionRows[user[0].rowIndex - 2].lastUpdatedOn = new Date();
                // saving the updated row
                await submissionRows[user[0].rowIndex - 2].save();
                submissionChannelAsync(message, submissionEmbed);
                return true;
            }
        } catch (error) {
            console.log(error);
            botChannelAsync(message, `${error.message}`);
            return false;
        }
    },
    fetchSubmission: async (message, submissionRows, reviewRows) => {
        try {
            let hasMentions = false;
            let messageEmbed;
            if (message.mentions.users.size) hasMentions = true;

            const mentionedUser = hasMentions ? message.mentions.users.first() : message.author;
            let fetchedSubmission = [];

            // fetching the row that matches the discordTag
            fetchedSubmission = submissionRows.filter(
                (row) =>
                    row.discordTag === `${mentionedUser.username}#${mentionedUser.discriminator}`
            );

            // fetching the row that matches the discordTag
            fetchedReview = reviewRows.filter(
                (row) =>
                    row.discordTag === `${mentionedUser.username}#${mentionedUser.discriminator}`
            );

            if (fetchedSubmission.length) {
                // Constructing a common message embed for both cases
                messageEmbed = new MessageEmbed()
                    .setTitle('✅   Submission Details')
                    .setThumbnail(mentionedUser.avatarURL() || mentionedUser.displayAvatarURL())
                    .setColor(colors.green)
                    .addField('Fetched user', `<@!${mentionedUser.id}>`, true)
                    .addField(
                        'Github Profile',
                        `${
                            fetchedSubmission[0].githubUsername !== undefined
                                ? `[${fetchedSubmission[0].githubUsername}](https://github.com/${fetchedSubmission[0].githubUsername})`
                                : 'No profile linked'
                        }`,
                        true
                    )
                    .addField(
                        'Total projects reviewed',
                        `${
                            fetchedReview.length > 0
                                ? `${fetchedReview[0].totalProjectsReviewed}`
                                : 'No projects reviewed'
                        }`,
                        true
                    )
                    .addField('\u200b', '\u200b')
                    .addField(
                        'Project links',
                        `${getValidProjects(fetchedSubmission[0])
                            .filter((validProject) => {
                                if (validProject.link === undefined) return;
                                if (validProject.link.length > 0) {
                                    return validProject;
                                }
                            })
                            .map(
                                (project) =>
                                    `[${
                                        projectNames[
                                            +project.name.slice(project.name.length - 1) - 1
                                        ]
                                    }](${project.link})`
                            )
                            .join(', ')}`,
                        true
                    )
                    .addField(
                        'Last submitted on',
                        `${
                            fetchedSubmission.length > 0
                                ? fetchedSubmission[0].lastUpdatedOn !== undefined
                                    ? `${moment(fetchedSubmission[0].lastUpdatedOn).format(
                                          'Do MMM YYYY hh:mm A'
                                      )}`
                                    : 'No submissions'
                                : 'No submissions'
                        }`,
                        true
                    )
                    .addField(
                        'Last reviewed on',
                        `${
                            fetchedReview.length > 0
                                ? fetchedReview[0].lastUpdatedOn !== undefined
                                    ? `${moment(fetchedReview[0].lastUpdatedOn).format(
                                          'Do MMM YYYY hh:mm A'
                                      )}`
                                    : 'No reviews'
                                : 'No reviews'
                        }`,
                        true
                    );
            } else {
                botChannelAsync(
                    message,
                    `<@!${message.author.id}>, There is no entry ${
                        hasMentions
                            ? 'for the mentioned user'
                            : 'on your name.\n\nYou can make a your first submission with the `/nc -sp<n> <hosted-url>` command. **For example:** `/nc -sp1 https://hosted-url.com` for submitting **project 1**, `/nc -sp2 https://hosted-url.com` for **project 2** and so on'
                    }`
                );
            }

            botChannelAsync(message, messageEmbed);
        } catch (error) {
            console.error(error);
            botChannelAsync(message, error.message);
        }
    },
    submitReview: async (message, args, submissionRows, reviewSheet) => {
        let mentionedUser;
        if (!message.mentions.users.size)
            return submissionChannelAsync(
                message,
                `<@!${message.author.id}>, please **@tag** a valid user to submit the review`
            );

        mentionedUser = message.mentions.users.first();
        if (mentionedUser.id === message.author.id) {
            return submissionChannelAsync(
                message,
                `<@!${message.author.id}>, You can't review your own project`
            );
        }
        // *console.log
        console.log('pure args', args);
        args = args.filter((arg) => arg !== '');
        // *console.log
        console.log(`Review args: ${args}`);
        let projectName = args[0];

        switch (projectName) {
            case '-rp1':
                reviewCount = processReview(
                    message,
                    'project1',
                    mentionedUser,
                    cliChecklist,
                    args[2],
                    submissionRows,
                    reviewSheet
                );
                break;

            case '-rp2':
                reviewCount = processReview(
                    message,
                    'project2',
                    mentionedUser,
                    portfolioChecklist,
                    args[2],
                    submissionRows,
                    reviewSheet
                );
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp3':
                reviewCount = processReview(
                    message,
                    'project3',
                    mentionedUser,
                    portfolioChecklist,
                    args[2],
                    submissionRows,
                    reviewSheet
                );
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp4':
                reviewCount = processReview(
                    message,
                    'project4',
                    mentionedUser,
                    portfolioChecklist,
                    args[2],
                    submissionRows,
                    reviewSheet
                );
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp5':
                reviewCount = processReview(
                    message,
                    'project5',
                    mentionedUser,
                    portfolioChecklist,
                    args[2],
                    submissionRows,
                    reviewSheet
                );
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp6':
                reviewCount = processReview(
                    message,
                    'project6',
                    mentionedUser,
                    portfolioChecklist,
                    args[2],
                    submissionRows,
                    reviewSheet
                );
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp7':
                reviewCount = processReview(
                    message,
                    'project7',
                    mentionedUser,
                    portfolioChecklist,
                    args[2],
                    submissionRows,
                    reviewSheet
                );
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp8':
                reviewCount = processReview(
                    message,
                    'project8',
                    mentionedUser,
                    portfolioChecklist,
                    args[2],
                    submissionRows,
                    reviewSheet
                );
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp9':
                reviewCount = processReview(
                    message,
                    'project9',
                    mentionedUser,
                    portfolioChecklist,
                    args[2],
                    submissionRows,
                    reviewSheet
                );
                break;
            // !Update the checklist parameter to appropriate project checklists
            case '-rp10':
                reviewCount = processReview(
                    message,
                    'project10',
                    mentionedUser,
                    portfolioChecklist,
                    args[2],
                    submissionRows,
                    reviewSheet
                );
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
