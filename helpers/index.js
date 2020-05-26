const { prefix } = require('../json/config.json');

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
            return false;
        }
    }
    return true;
};

module.exports = {
    formatDate: formatDate,
    serverCommand: serverCommand,
};
