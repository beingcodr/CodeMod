const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');

module.exports = {
    name: 'jobChallenge',
    description: 'lkdjflkdajsf',
    aliases: ['jobchallenge', 'ttjc'],
    execute: async (message, args) => {
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

        message
            .delete()
            .catch(() =>
                console.log('[Warning]: DM to the bot cannot be deleted with `message.delete()` ')
            );
        message.author.send(embed);
    },
};
