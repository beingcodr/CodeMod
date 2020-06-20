const {
    botChannelAsync,
    messageErrorAsync,
    memberErrorAsync,
    deleteMessage,
} = require('../helpers/message');

module.exports = {
    name: 'removeRole',
    description: 'This command allows the admins to remove roles from the members',
    guildOnly: true,
    adminOnly: true,
    usage: '@username <role name>',
    aliases: ['removerole', 'rmrole'],
    execute: async (message, args) => {
        deleteMessage(message, 0);
        if (!message.member.hasPermission(['MANAGE_ROLES', 'ADMINISTRATOR'])) {
            return botChannelAsync(
                message,
                `<@!${message.author.id}>, you don't have permissions to remove roles`
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

        let guildRole = message.guild.roles.cache.find(
            (role) => role.name.toLowerCase() === roleName.toLowerCase()
        );
        if (!guildRole) {
            return messageErrorAsync(
                message,
                `Couldn't find a role named **${roleName}**!`,
                `<@!${message.author.id}>, couldn\'t find a role named **${roleName}**!`
            );
        }

        if (roleMember.hasPermission('ADMINISTRATOR')) {
            return messageErrorAsync(
                message,
                `You can't remove role from <@!${roleMember.user.id}>`,
                `<@!${message.author.id}>, you can't remove ${guildRole.name} role from <@!${roleMember.user.id}>`
            );
        }

        if (
            !roleMember.roles.cache.some(
                (role) => role.name.toLowerCase() === roleName.toLowerCase()
            )
        ) {
            return messageErrorAsync(
                message,
                `The user doesn't have **${guildRole.name}** role!`,
                `<@!${message.author.id}>, the user doesn't have **${guildRole.name}** role!`
            );
        }

        try {
            await roleMember.roles.remove(guildRole);
        } catch (error) {
            console.log(error);
            return messageErrorAsync(
                message,
                'There was an error while removing the role',
                `<@!${message.author.id}>, there was an error while removing the role`
            );
        }

        memberErrorAsync(
            message,
            roleMember,
            `Alas, you lost **${guildRole.name}** role`,
            `<@!${roleMember.user.id}>, you lost **${guildRole.name}** role`
        );
    },
};
