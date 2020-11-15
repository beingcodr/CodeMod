const {
    botChannelAsync,
    messageErrorAsync,
    memberErrorAsync,
    deleteMessage,
} = require('../helpers/message');
const { updateMember } = require('../helpers/member');

module.exports = {
    name: 'removeRole',
    description: 'This command allows the admins to remove single/multiple roles from the members',
    guildOnly: true,
    usage: `@username <role name>\` OR \`/removeRole @username <rolename1, role name2,..., role namen>`,
    aliases: ['removerole', 'rmrole'],
    execute: async (message, args) => {
        deleteMessage(message, 0);
        let updatedWithRole = 0;
        let isAdmin = false;
        let hasMentions = false;
        let unidentifiedRoles = [];
        let nonRemoveableRoles = [];
        let removedRoles = [];
        let memberRoles = [];
        let roleMember = {};
        let roleNamesSet = {};
        let checkRolePermission = (role) =>
            role.permissions.has('ADMINISTRATOR') ||
            role.permissions.has('KICK_MEMBERS') ||
            role.permissions.has('BAN_MEMBERS') ||
            // role.permissions.has('SEND_TTS_MESSAGES') ||
            role.permissions.has('MANAGE_MESSAGES') ||
            role.permissions.has('MANAGE_ROLES') ||
            role.permissions.has('MANAGE_GUILD') ||
            role.permissions.has('MANAGE_EMOJIS') ||
            role.permissions.has('MANAGE_WEBHOOKS') ||
            role.permissions.has('MANAGE_NICKNAMES') ||
            role.permissions.has('MANAGE_CHANNELS');

        if (message.member.hasPermission(['MANAGE_ROLES'])) {
            isAdmin = true;
        }

        if (message.mentions.users.size) {
            hasMentions = true;
        }

        let roleNames = hasMentions ? args.slice(1) : args;
        if (!roleNames.length) {
            return messageErrorAsync(
                message,
                'Specify a role!',
                `<@!${message.author.id}>, specify a role!`
            );
        } else if (roleNames.length === 1) {
            roleNamesSet = new Set(roleNames);
        } else {
            roleNames = roleNames.join(' ').split(', ');
            roleNamesSet = new Set(roleNames);
        }

        let mentionedUser = message.mentions.users.first() || message.author.id;
        roleNamesSet.forEach((roleName) => {
            // Check if the role exists on the server
            let guildRole = message.guild.roles.cache.find(
                (role) => role.name.toLowerCase() === roleName.toLowerCase()
            );
            if (!guildRole) {
                return unidentifiedRoles.push(roleName);
            }

            // Check if there is a  mentionedUser
            roleMember = message.guild.member(mentionedUser);

            if (!roleMember) {
                return messageErrorAsync(
                    message,
                    'No such member found!',
                    `<@!${message.author.id}>, no such member found!`
                );
            }

            // Check if the user doesn't have that role
            const doesntHaveTheRole = roleMember.roles.cache.find(
                (memberRole) => memberRole.name === guildRole.name
            );
            if (!doesntHaveTheRole)
                return messageErrorAsync(
                    message,
                    `<@${roleMember.id}> doesn't have **${guildRole.name}** role`,
                    `<@${message.author.id}>, <@${roleMember.id}> doesn't have **${guildRole.name}** role`
                );

            // Check if the role is non-removeable
            if (checkRolePermission(guildRole) && isAdmin) {
                return nonRemoveableRoles.push(guildRole.name);
            }

            memberRoles.push(guildRole);
            removedRoles.push(guildRole.name);
        });

        try {
            memberRoles.forEach((role) => {
                roleMember.roles.remove(role);
                updatedWithRole += 1;
            });
            // ! Deprecated the notification for the updated user to avoid unecessary notifications
            // memberErrorAsync(
            //     message,
            //     roleMember,
            //     `Removed roles: **${removedRoles.join(', ') || null}**\nNon-removable roles: **${
            //         nonRemoveableRoles.join(', ') || null
            //     }**\nUnidentified roles: **${unidentifiedRoles.join(', ') || null}**`,

            //     `<@!${mentionedUser.id}>,\nRemoved roles: **${
            //         removedRoles.join(', ') || null
            //     }**\nNon-removable roles: **${
            //         nonRemoveableRoles.join(', ') || null
            //     }**\nUnidentified roles: **${unidentifiedRoles.join(', ') || null}**`
            // );

            if (nonRemoveableRoles.length) {
                return messageErrorAsync(
                    message,
                    `You can\'t remove privilieged roles \`${nonRemoveableRoles.join(
                        ', '
                    )}\` from <@${roleMember.user.id}>`,
                    `You can\'t remove privilieged roles \`${nonRemoveableRoles.join(
                        ', '
                    )}\` from <@${roleMember.user.id}>`
                );
            }

            // ! Enable this after the Neogcamp initiative ends
            // if (updatedWithRole > 0) await updateMember(message, roleMember);
        } catch (error) {
            console.error(error);
            return messageErrorAsync(
                message,
                `Error occured in removeRole command: ${error.message}`,
                `<@!${message.author.id}>, Error occured in removeRole command: ${error.message}`
            );
        }
    },
};
