const Member = require('../server/models/Member');
const {
    messageErrorAsync,
    botChannelAsync,
    deleteMessage,
    memberErrorAsync,
} = require('../helpers/message');
const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');

module.exports = {
    name: 'downvote',
    desciption: 'This command lets the user upvote other users for their help',
    guildOnly: true,
    usage: '@username',
    execute: async (message, args) => {
        let mentionedMember = message.mentions.users.first();
        if (!mentionedMember) {
            deleteMessage(message, 0);
            messageErrorAsync(
                message,
                `Invalid mention`,
                `<@!${message.author.id}>, There was no mention found`
            );
            return;
        }

        let guildMember = message.guild.member(mentionedMember);
        if (!guildMember) {
            deleteMessage(message, 0);
            messageErrorAsync(
                message,
                `<@!${mentionedMember.id}> is not a member of ${message.guild.name}`,
                `<@!${message.author.id}>, <@!${mentionedMember.id}> is not a member of ${message.guild.name}`
            );
            return;
        }

        const member = await Member.findOne({ discordId: mentionedMember.id });
        if (!member) {
            deleteMessage(message, 0);
            messageErrorAsync(
                message,
                `<@!${mentionedMember.id}> is not registered in the database`,
                `<@!${message.author.id}>, <@!${mentionedMember.id}> is not registered in the DB`
            );
            return;
        }

        if (member.discordId === message.author.id) {
            deleteMessage(message, 0);
            botChannelAsync(
                message,
                `<@!${message.author.id}>, come on! You can't downvote yourself :man_shrugging:`
            );
            return;
        }

        deleteMessage(message, 0);
        member.totalPoints -= 5;
        try {
            await member.save();
            memberErrorAsync(
                message,
                guildMember,
                `<@!${message.author.id}> downvoted you. Your \`totalPoints\` is **${member.totalPoints}**`,
                `<@!${guildMember.id}>, you were downvoted by <@!${message.author.id}>. Your \`totalPoints\` is **${member.totalPoints}**`
            );

            let downvoteEmbed = new MessageEmbed()
                .setTitle('**Downvote**')
                .setColor(colors.red)
                .addField('Downvoted Member', `<@!${mentionedMember.id}>`)
                .addField('Downvoted By', `${message.author}`)
                .addField('Channel', `<#${message.channel.id}>`)
                .addField('Downvoted By', `${message.author}`)
                .addField('Downvoted By', `${message.author}`)
                .addField('Downvoted By', `${message.author}`);
        } catch (error) {
            console.error(error);
        }
    },
};
