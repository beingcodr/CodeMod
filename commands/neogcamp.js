const { GoogleSpreadsheet } = require('google-spreadsheet');
const { deleteMessage, messageErrorAsync, botChannelAsync } = require('../helpers/message');

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

                // console.log('Sheet title: ', sheet.title);
                await doc.updateProperties({ title: 'Discord TeamTanay spreadsheet' });
                // filters out the spaces and flags from the args
                const refinedArgs = args.filter((arg) => arg !== '' && !arg.includes('-'));
                // Collects the flags from the args
                flags = args.filter((arg) => arg.includes('-'));
                console.log('Refined args: ', refinedArgs);
                console.log('Flags: ', flags);

                flags.forEach(async (flag) => {
                    switch (flag) {
                        case '-s':
                        case '--submit':
                            break;

                        case '-as':
                        case '--add-sheet':
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
