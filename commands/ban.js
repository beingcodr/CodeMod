const { MessageEmbed } = require('discord.js');
const { prefix, colors } = require('../json/config.json');
const { botChannelAsync, messageErrorAsync, deleteMessage } = require('../helpers/message');
const Member = require('../server/models/Member');

module.exports = {
    name: 'ban',
    description: 'This command bans the specified member of the guild',
    guildOnly: true,
    adminOnly: true,
    usage: '@username',
    execute: async (message, args) => {
        deleteMessage(message, 0);
        let ruleChannelId = process.env.CM_RULE_CHANNEL || ruleChannel;
        try {
            let user = message.mentions.users.first() || args[0];

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
                                .setTitle(
                                    `${member.user.username} is banned from ${message.guild.name}`
                                )
                                .setColor(colors.red)
                                .setThumbnail(member.user.displayAvatarURL())
                                .addField('Banned User', `<@!${member.user.id}>`, true)
                                .addField('Spammed In', `<#${message.channel.id}>`, true)
                                .addField(
                                    'Reason',
                                    `Repeated violation of server rules and regulations. You can learn more about the rules by typing <#${ruleChannelId}>`,
                                    false
                                );

                            await Member.findOneAndDelete({ discordId: member.user.id }).catch(
                                (err) => {
                                    console.log(err);
                                }
                            );
                            return botChannelAsync(message, banEmbed);
                        }
                    } catch (error) {
                        console.error(error);
                        return messageErrorAsync(
                            message,
                            `Unable to ban ${member.user.username}`,
                            `Unable to ban <@!${member.user.username}>`
                        );
                    }
                } else {
                    return botChannelAsync(
                        message,
                        `<@!${message.author.id}>, you don\'t have permissions to ban anyone`
                    );
                }
            } else {
                return botChannelAsync(
                    message,
                    `<@!${message.author.id}>, proper usage would be: \`${prefix}ban @username\``
                );
            }
        } catch (error) {
            throw error;
        }
    },
};
