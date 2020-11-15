const { messageErrorAsync, memberErrorAsync, deleteMessage } = require('../helpers/message');
const { updateMember } = require('../helpers/member');

module.exports = {
    name: 'addRole',
    description: 'This command allows the admins to assign single/multiple roles to the members',
    guildOnly: true,
    usage: `@username <role name>\` OR \`/addRole @username <rolename1, role name2,..., role namen>`,
    aliases: ['addrole', 'arole'],
    execute: async (message, args) => {
        deleteMessage(message, 0);
        let updatedWithRole = 0;
        let isAdmin = false;
        let hasMentions = false;
        let unidentifiedRoles = [];
        let nonSelfAssignableRoles = [];
        let assignedRoles = [];
        let memberRoles = [];
        let roleMember = {};
        let mentionedUser = message.mentions.users.first() || message.author;
        let checkRolePermission = (role) =>
            role.permissions.has('ADMINISTRATOR') ||
            role.permissions.has('KICK_MEMBERS') ||
            role.permissions.has('BAN_MEMBERS') ||
            role.permissions.has('SEND_TTS_MESSAGES') ||
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
            roleNames = roleNames.join('').split(',');
            roleNamesSet = new Set(roleNames);
        } else {
            roleNames = roleNames.join('').split(',');
            roleNamesSet = new Set(roleNames);
        }

        roleNamesSet.forEach((roleName) => {
            // Check if the role exists on the server
            let guildRole = message.guild.roles.cache.find(
                (role) => role.name.toLowerCase() === roleName.toLowerCase()
            );
            if (!guildRole) {
                return unidentifiedRoles.push(roleName);
            }

            // Check if the mentionedUser is a valid member
            roleMember = message.guild.member(mentionedUser);

            if (!roleMember) {
                return messageErrorAsync(
                    message,
                    'No such member found!',
                    `<@!${message.author.id}>, no such member found!`
                );
            }

            const alreadyHasTheRole = roleMember.roles.cache.find(
                (memberRole) => memberRole.name === guildRole.name
            );
            if (alreadyHasTheRole)
                return messageErrorAsync(
                    message,
                    `<@${roleMember.id}> already has **${guildRole.name}** role`,
                    `<@${message.author.id}>, <@${roleMember.id}> already has **${guildRole.name}** role`
                );

            // Check if the role is self-assignable if not push them into the array
            if (checkRolePermission(guildRole) && !isAdmin) {
                return nonSelfAssignableRoles.push(guildRole.name);
            }

            memberRoles.push(guildRole);
            assignedRoles.push(guildRole.name);
        });

        try {
            memberRoles.forEach((role) => {
                roleMember.roles.add(role);
                updatedWithRole += 1;
            });
            // ! Deprecated the notification for the updated user to avoid unecessary notifications
            // memberErrorAsync(
            //     message,
            //     roleMember,
            //     `Assigned roles: **${assignedRoles.join(', ') || null}**\nNon-assignable roles: **${
            //         nonSelfAssignableRoles.join(', ') || null
            //     }**\nUnidentified roles: **${unidentifiedRoles.join(', ') || null}**`,
            //     `<@!${mentionedUser.id}>,\nAssigned roles: **${
            //         assignedRoles.join(', ') || null
            //     }**\nNon-assignable roles: **${
            //         nonSelfAssignableRoles.join(', ') || null
            //     }**\nUnidentified roles: **${unidentifiedRoles.join(', ') || null}**`
            // );

            // ! Enable this after the Neogcamp initiative ends
            // if (updatedWithRole > 0) await updateMember(message, roleMember);
        } catch (error) {
            console.error(error);
            return messageErrorAsync(
                message,
                `Error occured in addRole command: ${error.message}`,
                `<@!${message.author.id}>, Error occured in addRole command: ${error.message}`
            );
        }
    },
};
