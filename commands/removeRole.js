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
    aliases: ['removerole', 'rmrole'],
    execute: async (message, args) => {
        deleteMessage(message, 0);
        if (!message.member.hasPermission(['MANAGE_ROLES', 'ADMINISTRATOR'])) {
            return botChannelAsync(
                message,
                `<@!${message.author.id}>, you don't have permissions to add roles`
            );
        }

        let mentionedUser = message.mentions.users.first();
        if (!mentionedUser)
            return messageErrorAsync(
                message,
                'Invalid user mentioned',
                `<@!${message.author.id}>, you mentioned an invalid user`
            );
        let roleMember = message.guild.member(mentionedUser);
        if (!roleMember) {
            return messageErrorAsync(
                message,
                'No such member found!',
                `<@!${message.author.id}>, no such member found!`
            );
        }

        let roleName = args.slice(1).join(' ');
        if (!roleName) {
            return messageErrorAsync(
                message,
                'Specify a role!',
                `<@!${message.author.id}>, specify a role!`
            );
        }

        if (roleMember.hasPermission('ADMINISTRATOR')) {
            return messageErrorAsync(
                message,
                `You can't remove role from <@!${roleMember.user.id}>`,
                `<@!${message.author.id}>, you can't remove role from <@!${roleMember.user.id}>`
            );
        }

        let guildRole = message.guild.roles.cache.find(
            (role) => role.name.toLowerCase() === roleName.toLowerCase()
        );
        if (!guildRole) {
            return messageErrorAsync(
                message,
                "Couldn't find a role!",
                `<@!${message.author.id}>, couldn\'t find a role!`
            );
        }

        if (
            !roleMember.roles.cache.some(
                (role) => role.name.toLowerCase() === roleName.toLowerCase()
            )
        ) {
            return messageErrorAsync(
                message,
                "The user doesn't have that role!",
                `<@!${message.author.id}>, the user doesn't have that role!`
            );
        }

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
            `<@!${roleMember.user.id}>, you lost **${guildRole.name}** role`
        );
    },
};
