const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { messageErrorAsync, deleteMessage } = require('../helpers/message');

module.exports = {
    name: 'jobChallenge',
    description: 'This command provides you informative links for JobChallenge',
    aliases: ['jobchallenge', 'ttjc'],
    usage: ' ',
    execute: async (message, args) => {
        deleteMessage(message, 0);
        let embed = new MessageEmbed()
            .setTitle('Details for TeamTanayJobChallenge')
            .setColor(colors.yellow)
            .addField(
                'JOB CHALLENGE WEBSITE',
                '[TEAMTANAYJOBCHALLENGE WEBSITE](https://2020.teamtanay.jobchallenge.dev)',
                false
            )
            .addField(
                'STUCK IN REGISTERATION PROCESS?',
                '[Watch this comprehensive playlist](https://www.youtube.com/watch?v=QzjgBj9oaAA&list=PLzvhQUIpvvug0h5H3W6e_TEGGBivEtnaJ)',
                false
            )
            .addField(
                'JOB CHALLENGE PARTICIPANTS',
                '[Participants list](https://2020.teamtanay.jobchallenge.dev/participants)',
                true
            )
            .addField(
                'JOB CHALLENGE FAQ',
                '[FAQ list](https://2020.teamtanay.jobchallenge.dev/faqs)',
                true
            )
            .addField(
                'JOB CHALLENGE BLOG',
                '[BLOG LINK](https://2020.teamtanay.jobchallenge.dev/blogs)',
                true
            )
            .addField(
                'JOB CHALLENGE DISCUSSION HANDLES',
                '[TELEGRAM](https://t.me/teamtanay)  |  [INSTAGRAM](https://www.instagram.com/tanaypratap)',
                true
            );

        messageErrorAsync(
            message,
            embed,
            `<@!${message.author.id}>, I wasn't able to send the links for JobChallenge`
        );
    },
};
