const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { messageErrorAsync } = require('../helpers/message');

module.exports = {
    name: 'resources',
    description:
        'This command will ping you all the resources you might need for learning Web Development and Design',
    usage: ' ',
    execute: (message) => {
        let embed = new MessageEmbed()
            .setTitle('Resources for developers')
            .setColor(colors.yellow)
            .addField(
                'INTERACTIVE CODING',
                '[FreeCodeCamp](https://www.freecodecamp.org)  |  [Codecademy](https://www.codecademy.com)  |  [Scrimba](https://www.scrimba.com)'
            )
            .addField('YOUTUBE', 'YouTube channels you can follow', false)
            .addField(
                'DESIGN PRINCIPLES',
                '[DesignCourse](https://www.youtube.com/user/DesignCourse)  |  [Jesse Showalter](https://www.youtube.com/user/JesseAtomic)',
                true
            )
            .addField(
                'WEB DEVELOPMENT',
                '[FreeCodeCamp](https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ)  |  [Traversy Media](https://www.youtube.com/user/TechGuyWeb)  |  [Dev Ed](https://www.youtube.com/channel/UClb90NQQcskPUGDIXsQEz5Q)',
                true
            )
            .addField(
                'STOCK IMAGES',
                '[Pexels](https://www.pexels.com)  |  [Unsplash](https://www.unsplash.com)  |  [Pixabay](https://pixabay.com/)',
                true
            )
            .addField(
                'RESOURCE LINK',
                'For dozens of cool resources check out [this link](https://github.com/bradtraversy/design-resources-for-developers) by Brad Travesy'
            );

        message
            .delete()
            .catch(() =>
                console.log('[Warning]: DM to the bot cannot be deleted with `message.delete()` ')
            );
        messageErrorAsync(message, embed, `<@!${message.author.id}>, I can't send the embed`);
    },
};
