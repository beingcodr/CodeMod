const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const addRole = require('../commands/addRole');
const removeRole = require('../commands/removeRole');
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
    'CLI_QUIZ LIVE',
    'CUSTOM CLI_QUIZ',
    'HOSTING YOUR SITE',
    'ADDING DETAILS TO YOUR PORTFOLIO LIVE',
    'ADDING BLOG TO YOUR PORTFOLIO',
    'VANILLA JS TRANSLATOR LIVE',
    'CUSTOM TRANSLATOR APP',
    'FIRST REACT APP',
    'REACT QUIZ APP',
];

const getByDiscordTag = (rows, tag) => {
    const user = rows.filter((row) => {
        return row.discordTag === tag;
    });
    return user;
};

const getValidProjects = (submission) => {
    let validProjects = [];
    for (let i = 1; i <= 9; i++) {
        if (submission[`project${i}`] !== undefined && submission[`project${i}`].length > 0)
            validProjects = [
                ...validProjects,
                { name: `project${i}`, link: submission[`project${i}`] },
            ];
    }
    return validProjects;
};

const getValidBlogs = (submission) => {
    let validBlogs = [];
    for (let i = 1; i <= 3; i++) {
        if (submission[`blog${i}`] !== undefined && submission[`blog${i}`].length > 0)
            validBlogs = [...validBlogs, { name: `Blog ${i}`, link: submission[`blog${i}`] }];
    }
    return validBlogs;
};

const formatReviewParam = (checklistLength, reviewParam) => {
    if (checklistLength !== reviewParam.length) {
        if (reviewParam.length < checklistLength) {
            return reviewParam.padEnd(checklistLength, '0');
        } else if (reviewParam.length > checklistLength) {
            return reviewParam.substring(0, checklistLength);
        }
    } else {
        return reviewParam;
    }
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
    const reviewRecord = getByDiscordTag(reviewRows, `${mentionedUser.tag}`);
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
        return submissionChannelAsync(
            message,
            `<@!${message.author.id}>, There is no project URL for ${projectNum}, you can't review it`
        );

    if (reviewCount === checklist.length) {
        if (!reviewRecord.length) {
            await reviewSheet.addRow({
                discordId: mentionedUser.id,
                discordTag: `${mentionedUser.username}#${mentionedUser.discriminator}`,
                totalProjectsReviewed: 1,
                projectsReviewed: `${projectNum}`,
                lastUpdatedOn: new Date(),
            });
        } else {
            // This piece of code checks if this project of a user has already been reviewed or not
            if (
                reviewRecord[0].projectsReviewed !== undefined &&
                reviewRecord[0].projectsReviewed.includes(`${projectNum}`)
            )
                return submissionChannelAsync(
                    message,
                    `<@!${message.author.id}>, ${projectNum} has been reviewed previously`
                );

            // updating the row
            reviewRows[reviewRecord[0].rowIndex - 2].totalProjectsReviewed =
                +reviewRows[reviewRecord[0].rowIndex - 2].totalProjectsReviewed + 1;
            reviewRows[reviewRecord[0].rowIndex - 2].lastUpdatedOn = new Date();
            reviewRows[reviewRecord[0].rowIndex - 2].projectsReviewed = `${
                reviewRows[reviewRecord[0].rowIndex - 2].projectsReviewed === undefined
                    ? ''
                    : `${reviewRows[reviewRecord[0].rowIndex - 2].projectsReviewed}, `
            }${projectNum}`;
            // saving the updated row
            await reviewRows[reviewRecord[0].rowIndex - 2].save();
        }

        addNeoGCampRole(
            message,
            !reviewRecord.length
                ? 1
                : +reviewRows[reviewRecord[0].rowIndex - 2].totalProjectsReviewed
        );
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
                      9 -
                      (!reviewRecord.length
                          ? 1
                          : reviewRows[reviewRecord[0].rowIndex - 2].totalProjectsReviewed)
                  } project away from qualifying for NeogCamp level 1**\n\nIn case your role wasn't upgraded to the next level. Feel free to tag **@OG Admins**`
                : `**Please integrate the functionalities marked with ❌ and re-submit the project.**\n\nYou may use the command \`/nc -rsp<project-num>\`.\n**For example:** \`/nc -rsp1\` for re-submitting \`project 1\`, \`/nc -rsp2\` for re-submitting \`project 2\` and so on.`
        }`
    );
};

const addNeoGCampRole = (message, totalProjectsReviewed) => {
    const roles = [
        'markOne',
        'markTwo',
        'markThree',
        'markFour',
        'markFive',
        'markSix',
        'markSeven',
        'markEight',
        'markNine',
    ];

    let addRoleArgs =
        totalProjectsReviewed === 1
            ? ['', 'markOne']
            : totalProjectsReviewed === 2
            ? ['', 'markTwo']
            : totalProjectsReviewed === 3
            ? ['', 'markThree']
            : totalProjectsReviewed === 4
            ? ['', 'markFour']
            : totalProjectsReviewed === 5
            ? ['', 'markFive']
            : totalProjectsReviewed === 6
            ? ['', 'markSix']
            : totalProjectsReviewed === 7
            ? ['', 'markSeven']
            : totalProjectsReviewed === 8
            ? ['', 'markEight']
            : totalProjectsReviewed === 9
            ? ['', 'markNine']
            : null;
    let removeRoleArgs =
        totalProjectsReviewed === 1
            ? ['', '']
            : totalProjectsReviewed === 2
            ? ['', 'markOne']
            : totalProjectsReviewed === 3
            ? ['', 'markTwo']
            : totalProjectsReviewed === 4
            ? ['', 'markThree']
            : totalProjectsReviewed === 5
            ? ['', 'markFour']
            : totalProjectsReviewed === 6
            ? ['', 'markFive']
            : totalProjectsReviewed === 7
            ? ['', 'markSix']
            : totalProjectsReviewed === 8
            ? ['', 'markSeven']
            : totalProjectsReviewed === 9
            ? ['', 'markEight']
            : null;

    switch (totalProjectsReviewed) {
        case 1:
        case 2:
            if (totalProjectsReviewed > 1) removeRole.execute(message, removeRoleArgs);
            addRole.execute(message, addRoleArgs);
            break;

        default:
            submissionChannelAsync(
                message,
                `<@!${
                    message.author.id
                }>, The value \`totalProjectsReviewed\` looks sketchy, please take a look at the [Google doc](https://docs.google.com/spreadsheets/d/1NRIpnhKhkzQByutTASg9O8lSKd9dQuJoWv9vM7WbpSM/) (**Reviewed** sheet) for **${
                    message.mentions.users.first().tag
                }**. I was not able to assign/remove a role for <@!${
                    message.mentions.users.first().id
                }>`
            );
            break;
    }
};

module.exports = {
    cliChecklist,
    portfolioChecklist,
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
            let submissionRecord = getByDiscordTag(submissionRows, message.author.tag);
            let reviewRecord = getByDiscordTag(reviewRows, message.author.tag);
            if (args === undefined) {
                botChannelAsync(
                    message,
                    `<@!${message.author.id}>, No URL was found. Please pass in your projects' hosted URL`
                );
                return 'false';
            }
            const regexURLValidation = ((message, url) => {
                let regex = new RegExp(
                    'https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,}'
                );
                if (!url.match(regex)) {
                    botChannelAsync(
                        message,
                        `<@!${message.author.id}>, Please enter a valid URL.\n\n**For example:** \`http://hosted-url.com\` OR \`https://www.hosted-url.com\``
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
                    `${projectNum}`,
                    `${projectNames[+projectNum.slice(projectNum.length - 1) - 1]}`,
                    true
                )
                .addField(`Project link`, `[Review project](${args})`, true);

            if (!submissionRecord.length) {
                // the user array is empty
                await sheet.addRow({
                    discordId: message.author.id,
                    discordTag: message.author.tag,
                    lastUpdatedOn: new Date(),
                    [`${projectNum}`]: args,
                });
                if (projectNum !== 'portfolioUrl') submissionChannelAsync(message, submissionEmbed);
                return true;
            } else {
                const isAvailable =
                    submissionRows[submissionRecord[0].rowIndex - 2][`${projectNum}`].length > 0 &&
                    flag
                        .split('')
                        .slice(flag.length - 1)
                        .join('') !== 'R'
                        ? true
                        : false;

                if (isAvailable) {
                    botChannelAsync(
                        message,
                        `<@!${message.author.id}>, You've already submitted ${projectNum}\n\nIf you wish to replace the existing project URL, use the command \`/nc ${flag}R https://hosted-url.com\``
                    );
                    return 'true';
                }

                // Check if the project URL that is going to be replaced/edited is reviewed or not
                // If the project is reviewed then the user can't change the hosted URL
                if (
                    reviewRecord.length > 0 &&
                    reviewRecord[0].projectsReviewed !== undefined &&
                    reviewRecord[0].projectsReviewed.includes(`${projectNum}`)
                ) {
                    botChannelAsync(
                        message,
                        `<@!${message.author.id}>, This project has passed the review and you can't change the hosted URL for it anymore.\n\nIn case your reason falls under any of the below reasons then you can tag **@OG Admins** to look into it:\n\n1. You messed up deployment and redeployed with another domain\n2. Added a custom domain\n3. Generated new credentials/app for deployment (firebase)\n\n> _**Note:** If you still wish to change the URL do keep in mind that the project will be flagged for the review process again_`
                    );
                    return 'false';
                }
                // updating the row
                submissionRows[submissionRecord[0].rowIndex - 2][`${projectNum}`] = `${args}`;
                submissionRows[submissionRecord[0].rowIndex - 2].lastUpdatedOn = new Date();
                // saving the updated row
                await submissionRows[submissionRecord[0].rowIndex - 2].save();
                if (projectNum !== 'portfolioUrl') submissionChannelAsync(message, submissionEmbed);
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
                // const validBlogs = getValidBlogs(fetchedSubmission[0]);
                const validProjects = getValidProjects(fetchedSubmission[0]);
                console.log(validProjects);
                // Constructing a common message embed for both cases
                messageEmbed = new MessageEmbed()
                    .setTitle('✅   Submission Details')
                    .setThumbnail(mentionedUser.avatarURL() || mentionedUser.displayAvatarURL())
                    .setColor(colors.green)
                    .addField('Fetched user', `<@!${mentionedUser.id}>`, true)
                    .addField(
                        'Github Profile',
                        `${
                            fetchedSubmission[0].githubUsername.length > 0
                                ? `[${fetchedSubmission[0].githubUsername}](https://github.com/${fetchedSubmission[0].githubUsername})`
                                : 'No profile linked'
                        }`,
                        true
                    )
                    .addField(
                        'Portfolio',
                        `${
                            fetchedSubmission[0].portfolioUrl.length > 0
                                ? `[${fetchedSubmission[0].portfolioUrl}](${fetchedSubmission[0].portfolioUrl})`
                                : 'No portfolio linked'
                        }`,
                        true
                    )
                    .addField('\u200b', '\u200b')
                    .addField(
                        'Total projects reviewed',
                        `${
                            fetchedReview.length > 0
                                ? `${fetchedReview[0].totalProjectsReviewed}`
                                : 'No projects reviewed'
                        }`,
                        true
                    )
                    .addField(
                        'Project links',
                        `${
                            validProjects.length > 0
                                ? validProjects
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
                                                      +project.name.slice(project.name.length - 1) -
                                                          1
                                                  ]
                                              }](${project.link})`
                                      )
                                      .join(', ')
                                : 'No projects'
                        }`,
                        true
                    )
                    // .addField(
                    //     'Blog links',
                    //     `${
                    //         validBlogs.length > 0
                    // ? validBlogs
                    //                   .filter((validBlog) => {
                    //                       if (validBlog.link === undefined) return;
                    //                       if (validBlog.link.length > 0) {
                    //                           return validBlog;
                    //                       }
                    //                   })
                    //                   .map((blog) => `[${blog.name}](${blog.link})`)
                    //                   .join(', ')
                    //             : 'No blogs'
                    //     }`,
                    //     true
                    // )
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
                    )
                    .addField('\u200b', '\u200b');
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

        if (args.length === 4 && args[3] !== undefined) {
            console.log('About to delete the review Message');
            const reviewSubmissionEmbed = await message.guild.channels.cache
                .get(process.env.CM_SUBMISSION_CHANNEL || submissionChannel)
                .messages.fetch(args[3]);
            console.log(reviewSubmissionEmbed);
            reviewSubmissionEmbed.delete();
        }

        switch (projectName) {
            case '-rp1':
                await processReview(
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
                await processReview(
                    message,
                    'project2',
                    mentionedUser,
                    cliChecklist,
                    args[2],
                    submissionRows,
                    reviewSheet
                );
                break;
            // !Update the checklist parameter to appropriate project checklists
            // case '-rp3':
            //     await processReview(
            //         message,
            //         'project3',
            //         mentionedUser,
            //         portfolioChecklist,
            //         args[2],
            //         submissionRows,
            //         reviewSheet
            //     );
            //     break;
            // !Update the checklist parameter to appropriate project checklists
            // case '-rp4':
            //     await processReview(
            //         message,
            //         'project4',
            //         mentionedUser,
            //         portfolioChecklist,
            //         args[2],
            //         submissionRows,
            //         reviewSheet
            //     );
            //     break;
            // !Update the checklist parameter to appropriate project checklists
            // case '-rp5':
            //     await processReview(
            //         message,
            //         'project5',
            //         mentionedUser,
            //         portfolioChecklist,
            //         args[2],
            //         submissionRows,
            //         reviewSheet
            //     );
            //     break;
            // !Update the checklist parameter to appropriate project checklists
            // case '-rp6':
            //     await processReview(
            //         message,
            //         'project6',
            //         mentionedUser,
            //         portfolioChecklist,
            //         args[2],
            //         submissionRows,
            //         reviewSheet
            //     );
            //     break;

            default:
                // ! This has to be the neogcampPrivateChannel
                submissionChannelAsync(
                    message,
                    `<@!${message.author.id}>, Please pass valid **flags**\nFor example: \`-rp1\` for project 1, \`-rp2\` for project 2 and so on`
                );
                break;
        }
    },
    fetchChecklist: (message, projectNum, checklist) => {
        submissionChannelAsync(
            message,
            `Here's the checklist for reviewing ${
                projectNames[projectNum.substring(projectNum.length - 1) - 1]
            }:\n\n${checklist.map((item) => `📝    **${item}**\n\n`).join('')}`
        );
    },
    resubmission: (message, projectNum, submissionRows) => {
        const submissionRecord = getByDiscordTag(submissionRows, message.author.tag);

        if (!submissionRecord.length) {
            return botChannelAsync(
                message,
                `<@!${message.author.id}>, You don't have any submissions to resubmit-. Please submit a project with the command \`/nc -sp1 https://hosted-url.com\` for project 1 i.e. CLI app`
            );
        } else {
            if (
                submissionRows[submissionRecord[0].rowIndex - 2][`${projectNum}`] === undefined ||
                submissionRows[submissionRecord[0].rowIndex - 2][`${projectNum}`].length <= 0
            )
                return botChannelAsync(
                    message,
                    `<@!${message.author.id}>, There is no submission for **${
                        projectNames[projectNum.substring(projectNum.length - 1) - 1]
                    }**. Submit the project with the command \`/nc -sp${projectNum.substring(
                        projectNum.length - 1
                    )} https://hosted-url.com\``
                );

            let submissionEmbed = new MessageEmbed()
                .setTitle(`✅   Re-Submission!!`)
                .setThumbnail(message.author.avatarURL() || message.author.displayAvatarURL())
                .setColor(colors.green)
                .addField('User', `<@!${message.author.id}>`, true)
                .addField('\u200b', '\u200b')
                .addField(
                    `${projectNum}`,
                    `${projectNames[+projectNum.slice(projectNum.length - 1) - 1]}`,
                    true
                )
                .addField(
                    `${projectNum.startsWith('p') ? 'Project' : 'Blog'} link`,
                    `[Review ${projectNum.startsWith('p') ? 'project' : 'blog'}](${
                        submissionRows[submissionRecord[0].rowIndex - 2][`${projectNum}`]
                    })`,
                    true
                );

            botChannelAsync(message, `<@!${message.author.id}>, Your re-submission is recorded.`);
            submissionChannelAsync(message, submissionEmbed);
        }
    },
};
