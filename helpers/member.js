const Member = require('../server/models/Member');
const { messageErrorAsync, memberErrorAsync, deleteMessage } = require('../helpers/message');

module.exports = {
    addMember: async (message) => {
        let returnedMember = await Member.findOne({ discordId: message.author.id });
        if (returnedMember) {
            deleteMessage(message, 0);
            return messageErrorAsync(
                message,
                "You're already in the database. Update your details with `update` command",
                `**<@!${message.author.id}> you're already in the database. Update your details with \`update\` command.**`
            );
        }

        let newUser = new Member({
            entity: 'Member',
            discordId: message.author.id,
            discriminator: `#${message.author.discriminator}`,
            username: message.author.username,
            nickName: message.member.nickname,
            avatar: message.author.avatarURL(),
            server: message.guild.name,
            joinedAt: message.guild.joinedAt,
            warn: [],
            level: 0,
            levelUp: 100,
            totalPoints: 0,
            points: {
                contribution: 0,
                error: 0,
                doubt: 0,
                resource: 0,
                slang: 0,
                spam: 0,
                abuse: 0,
                rage: 0,
            },
            roles: [...message.member._roles],
        });

        try {
            const savedMember = await newUser.save();
            return { success: true, member: savedMember };
        } catch (error) {
            return { success: false };
        }
    },
    addMemberEvent: async (member) => {
        let returnedMember = await Member.findOne({ discordId: member.user.id });
        if (returnedMember) {
            return memberErrorAsync(
                {},
                member,
                "You're already in the database. Update your details with `update` command",
                `**<@!${member.user.id}> you're already in the database. Update your details with \`update\` command.**`
            );
        }

        let newUser = new Member({
            entity: 'Member',
            discordId: member.user.id,
            discriminator: `#${member.user.discriminator}`,
            username: member.user.username,
            nickName: member.nickname,
            avatar: member.user.avatarURL(),
            server: member.guild.name,
            joinedAt: member.guild.joinedAt,
            warn: [],
            level: 0,
            levelUp: 100,
            totalPoints: 0,
            points: {
                contribution: 0,
                error: 0,
                doubt: 0,
                resource: 0,
                slang: 0,
                spam: 0,
                abuse: 0,
                rage: 0,
            },
            roles: [...member._roles],
        });

        try {
            const savedMember = await newUser.save();
            return { success: true, member: savedMember };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    },
};
