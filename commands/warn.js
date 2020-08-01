const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const {
    botChannelAsync,
    deleteMessage,
    messageErrorAsync,
    memberErrorAsync,
} = require('../helpers/message');
const Member = require('../server/models/Member');
const kick = require('./kick');
const { addMemberEvent } = require('../helpers/member');
const ban = require('./ban');

const warnValidator = async (message, args, warnCount) => {
    if (warnCount === 5) {
        return kick.execute(message, args);
    } else if (warnCount >= 10) {
        return ban.execute(message, args);
    }
};

module.exports = {
    name: 'warn',
    args: true,
    guildOnly: true,
    adminOnly: true,
    usage: `@username <reason for warning>`,
    execute: async (message, args) => {
        deleteMessage(message, 0);
        let result = {};
        let savedMember = {};
        let warnCount = 0;

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

        if (message.author.id === mentionedMember.id) {
            return messageErrorAsync(
                message,
                `Come on! you can't warn yourself`,
                `<@!${message.author.id}>, come on! you can't warn yourself`
            );
        }

        args = args.slice(1).join(' ');
        if (!args)
            return messageErrorAsync(
                message,
                `Please provide a **reason** with the \`warn\` command`,
                `<@!${message.author.id}>, Please provide a **reason** with the \`warn\` command`
            );

        let member = await Member.findOne({
            discordSlug: `${mentionedMember.id}${message.guild.id}`,
        });
        if (!member) {
            result = await addMemberEvent(guildMember, 'warn command');
        }

        const warnObj = {
            warnedBy: `${message.author.username}`,
            warnedFor: `${args}`,
            warnedOnChannel: `${message.channel.name}`,
        };

        try {
            if (result.success && result.member) {
                result.member.warn = [...result.member.warn, warnObj];
                savedMember = await result.member.save();
            } else {
                member.warn = [...member.warn, warnObj];
                member.addedBy.length <= 1 && (member.addedBy = 'warn command');
                savedMember = await member.save();
            }
        } catch (error) {
            console.error(error);
            return messageErrorAsync(
                message,
                `There was a problem saving <@!${guildMember.user.id}> with the warning`,
                `<@!${message.author.id}>, there was a problem saving <@!${guildMember.user.id}> with the warning`
            );
        }

        let warnEmbed;

        warnEmbed = new MessageEmbed()
            .setTitle(`Warning issued for _${guildMember.user.username}_`)
            .setThumbnail(guildMember.user.avatarURL())
            .setColor(colors.red)
            .addField('Issued channel', `<#${message.channel.id}>`, true)
            .addField('Warned User', `<@!${mentionedMember.id}>`, true)
            .addField(
                'reason',
                `You have been warned for **${args}**\n\nContinue the same and you'll be ${
                    savedMember.warn.length <= 5 ? 'kicked' : 'banned'
                } from this server`,
                false
            );

        botChannelAsync(message, warnEmbed);

        if (savedMember.warn.length < 5) {
            warnCount = 5 - savedMember.warn.length;
            memberErrorAsync(
                message,
                guildMember,
                `You are ${warnCount} warnings away from getting kicked`,
                `<@${guildMember.user.id}>, you are ${warnCount} warnings away from getting kicked`
            );
        } else if (savedMember.warn.length > 5 && savedMember.warn.length < 10) {
            warnCount = 10 - savedMember.warn.length;
            memberErrorAsync(
                message,
                guildMember,
                `You are ${warnCount} warnings away from getting banned`,
                `<@${guildMember.user.id}>, you are ${warnCount} warnings away from getting banned`
            );
        }

        args = [{ id: `${guildMember.user.id}`, bypass: true, guild: { id: message.guild.id } }];
        return warnValidator(message, args, savedMember.warn.length);
    },
};
