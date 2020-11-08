const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
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
                // filters out the spaces and flags from the args
                const refinedArgs = args.filter((arg) => arg !== '');

                // Collects the flags from the args
                const flags = args.filter((arg) => arg.includes('-') && arg.length <= 3);
                // console.log('Refined args: ', refinedArgs);
                // console.log('Flags: ', flags);
                const rows = await sheet.getRows();
                rows.forEach((row) => console.log(row.rowIndex));

                flags.forEach(async (flag) => {
                    const inputIndex = +args.indexOf(flag) + 1;
                    switch (flag) {
                        case '-s':
                        case '-submit':
                            let user = await getByDiscordTag(rows, message.author.tag);
                            // console.log('User', user);
                            if (!user.length) {
                                sheet.addRow({
                                    discordUsername: message.author.tag,
                                    projectUrls: args[inputIndex],
                                });
                            } else {
                                // updating the row
                                rows[user[0].rowIndex - 2].projectUrls = `${
                                    rows[user[0].rowIndex - 2].projectUrls
                                }, ${args[inputIndex]}`;
                                // saving the updated row
                                await rows[user[0].rowIndex - 2].save();
                            }
                            break;

                        case '-as':
                        case '-addsheet':
                            if (args.length > 2) {
                                await doc.addSheet({
                                    title: args[inputIndex],
                                    headerValues: [...args[inputIndex + 1].split(',')],
                                });
                            } else {
                                await doc.addSheet({
                                    title: args[inputIndex],
                                });
                            }
                            break;

                        // case '-r':
                        // case '-review':

                        case '-fs':
                        case '-fetchsubmission':
                            let hasMentions = false;
                            let messageEmbed;
                            if (message.mentions.users.size) hasMentions = true;

                            const mentionedUser = message.mentions.users.first();
                            let fetchedSubmission;
                            if (hasMentions) {
                                fetchedSubmission = rows.filter(
                                    (row) =>
                                        row.discordUsername ===
                                        `${mentionedUser.username}#${mentionedUser.discriminator}`
                                );
                                console.log(
                                    `Mentioned user: ${mentionedUser.username}#${mentionedUser.discriminator}`
                                );
                                let messageEmbed = new MessageEmbed()
                                    .setTitle('Submission Details')
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
                                botChannelAsync(message, messageEmbed);
                            } else {
                                fetchedSubmission = rows.filter(
                                    (row) =>
                                        row.discordUsername ===
                                        `${message.author.username}#${message.author.discriminator}`
                                );
                                console.log(
                                    `Author: ${message.author.username}#${message.author.discriminator}`
                                );
                                let messageEmbed = new MessageEmbed()
                                    .setTitle('Submission Details')
                                    .setThumbnail(message.author.avatarURL())
                                    .setColor(colors.green)
                                    .addField('Fetched user', `<@!${message.author.id}>`, true)
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
                                botChannelAsync(message, messageEmbed);
                            }

                            console.log('Fetched user', fetchedSubmission);
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
