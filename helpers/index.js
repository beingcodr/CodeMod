const { moderate } = require('../json/data.json');

const formatDate = (date) => {
    return date.toString().substr(4, 12);
};

const moderateMessagesCommand = (message) => {
    let slangsUsed = [];
    moderate.forEach((msg) => {
        if (new RegExp('\\b' + msg + '\\b').test(message.content)) {
            slangsUsed.push(`\`${msg}\``);
        }
    });
    return slangsUsed;
};

module.exports = {
    formatDate: formatDate,
    moderateMessagesCommand: moderateMessagesCommand,
};
