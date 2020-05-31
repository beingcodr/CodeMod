const { prefix } = require('../json/config.json');
const { moderate } = require('../json/data.json');

const formatDate = (date) => {
    return date.toString().substr(0, 16);
};

const serverCommand = (message) => {
    if (message.channel.type === 'dm') {
        if (message.content.startsWith(`${prefix}`)) {
            let content = '`' + message.content + '`';
            message.channel.send(
                ` ${content} might be a server command. Try running it on the server`
            );
            return true;
        }
    }
    return false;
};

const moderateMessagesCommand = (message) => {
    moderate.forEach((msg) => {
        if (message.content.includes(msg)) {
            message.author.send(
                '[Warning] This message is to notify you that your message was deleted from the server because it contained a slang word which is not permitted in this server. You might get banned if you continue to voilate the rules'
            );
            message
                .delete()
                .catch(() =>
                    console.log(
                        '[Warning]: DM to the bot cannot be deleted with `message.delete()` '
                    )
                );
            message.reply('Just used a slang word in his/her message, take a look @admins');
            // If slang is used
            return true;
        }
    });
    // if no slang is used
    return false;
};

module.exports = {
    formatDate: formatDate,
    serverCommand: serverCommand,
    moderateMessagesCommand: moderateMessagesCommand,
};
