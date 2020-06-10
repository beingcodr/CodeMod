const { MessageEmbed } = require('discord.js');
const { colors, prefix } = require('../json/config.json');

module.exports = {
    name: 'kick',
    description: 'dklfj;ad',
    guildOnly: true,
    execute: async (message) => {
        try {
            let user = message.mentions.users.first();

            if (user) {
                let admin = message.guild.member(message.author);
                let member = message.guild.member(user);
                if (member && admin.hasPermission('KICK_MEMBERS')) {
                    if (member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
                        message.client.user.username === member.user.username
                            ? message.reply(`You really think you can kick me? Traitor! `)
                            : message.reply(`You can\'t kick ${member} `);
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

                            message.channel.send(kickEmbed);

                            message
                                .delete()
                                .catch(() =>
                                    console.log(
                                        '[Warning]: DM to the bot cannot be deleted with `message.delete()` '
                                    )
                                );
                        }
                    } catch (error) {
                        message.author.send(`Unable to kick ${user}`);
                        console.error(error);
                    }

                    // !It seems that message.guild.channels.find() is not a function anymore
                    // let kickChannel = message.guild.channels.find(`name`, 'kickreports');
                    // if (!kickChannel) return message.channel.send(kickEmbed);

                    // kickChannel.send(kickEmbed);
                } else {
                    message.reply(`You don\'t have permissions to kick anyone`);
                }
            } else {
                message
                    .delete()
                    .catch(() =>
                        console.log(
                            '[Warning]: DM to the bot cannot be deleted with `message.delete()` '
                        )
                    );
                message.reply(` proper usage would be: \`${prefix}kick @username\``);
            }
        } catch (error) {
            throw error;
        }
    },
};
