const { MessageEmbed } = require('discord.js');
const { colors, prefix } = require('../json/config.json');
const { messageErrorAsync, botChannelAsync } = require('../helpers/message');

module.exports = {
    name: 'kick',
    description: 'dklfj;ad',
    guildOnly: true,
    adminOnly: true,
    usage: '@username',
    execute: async (message) => {
        try {
            let user = message.mentions.users.first();

            if (user) {
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
                        message
                            .delete()
                            .catch(() =>
                                console.log(
                                    '[Warning]: DM to the bot cannot be deleted with `message.delete()` '
                                )
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
                                .addField('Spammed In', `${message.channel} channel`, true)
                                .addField(
                                    'Reason',
                                    'Violation of server rules and regulations. You can learn more about the rules by typing `/rules`',
                                    true
                                );

                            botChannelAsync(message, kickEmbed);

                            message
                                .delete()
                                .catch(() =>
                                    console.log(
                                        '[Warning]: DM to the bot cannot be deleted with `message.delete()` '
                                    )
                                );
                        }
                    } catch (error) {
                        messageErrorAsync(
                            message,
                            `Unable to kick ${user}`,
                            `<@!${message.author.id}> Unable to kick ${user}`
                        );
                        console.error(error);
                    }

                    // !It seems that message.guild.channels.find() is not a function anymore
                    // let kickChannel = message.guild.channels.find(`name`, 'kickreports');
                    // if (!kickChannel) return message.channel.send(kickEmbed);

                    // kickChannel.send(kickEmbed);
                } else {
                    botChannelAsync(
                        message,
                        `<@!${message.author.id}>, you don\'t have permissions to kick anyone`
                    );
                }
            } else {
                message
                    .delete()
                    .catch(() =>
                        console.log(
                            '[Warning]: DM to the bot cannot be deleted with `message.delete()` '
                        )
                    );
                botChannelAsync(
                    message,
                    `<@!${message.author.id}>, proper usage would be: \`${prefix}kick @username\``
                );
            }
        } catch (error) {
            throw error;
        }
    },
};
