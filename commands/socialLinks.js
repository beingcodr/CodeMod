const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { messageErrorAsync, deleteMessage } = require('../helpers/message');

module.exports = {
    name: 'socialLinks',
    description: 'This command shows you all the social handles and initiatives of Tanay Pratap',
    aliases: ['sociallinks', 'social', 'links'],
    usage: ' ',
    execute: async (message, args) => {
        deleteMessage(message, 0);
        let embed = new MessageEmbed()
            .setTitle("Tanay's social handles")
            .setColor(colors.yellow)
            .setThumbnail(
                'https://instagram.fbom15-1.fna.fbcdn.net/v/t51.2885-19/s320x320/90181421_510156213222489_6690442420095549440_n.jpg?_nc_ht=instagram.fbom15-1.fna.fbcdn.net&_nc_ohc=QI8cRp3F8jEAX8v63zw&oh=3049ecd08c681c1cd52cff42ed0b4a26&oe=5EF5EA33'
            )
            .addField(
                'YouTube',
                '[Subscribe on YouTube](https://youtube.com/tanaypratap)  |  [Unpolished Streams](https://www.youtube.com/channel/UCPy1Y8K7-3iRgQTmifCgZtw/)',
                false
            )
            .addField(
                'Instagram',
                '[Follow on Instagram](https://www.instagram.com/tanaypratap)',
                true
            )
            .addField('\u200b', '\u200b')
            .addField('TWITTER', '[Follow on Twitter](https://twitter.com/tanaypratap)', true)
            .addField(
                'LearnCodingFree',
                '[Learn coding for free](https://learncodingforfree.org)',
                true
            )
            .addField('TELEGRAM', '[Join #TEAMTANAY](https://t.me/teamtanay)', true)
            .addField(
                'LINKEDIN',
                '[Follow on LinkedIN](https://www.linkedin.com/in/tanaypratap/)',
                true
            )
            .addField('\u200b', '\u200b')
            .addField(
                'PODCASTS',
                '[TeaWithTanay](https://open.spotify.com/show/3dDVSp6sK7EGfw09jkvIl8)  |  [ProductFM](https://open.spotify.com/show/4Hyj2sZx0v8mgEbePLZTHG)  |  [ThinkingWithTanay](https://open.spotify.com/show/4IZCzLuBT6QezvViXlOgxO)  |  [Developer Duvidha](https://open.spotify.com/show/5PabW1rGCv7tKelY8JOCm3)',
                false
            )
            .addField(
                'INITIATIVES',
                '[ElevateLabs](https://elevatelabs.tech)  |  [JobChallenge](https://2020.jobchallenge.teamtanay.dev)  |  [Open Mentorship Program](https://bit.ly/mentorship-karona)  |  [Reddit Disscussion](https://www.reddit.com/r/teamtanay/ )'
            );

        messageErrorAsync(
            message,
            embed,
            `<@!${message.author.id}>, I wasn't able to send Tanay's social media links`
        );
    },
};
