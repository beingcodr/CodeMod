const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');

module.exports = {
    name: 'ban',
    description: 'kdslsjf;lkads',
    execute: async (message, args) => {
        try {
            let user = message.mentions.users.first();

            if (user) {
                let admin = message.guild.member(message.author);
                let member = message.guild.member(user);
                if (member && admin.hasPermission('BAN_MEMBERS')) {
                    if (member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR'])) {
                        bot.user.username === member.user.username
                            ? message.reply(`You really think you can ban me? Traitor! `)
                            : message.reply(`You can\'t ban ${member} `);
                        message.delete();
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
                                .addField('Baned User', `${member}`, true)
                                .addField('Baned By', `<@${message.author.id}>`, true)
                                .addField('Spammed In', `${message.channel} channel`, true)
                                .addField(
                                    'Reason',
                                    'Violation of server rules and regulations. You can learn more about the rules by typing `/rules`',
                                    true
                                );

                            message.channel.send(banEmbed);
                            message.delete();
                        }
                    } catch (error) {
                        message.author.send(`Unable to ban ${user}`);
                        console.error(error);
                    }
                } else {
                    message.reply(`You don\'t have permissions to ban anyone`);
                }
            } else {
                message.channel.send(
                    `Oooo, someone was going to be baned out. But seems like ${message.author} didn\'t specify who`
                );
            }
        } catch (error) {
            throw error;
        }
    },
};
