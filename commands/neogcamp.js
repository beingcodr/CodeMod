const { GoogleSpreadsheet } = require('google-spreadsheet');
const { deleteMessage, messageErrorAsync, botChannelAsync } = require('../helpers/message');
const { fetchSubmission, submitReview, recordSubmissions } = require('../helpers/sheet');

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
                // filters out the spaces and flags from the args
                const refinedArgs = args.filter((arg) => arg !== '');

                // Collects the flags from the args
                const flags = args.filter((arg) => arg.includes('-') && arg.length <= 5);
                //* console.log('Refined args: ', refinedArgs);
                //* console.log('Flags: ', flags);
                const rows = await submissionSheet.getRows();
                // * rows.forEach((row) => console.log(row.rowIndex));

                flags.forEach(async (flag) => {
                    const inputIndex = +args.indexOf(flag) + 1;
                    let isSuccessful = false;
                    switch (flag) {
                        case '-sp1':
                        case '-sp1R':
                        case '-sp2':
                        case '-sp2R':
                        case '-sp3':
                        case '-sp3R':
                        case '-sp4':
                        case '-sp4R':
                        case '-sp5':
                        case '-sp5R':
                        case '-sp6':
                        case '-sp6R':
                        case '-sp7':
                        case '-sp7R':
                        case '-sp8':
                        case '-sp8R':
                        case '-sp9':
                        case '-sp9R':
                        case '-sp10':
                        case '-sp10R':
                            if (flag === '-sp1' || flag === '-sp1R') {
                                isSuccessful = await recordSubmissions(
                                    message,
                                    args[inputIndex],
                                    'project1',
                                    rows,
                                    flag,
                                    submissionSheet
                                );
                            } else if (flag === '-sp2' || flag === '-sp2R') {
                                isSuccessful = await recordSubmissions(
                                    message,
                                    args[inputIndex],
                                    'project2',
                                    rows,
                                    flag,
                                    submissionSheet
                                );
                            } else if (flag === '-sp3' || flag === '-sp3R') {
                                isSuccessful = await recordSubmissions(
                                    message,
                                    args[inputIndex],
                                    'project3',
                                    rows,
                                    flag,
                                    submissionSheet
                                );
                            } else if (flag === '-sp4' || flag === '-sp4R') {
                                isSuccessful = await recordSubmissions(
                                    message,
                                    args[inputIndex],
                                    'project4',
                                    rows,
                                    flag,
                                    submissionSheet
                                );
                            } else if (flag === '-sp5' || flag === '-sp5R') {
                                isSuccessful = await recordSubmissions(
                                    message,
                                    args[inputIndex],
                                    'project5',
                                    rows,
                                    flag,
                                    submissionSheet
                                );
                            } else if (flag === '-sp6' || flag === '-sp6R') {
                                isSuccessful = await recordSubmissions(
                                    message,
                                    args[inputIndex],
                                    'project6',
                                    rows,
                                    flag,
                                    submissionSheet
                                );
                            } else if (flag === '-sp7' || flag === '-sp7R') {
                                isSuccessful = await recordSubmissions(
                                    message,
                                    args[inputIndex],
                                    'project7',
                                    rows,
                                    flag,
                                    submissionSheet
                                );
                            } else if (flag === '-sp8' || flag === '-sp8R') {
                                isSuccessful = await recordSubmissions(
                                    message,
                                    args[inputIndex],
                                    'project8',
                                    rows,
                                    flag,
                                    submissionSheet
                                );
                            } else if (flag === '-sp9' || flag === '-sp9R') {
                                isSuccessful = await recordSubmissions(
                                    message,
                                    args[inputIndex],
                                    'project9',
                                    rows,
                                    flag,
                                    submissionSheet
                                );
                            } else if (flag === '-sp10' || flag === '-sp10R') {
                                isSuccessful = await recordSubmissions(
                                    message,
                                    args[inputIndex],
                                    'project10',
                                    rows,
                                    flag,
                                    submissionSheet
                                );
                            }

                            // This is final message for submission status
                            if (typeof isSuccessful !== 'string')
                                botChannelAsync(
                                    message,
                                    `${!isSuccessful ? '❗' : ''}<@!${
                                        message.author.id
                                    }>, Your submission ${
                                        isSuccessful
                                            ? 'has been recorded!'
                                            : `was not recorded.\n\nPlease try again later, if the problem still persists tag **@OG Admin** for further assistance`
                                    }`
                                );
                            break;

                        case '-gh':
                        case '-ghR':
                            if (flag === '-gh' || flag === 'ghR') {
                                isSuccessful = await recordSubmissions(
                                    message,
                                    args[inputIndex],
                                    'githubUsername',
                                    rows,
                                    flag,
                                    submissionSheet
                                );
                            }

                            // This is final message for submission status
                            if (typeof isSuccessful !== 'string')
                                botChannelAsync(
                                    message,
                                    `${!isSuccessful ? '❗' : ''}<@!${
                                        message.author.id
                                    }>, Your submission ${
                                        isSuccessful
                                            ? 'has been recorded!'
                                            : `was not recorded.\n\nPlease try again later, if the problem still persists tag **@OG Admin** for further assistance`
                                    }`
                                );
                            break;

                        case '-as':
                            if (
                                !message.guild.member(message.author).hasPermission('ADMINISTRATOR')
                            )
                                return botChannelAsync(
                                    message,
                                    `<@!${message.author.id}>, Only admins can review projects`
                                );

                            if (args.length > 2) {
                                await doc.addSheet({
                                    title: args[inputIndex],
                                    headerValues: [...args.slice(2).join('').split(',')],
                                });
                            } else {
                                await doc.addSheet({
                                    title: args[inputIndex],
                                });
                            }
                            break;

                        case '-rp1':
                        case '-rp2':
                        case '-rp3':
                        case '-rp4':
                        case '-rp5':
                        case '-rp6':
                        case '-rp7':
                        case '-rp8':
                        case '-rp9':
                        case '-rp10':
                            if (
                                !message.guild.member(message.author).hasPermission('ADMINISTRATOR')
                            )
                                return botChannelAsync(
                                    message,
                                    `<@!${message.author.id}>, Only admins can review projects`
                                );

                            await submitReview(message, args);
                            break;

                        case '-fs':
                            await fetchSubmission(message, rows);
                            break;
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
            return botChannelAsync(message, `<@!${message.author.id}>, ${error.message}`);
        }
    },
};
