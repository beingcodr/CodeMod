const { botChannel, submissionChannel } = require('../json/config.json');

module.exports = {
    deleteMessage: (message, time) => {
        if (time) {
            time = parseInt(time) * 1000;
            if (isNaN(time)) return console.log(`\`time\` should be a positive integer`);
        }

        message.delete({ timeout: time }).catch(() => {
            console.log('[Warning]: DM to the bot cannot be deleted with `message.delete()`');
        });
    },
    messageErrorAsync: async (message, authorMessage, botChannelMessage) => {
        try {
            await message.author.send(authorMessage);
            return true;
        } catch (error) {
            let channelMsg = message.guild.channels.cache.find(
                (channel) => channel.id === process.env.CM_BOT_CHANNEL || channel.id === botChannel
            );
            if (!channelMsg)
                return message.reply(
                    `Seems like there is no dedicated \`botChannel\` where the bot can send messages`
                );

            channelMsg.send(
                `${botChannelMessage}\n\nYour DM is locked. Please enable it **User settings > Privacy & safety > Allow messages from server members**`,
                { split: true }
            );
            return false;
        }
    },
    memberErrorAsync: async (message, member, memberMessage, botChannelMessage) => {
        try {
            await member.send(memberMessage);
            return true;
        } catch (error) {
            let channelMsg = message.guild.channels.cache.find(
                (channel) => channel.id === process.env.CM_BOT_CHANNEL || channel.id === botChannel
            );
            if (!channelMsg)
                return message.reply(
                    `Seems like there is no dedicated \`botChannel\` where the bot can send messages`
                );

            channelMsg.send(
                `${botChannelMessage}\n\nYour DM is locked. Please enable it **User settings > Privacy & safety > Allow messages from server members**`,
                { split: true }
            );
            return false;
        }
    },
    botChannelAsync: async (message, botChannelMessage) => {
        try {
            let channelMsg = message.guild.channels.cache.find(
                (channel) => channel.id === process.env.CM_BOT_CHANNEL || channel.id === botChannel
            );
            if (!channelMsg)
                return message.reply(
                    `Seems like there is no dedicated \`botChannel\` where the bot can send messages`
                );

            channelMsg.send(botChannelMessage);
        } catch (error) {
            console.log(error);
            return;
        }
    },
    submissionChannelAsync: async (message, submissionChannelMessage) => {
        try {
            let channelMsg = message.guild.channels.cache.find(
                (channel) =>
                    channel.id === process.env.CM_SUBMISSION_CHANNEL ||
                    channel.id === submissionChannel
            );
            if (!channelMsg)
                return message.reply(
                    `Seems like there is no dedicated \`submissionChannel\` where the bot can send submissions`
                );

            channelMsg.send(submissionChannelMessage);
        } catch (error) {
            console.log(error);
            return;
        }
    },
};
