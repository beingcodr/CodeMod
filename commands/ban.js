const { MessageEmbed } = require('discord.js');
const { prefix, colors } = require('../json/config.json');
const { botChannelAsync, messageErrorAsync, deleteMessage } = require('../helpers/message');

module.exports = {
    name: 'ban',
    description: 'This command bans the specified member of the guild',
    guildOnly: true,
    adminOnly: true,
    usage: '@username',
    execute: async (message, args) => {
        try {
            let user = message.mentions.users.first();

            if (user) {
                let admin = message.guild.member(message.author);
                let member = message.guild.member(user);
                if (member && admin.hasPermission('BAN_MEMBERS')) {
                    if (member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR'])) {
                        message.client.user.username === member.user.username
                            ? botChannelAsync(
                                  message,
                                  `<@!${message.author.id}>, you really think you can ban me? Traitor! `
                              )
                            : botChannelAsync(
                                  message,
                                  `<@!${message.author.id}>, you can\'t ban ${member}`
                              );
                        deleteMessage(message, 0);
                        return;
                    }

                    try {
                        const banedMember = member.ban({
                            reason: 'Repeated voilation of server rules and regulations',
                        });
                        if (banedMember) {
                            let banEmbed = new MessageEmbed()
                                .setTitle(`${user.username} is baned from ${message.guild.name}`)
                                .setColor(colors.green)
                                .setThumbnail(message.author.displayAvatarURL)
                                .addField('Baned User', `<@!${member.user.id}>`, true)
                                .addField('Baned By', `<@${message.author.id}>`, true)
                                .addField('Spammed In', `${message.channel} channel`, true)
                                .addField(
                                    'Reason',
                                    'Violation of server rules and regulations. You can learn more about the rules by typing `/rules`',
                                    true
                                );

                            botChannelAsync(message, banEmbed);

                            deleteMessage(message, 0);
                        }
                    } catch (error) {
                        deleteMessage(message, 0);
                        messageErrorAsync(
                            message,
                            `Unable to ban ${user}`,
                            `Unable to ban <@!${user}>`
                        );
                        console.error(error);
                    }
                } else {
                    botChannelAsync(
                        message,
                        `<@!${message.author.id}>, you don\'t have permissions to ban anyone`
                    );
                }
            } else {
                deleteMessage(message, 0);
                botChannelAsync(
                    message,
                    `<@!${message.author.id}>, proper usage would be: \`${prefix}ban @username days[optional]\``
                );
            }
        } catch (error) {
            throw error;
        }
    },
};
