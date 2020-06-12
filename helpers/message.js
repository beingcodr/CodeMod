const { botChannel } = require('../json/config.json');

module.exports = {
    messageErrorAsync: async (message, authorMessage, botChannelMessage) => {
        try {
            await message.author.send(authorMessage);
            return true;
        } catch (error) {
            message.client.channels
                .fetch(process.env.CM_BOT_CHANNEL || botChannel)
                .then((channel) =>
                    channel.send(
                        `${botChannelMessage}\n\nYour DM is locked. Please enable it **User settings > Privacy & safety > Allow messages from server members**`,
                        { split: true }
                    )
                );
            return false;
        }
    },
    memberErrorAsync: async (message, member, authorMessage, botChannelMessage) => {
        try {
            await member.send(authorMessage);
            return true;
        } catch (error) {
            message.client.channels
                .fetch(process.env.CM_BOT_CHANNEL || botChannel)
                .then((channel) =>
                    channel.send(
                        `${botChannelMessage}\n\nYour DM is locked. Please enable it **User settings > Privacy & safety > Allow messages from server members**`,
                        { split: true }
                    )
                );
            return false;
        }
    },
    botChannelAsync: async (message, botChannelMessage) => {
        await message.client.channels
            .fetch(process.env.CM_BOT_CHANNEL || botChannel)
            .then((channel) => {
                channel.send(botChannelMessage);
            });
    },
};
