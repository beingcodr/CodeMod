const {
    botChannelAsync,
    messageErrorAsync,
    memberErrorAsync,
    deleteMessage,
} = require('../helpers/message');

module.exports = {
    name: 'addRole',
    description: 'This command allows the admins to assign roles to the members',
    guildOnly: true,
    adminOnly: true,
    usage: '@username <role name>[case-sensitive]',
    aliases: ['addrole'],
    execute: async (message, args) => {
        deleteMessage(message, 0);
        if (!message.member.hasPermission(['MANAGE_ROLES'])) {
            return botChannelAsync(
                message,
                `<@!${message.author.id}>, you don't have permissions to add roles`
            );
        }

        let mentionedUser = message.mentions.users.first();
        if (!mentionedUser)
            return messageErrorAsync(
                message,
                'No mentions found!',
                `<@!${message.author.id}>, no mentions found!`
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
                "Couldn't find a role!",
                `<@!${message.author.id}>, couldn\'t find a role!`
            );
        }

        if (
            roleMember.roles.cache.some(
                (role) => role.name.toLowerCase() === roleName.toLowerCase()
            )
        ) {
            return messageErrorAsync(
                message,
                'The user already has that role!',
                `<@!${message.author.id}>, the user already has that role!`
            );
        }

        try {
            await roleMember.roles.add(guildRole.id);
        } catch (error) {
            console.log(error);
            return;
        }

        memberErrorAsync(
            message,
            roleMember,
            `Congrats, you have been given the role **${guildRole.name}**`,
            `Congrats, <@!${roleMember.id}> have been given the role **${guildRole.name}**`
        );
    },
};
