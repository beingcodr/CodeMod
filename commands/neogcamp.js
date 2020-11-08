const { GoogleSpreadsheet } = require('google-spreadsheet');
const { deleteMessage, messageErrorAsync, botChannelAsync } = require('../helpers/message');
const { getByDiscordTag } = require('../helpers/sheet');

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
                const sheet = doc.sheetsByTitle['Sheet2'];
                await doc.updateProperties({ title: 'Discord TeamTanay spreadsheet' });
                // filters out the spaces and flags from the args
                const refinedArgs = args.filter((arg) => arg !== '');

                // Collects the flags from the args
                const flags = args.filter((arg) => arg.includes('-') && arg.length <= 2);
                console.log('Refined args: ', refinedArgs);
                // const flags = ['-s', '-f', '-S'];
                console.log('Flags: ', flags);
                const rows = await sheet.getRows();
                rows.forEach((row) => console.log(row.rowIndex));

                flags.forEach(async (flag) => {
                    const inputIndex = +args.indexOf(flag) + 1;
                    switch (flag) {
                        case '-s':
                        case '-submit':
                            let user = await getByDiscordTag(rows, args[inputIndex]);
                            console.log('innerINput', args[inputIndex]);
                            console.log(user);
                            if (user[0] === undefined) {
                                sheet.addRow({
                                    discordUsername: message.author.tag,
                                    projectUrls: args[inputIndex],
                                });
                            } else {
                                console.log(
                                    `The row index ${user[0].rowIndex - 1} and data ${
                                        rows[user[0].rowIndex - 1].projectUrls
                                    }`
                                );
                            }
                            break;

                        case '-as':
                        case '-add-sheet':
                            await doc.addSheet({
                                title: 'Submittions',
                                headerValues: [
                                    'discordUsername',
                                    'Level',
                                    'Github URL',
                                    'Project URL',
                                    'Portfolio URL',
                                ],
                            });
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
