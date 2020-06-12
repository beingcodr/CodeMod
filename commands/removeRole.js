const {
    botChannelAsync,
    messageErrorAsync,
    memberErrorAsync,
    deleteMessage,
} = require('../helpers/message');

module.exports = {
    name: 'removeRole',
    description: 'This command allows the admins to assign roles to the members',
    guildOnly: true,
    adminOnly: true,
    usage: '@username <role name>[case-sensitive]',
    aliases: ['removerole'],
    execute: async (message, args) => {
        if (!message.member.hasPermission(['MANAGE_ROLES'])) {
            deleteMessage(message, 0);
            return botChannelAsync(
                message,
                `<@!${message.author.id}>, you don't have permissions to add roles`
            );
        }

        let mentionedUser = message.mentions.users.first() || message.guild.members.get(args[0]);
        let roleMember = message.guild.member(mentionedUser);
        if (!roleMember) {
            deleteMessage(message, 0);
            return messageErrorAsync(
                message,
                'No such member found!',
                `<@!${message.author.id}>, no such member found!`
            );
        }

        let roleName = args.slice(1).join(' ');
        if (!roleName) {
            deleteMessage(message, 0);
            return messageErrorAsync(
                message,
                'Specify a role!',
                `<@!${message.author.id}>, specify a role!`
            );
        }

        let guildRole = message.guild.roles.cache.find((role) => role.name === roleName);
        if (!guildRole) {
            deleteMessage(message, 0);
            return messageErrorAsync(
                message,
                "Couldn't find a role!",
                `<@!${message.author.id}>, couldn\'t find a role!`
            );
        }

        if (!roleMember.roles.cache.some((role) => role.name === roleName)) {
            deleteMessage(message, 0);
            return messageErrorAsync(
                message,
                "The user doesn't have that role!",
                `<@!${message.author.id}>, the user doesn't have that role!`
            );
        }

        deleteMessage(message, 0);
        try {
            await roleMember.roles.remove(guildRole.id);
        } catch (error) {
            console.log(error);
            return;
        }

        memberErrorAsync(
            message,
            roleMember,
            `Alas, you lost **${guildRole.name}** role`,
            `<@!${roleMember.id}>, you lost **${guildRole.name}** role`
        );
    },
};
