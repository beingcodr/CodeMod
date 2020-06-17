const { MessageEmbed } = require('discord.js');
const { colors, prefix } = require('../json/config.json');
const { messageErrorAsync, botChannelAsync, deleteMessage } = require('../helpers/message');

module.exports = {
    name: 'kick',
    description: 'This command kicks the specified user',
    guildOnly: true,
    adminOnly: true,
    usage: '@username',
    execute: async (message) => {
        deleteMessage(message, 0);
        try {
            let user = message.mentions.users.first();

            if (user) {
                if (message.author.id === user.id)
                    return messageErrorAsync(
                        message,
                        `You can't kick yourself :man_shrugging:`,
                        `<@!${message.author.id}>, you can't kick yourself :man_shrugging:`
                    );

                let admin = message.guild.member(message.author);
                let member = message.guild.member(user);
                if (member && admin.hasPermission('KICK_MEMBERS')) {
                    if (member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
                        message.client.user.username === member.user.username
                            ? botChannelAsync(
                                  message,
                                  `<@!${message.author.id}>, you really think you can kick me? Traitor! `
                              )
                            : botChannelAsync(
                                  message,
                                  `<@!${message.author.id}>, you can\'t kick ${member} `
                              );
                        return;
                    }

                    try {
                        const kickedMember = member.kick(
                            'Voilation of server rules and regulations'
                        );
                        if (kickedMember) {
                            let kickEmbed = new MessageEmbed()
                                .setTitle(`${user.username} is kicked from ${message.guild.name}`)
                                .setColor(colors.red)
                                .setThumbnail(message.author.displayAvatarURL)
                                .addField('Kicked User', `${member}`, true)
                                .addField('Kicked By', `<@${message.author.id}>`, true)
                                .addField('Spammed In', `<#${message.channel.id}>`, true)
                                .addField(
                                    'Reason',
                                    'Violation of server rules and regulations. You can learn more about the rules by typing `/rules`',
                                    true
                                );

                            botChannelAsync(message, kickEmbed);
                        }
                    } catch (error) {
                        messageErrorAsync(
                            message,
                            `Unable to kick ${user}`,
                            `<@!${message.author.id}> Unable to kick ${user}`
                        );
                        console.error(error);
                    }
                } else {
                    botChannelAsync(
                        message,
                        `<@!${message.author.id}>, you don\'t have permissions to kick anyone`
                    );
                }
            } else {
                messageErrorAsync(
                    message,
                    `Proper usage would be: \`${prefix}kick @username\``,
                    `<@!${message.author.id}>, proper usage would be: \`${prefix}kick @username\``
                );
            }
        } catch (error) {
            throw error;
        }
    },
};
