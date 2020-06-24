const { messageErrorAsync, memberErrorAsync, deleteMessage } = require('../helpers/message');
const { updateMember } = require('../helpers/member');

module.exports = {
    name: 'addRole',
    description: 'This command allows the admins to assign roles to the members',
    guildOnly: true,
    // adminOnly: true,
    usage: '@username <role name>',
    aliases: ['addrole', 'arole'],
    execute: async (message, args) => {
        deleteMessage(message, 0);
        let isAdmin = false;
        let hasMentions = false;
        let unidentifiedRoles = [];
        let nonSelfAssignableRoles = [];
        let assignedRoles = [];
        let memberRoles = [];
        let roleMember = {};
        let checkRolePermission = (role) =>
            role.permissions.has('ADMINISTRATOR') ||
            role.permissions.has('KICK_MEMBERS') ||
            role.permissions.has('BAN_MEMBERS') ||
            role.permissions.has('MANAGE_ROLES') ||
            role.permissions.has('MANAGE_GUILD') ||
            role.permissions.has('MANAGE_CHANNELS');

        if (message.member.hasPermission(['MANAGE_ROLES'])) {
            isAdmin = true;
        }

        console.log(message.mentions);
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

        let mentionedUser = message.mentions.users.first();
        roleNamesSet.forEach((roleName) => {
            // Check if the role exists on the server
            let guildRole = message.guild.roles.cache.find(
                (role) => role.name.toLowerCase() === roleName.toLowerCase()
            );
            if (!guildRole) {
                return unidentifiedRoles.push(roleName);
            }

            // Check if the member has that role
            roleMember = hasMentions
                ? message.guild.member(mentionedUser)
                : message.guild.member(message.author);
            if (!roleMember) {
                return messageErrorAsync(
                    message,
                    'No such member found!',
                    `<@!${message.author.id}>, no such member found!`
                );
            }
            if (roleMember.roles.cache.has(guildRole)) {
                return memberRoles.push(guildRole.name);
            }

            if (checkRolePermission(guildRole) && !isAdmin) {
                return nonSelfAssignableRoles.push(guildRole.name);
            }

            memberRoles.push(guildRole);
            assignedRoles.push(guildRole.name);
        });

        try {
            memberRoles.forEach((role) => {
                roleMember.roles.add(role);
            });
            console.log(assignedRoles);
            console.log(nonSelfAssignableRoles);
            console.log(unidentifiedRoles);
            memberErrorAsync(
                message,
                roleMember,
                `Assigned roles: **${assignedRoles.join(', ') || null}**\nNon-assignable roles: **${
                    nonSelfAssignableRoles.join(', ') || null
                }**\nUnidentified: **${unidentifiedRoles.join(', ') || null}**`,

                `<@!${roleMember.user.id}>,\nAssigned roles: **${
                    assignedRoles.join(', ') || null
                }**\nNon-assignable roles: **${
                    nonSelfAssignableRoles.join(', ') || null
                }**\nUnidentified: **${unidentifiedRoles.join(', ') || null}**`
            );

            await updateMember(message, roleMember);
        } catch (error) {
            console.log(error);
            return messageErrorAsync(
                message,
                `There was an error while adding role`,
                `<@!${message.author.id}>, there was an error while adding role`
            );
        }
    },
};

/* 
1. Check if there is any mentioned user.
2. If(!mentionedUser) then assign the passed roles to the message.author after checking if the roles are valid and can be added to a member
3. If(mentionedUser) then add the passed roles to that user after checking if the author has permissions to do so

*/
