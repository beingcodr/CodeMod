const { MessageEmbed } = require('discord.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { colors } = require('../json/config.json');
const { deleteMessage, messageErrorAsync, botChannelAsync } = require('../helpers/message');
const {
    fetchSubmission,
    submitReview,
    recordSubmissions,
    getByDiscordTag,
    fetchChecklist,
    cliChecklist,
    resubmission,
} = require('../helpers/sheet');

module.exports = {
    name: 'neogcamp',
    description: 'This command lets you submit your projects for review',
    guildOnly: true,
    aliases: ['NC', 'nc', 'codecamp'],
    usage: '-s <URL-to-your-hosted-project>',
    execute: async (message, args) => {
        deleteMessage(message, 0);
        console.log('Args: ', args);

        try {
            if (message.guild.member(message.author)) {
                const doc = new GoogleSpreadsheet('1NRIpnhKhkzQByutTASg9O8lSKd9dQuJoWv9vM7WbpSM');
                await doc.useServiceAccountAuth({
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY,
                });

                await doc.loadInfo(); // loads document properties and worksheets

                // Getting the first sheet in the order on the Google sheets UI
                const submissionSheet = doc.sheetsByTitle['Submissions'];
                let reviewSheet = doc.sheetsByTitle['Reviewed'];
                if (reviewSheet === undefined)
                    reviewSheet = await doc.addSheet({
                        title: 'Reviewed',
                        headerValues: [
                            'discordId',
                            'discordTag',
                            'totalProjectsReviewed',
                            'lastUpdatedOn',
                            'projectsReviewed',
                        ],
                    });
                // filters out the spaces and flags from the args
                const refinedArgs = args.filter((arg) => arg !== '');

                // Collects the flags from the args
                const flags = args.filter((arg) => arg.includes('-') && arg.length <= 5);
                //* console.log('Refined args: ', refinedArgs);
                //* console.log('Flags: ', flags);
                const submissionRows = await submissionSheet.getRows();
                const reviewRows = await reviewSheet.getRows();
                // * rows.forEach((row) => console.log(row.rowIndex));

                if (!flags.length || flags === undefined || flags === null) {
                    let neogEmbed = new MessageEmbed()
                        .setTitle('✅   NeoGCamp Links')
                        // .setThumbnail(mentionedUser.avatarURL() || mentionedUser.displayAvatarURL())
                        .setColor(colors.green)
                        .addField(
                            'neogcamp Official site',
                            '[neog.camp](https://neog.camp/handbook/home)',
                            true
                        )
                        .addField(
                            'Live session guides',
                            '[Lesson 1](https://neog.camp/guide/lesson-one)',
                            true
                        )
                        .addField(
                            'Upcoming live sessions',
                            '[See the schedule](http://bit.ly/levelZero)'
                        );
                    return botChannelAsync(message, neogEmbed);
                }

                flags.forEach(async (flag) => {
                    const inputIndex = +refinedArgs.indexOf(flag) + 1;
                    let isSuccessful = false;
                    switch (flag) {
                        case '-sp1':
                        case '-sp1R':
                        case '-sp2':
                        case '-sp2R':
                            // case '-sp3':
                            // case '-sp3R':
                            // case '-sp4':
                            // case '-sp4R':
                            // case '-sp5':
                            // case '-sp5R':
                            // case '-sp6':
                            // case '-sp6R':
                            // case '-sb1':
                            // case '-sb1R':
                            // case '-sb2':
                            // case '-sb2R':
                            // case '-sb3':
                            // case '-sb3R':
                            if (flag === '-sp1' || flag === '-sp1R') {
                                isSuccessful = await recordSubmissions(
                                    message,
                                    refinedArgs[inputIndex],
                                    'project1',
                                    submissionRows,
                                    reviewRows,
                                    flag,
                                    submissionSheet
                                );
                            } else if (flag === '-sp2' || flag === '-sp2R') {
                                isSuccessful = await recordSubmissions(
                                    message,
                                    refinedArgs[inputIndex],
                                    'project2',
                                    submissionRows,
                                    reviewRows,
                                    flag,
                                    submissionSheet
                                );
                            }
                            // else if (flag === '-sp3' || flag === '-sp3R') {
                            //     isSuccessful = await recordSubmissions(
                            //         message,
                            //         refinedArgs[inputIndex],
                            //         'project3',
                            //         submissionRows,
                            //         reviewRows,
                            //         flag,
                            //         submissionSheet
                            //     );
                            // } else if (flag === '-sp4' || flag === '-sp4R') {
                            //     isSuccessful = await recordSubmissions(
                            //         message,
                            //         refinedArgs[inputIndex],
                            //         'project4',
                            //         submissionRows,
                            //         reviewRows,
                            //         flag,
                            //         submissionSheet
                            //     );
                            // } else if (flag === '-sp5' || flag === '-sp5R') {
                            //     isSuccessful = await recordSubmissions(
                            //         message,
                            //         refinedArgs[inputIndex],
                            //         'project5',
                            //         submissionRows,
                            //         reviewRows,
                            //         flag,
                            //         submissionSheet
                            //     );
                            // } else if (flag === '-sp6' || flag === '-sp6R') {
                            //     isSuccessful = await recordSubmissions(
                            //         message,
                            //         refinedArgs[inputIndex],
                            //         'project6',
                            //         submissionRows,
                            //         reviewRows,
                            //         flag,
                            //         submissionSheet
                            //     );
                            // } else if (flag === '-sb1' || flag === '-sb1R') {
                            //     isSuccessful = await recordSubmissions(
                            //         message,
                            //         refinedArgs[inputIndex],
                            //         'blog1',
                            //         submissionRows,
                            //         reviewRows,
                            //         flag,
                            //         submissionSheet
                            //     );
                            // } else if (flag === '-sb2' || flag === '-sb2R') {
                            //     isSuccessful = await recordSubmissions(
                            //         message,
                            //         refinedArgs[inputIndex],
                            //         'blog2',
                            //         submissionRows,
                            //         reviewRows,
                            //         flag,
                            //         submissionSheet
                            //     );
                            // } else if (flag === '-sb3' || flag === '-sb3R') {
                            //     isSuccessful = await recordSubmissions(
                            //         message,
                            //         refinedArgs[inputIndex],
                            //         'blog3',
                            //         submissionRows,
                            //         reviewRows,
                            //         flag,
                            //         submissionSheet
                            //     );
                            // }

                            // This is final message for submission status
                            if (typeof isSuccessful !== 'string')
                                botChannelAsync(
                                    message,
                                    `${!isSuccessful ? '❗' : ''}<@!${message.author.id}>,  ${
                                        isSuccessful
                                            ? "Thank you for your submission, we're reviewing it. Look out for your role upgrade soon!"
                                            : `Your submission was not recorded.\n\nPlease try again later, if the problem still persists tag **@OG Admins** for further assistance`
                                    }`
                                );
                            break;

                        case '-gh':
                            let regex = new RegExp(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i);
                            if (!refinedArgs[1].match(regex)) {
                                botChannelAsync(
                                    message,
                                    `<@!${message.author.id}>, \`${refinedArgs[1]}\` is an invalid Github username\n\n**Username may only contain:**\n1. Alphanumeric characters or single hyphens\n2. Cannot begin or end with a hyphen\n3. Cannot have more than one consecutive hypens\n4. Total number of characters can be no more than 39 characters`
                                );
                                isSuccessful = 'false';
                            }

                            if (typeof isSuccessful !== 'string') {
                                const submissionRecord = getByDiscordTag(
                                    submissionRows,
                                    message.author.tag
                                );

                                if (!submissionRecord.length) {
                                    // the submissionRecord array is empty
                                    await submissionSheet.addRow({
                                        discordId: message.author.id,
                                        discordTag: message.author.tag,
                                        lastUpdatedOn: new Date(),
                                        githubUsername: refinedArgs[1],
                                    });
                                } else {
                                    submissionRows[
                                        submissionRecord[0].rowIndex - 2
                                    ].githubUsername = `${refinedArgs[1]}`;
                                    submissionRows[
                                        submissionRecord[0].rowIndex - 2
                                    ].lastUpdatedOn = new Date();

                                    await submissionRows[submissionRecord[0].rowIndex - 2].save();
                                }
                                isSuccessful = true;
                            }

                            if (typeof isSuccessful !== 'string')
                                // This is final message for submission status
                                botChannelAsync(
                                    message,
                                    `${!isSuccessful ? '❗' : ''}<@!${message.author.id}>, ${
                                        isSuccessful
                                            ? 'Your Github username is updated!'
                                            : `Your Github username was not updated.\n\nPlease try again later, if the problem still persists tag **@OG Admin** for further assistance`
                                    }`
                                );
                            break;

                        case '-pf':
                        case '-pfR':
                            if (flag === '-pf' || flag === '-pfR') {
                                isSuccessful = await recordSubmissions(
                                    message,
                                    refinedArgs[inputIndex],
                                    'portfolioUrl',
                                    submissionRows,
                                    reviewRows,
                                    flag,
                                    submissionSheet
                                );
                            }

                            // This is final message for submission status
                            if (typeof isSuccessful !== 'string')
                                botChannelAsync(
                                    message,
                                    `${!isSuccessful ? '❗' : ''}<@!${message.author.id}>, ${
                                        isSuccessful
                                            ? 'Your portfolio link is updated!'
                                            : `Your portfolio link was not updated.\n\nPlease try again later, if the problem still persists tag **@OG Admin** for further assistance`
                                    }`
                                );
                            break;

                        // case '-as':
                        //     if (
                        //         !message.guild.member(message.author).hasPermission('ADMINISTRATOR')
                        //     )
                        //         return botChannelAsync(
                        //             message,
                        //             `<@!${message.author.id}>, Only admins can add sheets to Google Spreadsheet`
                        //         );

                        //     if (refinedArgs.length > 2) {
                        //         await doc.addSheet({
                        //             title: refinedArgs[inputIndex],
                        //             headerValues: [...refinedArgs.slice(2).join('').split(',')],
                        //         });
                        //     } else {
                        //         await doc.addSheet({
                        //             title: refinedArgs[inputIndex],
                        //         });
                        //     }
                        //     break;

                        case '-rp1':
                        case '-rp2':
                            // case '-rp3':
                            // case '-rp4':
                            // case '-rp5':
                            // case '-rp6':
                            // case '-rp7':
                            // case '-rp8':
                            // case '-rp9':
                            if (
                                !message.guild.member(message.author).hasPermission('ADMINISTRATOR')
                            )
                                return botChannelAsync(
                                    message,
                                    `<@!${message.author.id}>, Only admins can review projects`
                                );

                            await submitReview(message, refinedArgs, submissionRows, reviewSheet);
                            break;

                        case '-fs':
                            await fetchSubmission(message, submissionRows, reviewRows);
                            break;

                        // !Update the checklist
                        case '-fcl1':
                        case '-fcl2':
                            // case '-fcl3':
                            // case '-fcl4':
                            // case '-fcl5':
                            // case '-fcl6':
                            // case '-fcl7':
                            // case '-fcl8':
                            // case '-fcl9':
                            if (flag === '-fcl1') fetchChecklist(message, 'project1', cliChecklist);
                            if (flag === '-fcl2') fetchChecklist(message, 'project2', cliChecklist);
                            // if (flag === '-fcl3') fetchChecklist(message, 'project3', cliChecklist);
                            // if (flag === '-fcl4') fetchChecklist(message, 'project4', cliChecklist);
                            // if (flag === '-fcl5') fetchChecklist(message, 'project5', cliChecklist);
                            // if (flag === '-fcl6') fetchChecklist(message, 'project6', cliChecklist);
                            // if (flag === '-fcl7') fetchChecklist(message, 'project7', cliChecklist);
                            // if (flag === '-fcl8') fetchChecklist(message, 'project8', cliChecklist);
                            // if (flag === '-fcl9') fetchChecklist(message, 'project9', cliChecklist);
                            break;

                        case '-rsp1':
                        case '-rsp2':
                            // case '-rsp3':
                            // case '-rsp4':
                            // case '-rsp5':
                            // case '-rsp6':
                            // case '-rsp7':
                            // case '-rsp8':
                            // case '-rsp9':
                            if (flag === '-rsp1') resubmission(message, 'project1', submissionRows);
                            if (flag === '-rsp2') resubmission(message, 'project2', submissionRows);
                            // if (flag === '-rsp3') resubmission(message, 'project3', submissionRows);
                            // if (flag === '-rsp4') resubmission(message, 'project4', submissionRows);
                            // if (flag === '-rsp5') resubmission(message, 'project5', submissionRows);
                            // if (flag === '-rsp6') resubmission(message, 'project6', submissionRows);
                            // if (flag === '-rsp7') resubmission(message, 'project7', submissionRows);
                            // if (flag === '-rsp8') resubmission(message, 'project8', submissionRows);
                            // if (flag === '-rsp9') resubmission(message, 'project9', submissionRows);
                            break;

                        default:
                            return botChannelAsync(
                                message,
                                `<@!${message.author.id}>, \`${flag}\` is not a valid flag or is not enabled for use at this moment. Read the docs to know about all the valid flags`
                            );
                    }
                });
            } else {
                return messageErrorAsync(
                    message,
                    "Something isn't right, DM <@!487310051393011713> to manually add you to the DB",
                    `<@!${message.author.id}>, **something isn't right, DM <@!487310051393011713> to manually add you to the DB**`
                );
            }
        } catch (error) {
            console.log(error);
            return botChannelAsync(
                message,
                `<@!${message.author.id}>, Error occured in \`/neogcamp\` command:\t${error.message}`
            );
        }
    },
};
