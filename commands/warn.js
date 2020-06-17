const { MessageEmbed } = require('discord.js');
const { colors, adminRole } = require('../json/config.json');
const { botChannelAsync, deleteMessage, messageErrorAsync } = require('../helpers/message');
const Member = require('../server/models/Member');
const { addMemberEvent } = require('../helpers/member');

module.exports = {
    name: 'warn',
    args: true,
    guildOnly: true,
    adminOnly: true,
    usage: `@username <reason for warning>`,
    execute: async (message, args) => {
        deleteMessage(message, 0);
        let admin = process.env.CM_ADMIN_ROLE || adminRole;
        let result = {};

        if (!message.member.hasPermission('ADMINISTRATOR'))
            return botChannelAsync(message, `You can't use \`warn\` command`);

        let mentionedMember = message.mentions.users.first();
        if (!mentionedMember) {
            return messageErrorAsync(
                message,
                `Invalid mention`,
                `<@!${message.author.id}>, There was no mention found`
            );
        }

        let guildMember = message.guild.member(mentionedMember);
        if (!guildMember) {
            return messageErrorAsync(
                message,
                `<@!${mentionedMember.id}> is not a member of ${message.guild.name}`,
                `<@!${message.author.id}>, <@!${mentionedMember.id}> is not a member of ${message.guild.name}`
            );
        }

        let member = await Member.findOne({ discordId: mentionedMember.id });
        if (!member) {
            result = await addMemberEvent(guildMember);
        }

        const warnObj = {
            warnedBy: `${message.author.username}`,
            warnedFor: `${args.slice(1).join(' ')}`,
            warnedOnChannel: `${message.channel.name}`,
        };
        try {
            if (result.success && result.member) {
                result.member.warn = [...result.member.warn, warnObj];
                await result.member.save();
            } else {
                member.warn = [...member.warn, warnObj];
                await member.save();
            }
        } catch (error) {
            console.error(error);
            return messageErrorAsync(
                message,
                `There was a problem updating <@!${mentionedUser.id}> with the warning`,
                `<@!${message.author.id}>, there was a problem updating <@!${mentionedUser.id}> with the warning`
            );
        }

        let warnEmbed, guildRole;
        let messageMember = message.guild.member(message.author);
        args = args.slice(1).join(' ');
        if (!args)
            return messageErrorAsync(
                message,
                `No reason for warning found!`,
                `<@!${message.author.id}>, No reason for warning found!`
            );

        let isAdmin = messageMember.roles.cache.some((role) => role.id === admin);
        if (isAdmin) {
            guildRole = message.guild.roles.cache.find((role) => role.id === admin);
        }

        if (guildRole)
            warnEmbed = new MessageEmbed()
                .setTitle(`Warning for **${mentionedMember.username}**`)
                .setThumbnail(mentionedMember.avatarURL())
                .setColor(colors.red)
                .addField('Issued channel', `<#${message.channel.id}>`, true)
                .addField('Warned User', `<@!${mentionedMember.id}>`, true)
                .addField(
                    'reason',
                    `You have been warned by **${guildRole.name}** for **${args}**\n\nContinue the same and you'll be banned from this server`,
                    false
                );
        else
            warnEmbed = new MessageEmbed()
                .setTitle(`Warning for **${mentionedMember.username}**`)
                .setThumbnail(mentionedMember.avatarURL())
                .setColor(colors.red)
                .addField('Issued channel', `<#${message.channel.id}>`, true)
                .addField('Warned User', `<@!${mentionedMember.id}>`, true)
                .addField(
                    'reason',
                    `You have been warned for **${args}**\n\nContinue the same and you'll be banned from this server`,
                    false
                );

        botChannelAsync(message, warnEmbed);
    },
};
