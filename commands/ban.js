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
        deleteMessage(message, 0);
        try {
            let user = message.mentions.users.first();

            if (user) {
                let admin = message.guild.member(message.author);
                let member = message.guild.member(user);
                if (member && admin.hasPermission('BAN_MEMBERS')) {
                    if (member.hasPermission(['BAN_MEMBERS'])) {
                        message.client.user.username === member.user.username
                            ? botChannelAsync(
                                  message,
                                  `<@!${message.author.id}>, you really think you can ban me? Traitor! `
                              )
                            : messageErrorAsync(
                                  message,
                                  `<@!${message.author.id}>, you can\'t ban <@!${member.user.id}>`,
                                  `<@!${message.author.id}>, you can\'t ban <@!${member.user.id}>`
                              );
                        return;
                    }

                    try {
                        const banedMember = member.ban({
                            reason: 'Repeated voilation of server rules and regulations',
                        });
                        if (banedMember) {
                            let banEmbed = new MessageEmbed()
                                .setTitle(`${user.username} is baned from ${message.guild.name}`)
                                .setColor(colors.red)
                                .setThumbnail(message.author.displayAvatarURL)
                                .addField('Baned User', `<@!${member.user.id}>`, true)
                                .addField('Baned By', `<@${message.author.id}>`, true)
                                .addField('Spammed In', `<#${message.channel.id}>`, true)
                                .addField(
                                    'Reason',
                                    'Repeated violation of server rules and regulations. You can learn more about the rules by typing `/rules`',
                                    true
                                );

                            botChannelAsync(message, banEmbed);
                        }
                    } catch (error) {
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
