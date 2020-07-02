const { moderate } = require('../json/data.json');

module.exports = {
    formatDate: (date) => {
        return date.toString().substr(4, 12);
    },
    moderateMessagesCommand: (message) => {
        let slangsUsed = [];
        moderate.forEach((msg) => {
            if (new RegExp('\\b' + msg + '\\b').test(message.content)) {
                slangsUsed.push(`\`${msg}\``);
            }
        });
        return slangsUsed;
    },
    botCount: (message) => {
        let botCount = 0;
        message.guild.members.cache.forEach((member) => {
            if (member.user.bot) {
                botCount += 1;
            }
        });
        return botCount;
    },
};
