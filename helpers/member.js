const Member = require('../server/models/Member');
const { messageErrorAsync, memberErrorAsync, deleteMessage } = require('../helpers/message');

const calculateMember = (message) => {
    let botCount = 0;
    message.guild.members.cache.forEach((member) => {
        if (member.user.bot) {
            botCount += 1;
        }
    });
    return botCount;
};

const addMember = async (message, reason) => {
    deleteMessage(message, 0);
    let botCount = calculateMember(message);
    let returnedMember = await Member.findOne({
        discordSlug: `${message.author.id}${message.guild.id}`,
    });
    if (returnedMember) {
        messageErrorAsync(
            message,
            "You're already in the database. Update your details with `update` command",
            `**<@!${message.author.id}> you're already in the database. Update your details with \`update\` command.**`
        );
        return { success: false, message: ' ' };
    }

    let newUser = new Member({
        entity: 'Member',
        discordId: message.author.id,
        discordSlug: `${message.author.id}${message.guild.id}`,
        discriminator: `#${message.author.discriminator}`,
        username: message.author.username,
        nickName: message.member.nickname,
        avatar: message.author.avatarURL(),
        server: message.guild.name,
        serverDetails: {
            serverId: message.guild.id,
            serverName: message.guild.name,
            memberCount: message.guild.memberCount - botCount,
            botCount: botCount,
            joinedAt: message.guild.joinedAt,
        },
        addedBy: reason,
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
};

const addMemberEvent = async (member, reason) => {
    let returnedMember = await Member.findOne({
        discordSlug: `${member.user.id}${member.guild.id}`,
    });
    if (returnedMember) {
        return memberErrorAsync(
            {},
            member,
            "You're already in the database. Update your details with `update` command",
            `**<@!${member.user.id}> you're already in the database. Update your details with \`update\` command.**`
        );
    }

    let botCount = calculateMember(member);

    let newUser = new Member({
        entity: 'Member',
        discordId: member.user.id,
        discordSlug: `${member.user.id}${member.guild.id}`,
        discriminator: `#${member.user.discriminator}`,
        username: member.user.username,
        nickName: member.nickname,
        avatar: member.user.avatarURL(),
        serverDetails: {
            serverId: member.guild.id,
            serverName: member.guild.name,
            memberCount: member.guild.memberCount - botCount,
            botCount: botCount,
            joinedAt: member.guild.joinedAt,
        },
        addedBy: reason,
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
};

const updateMember = async (message, member) => {
    let botCount = calculateMember(message);

    let returnedMember = await Member.findOne({
        discordSlug: `${member.user.id}${member.guild.id}`,
    });
    if (!returnedMember) {
        returnedMember = await addMemberEvent(member, 'addRole command');
    }

    returnedMember.discordId = member.user.id;
    returnedMember.discordSlug = `${member.user.id}${member.guild.id}`;
    returnedMember.discriminator = `#${member.user.discriminator}`;
    returnedMember.username = member.user.username;
    returnedMember.nickName = member.nickname;
    returnedMember.avatar = member.user.avatarURL();
    returnedMember.serverDetails = {
        serverId: member.guild.id,
        serverName: member.guild.name,
        memberCount: member.guild.memberCount - botCount,
        botCount: botCount,
        joinedAt: member.guild.joinedAt,
    };
    returnedMember.roles = [...member._roles];

    try {
        await returnedMember.save();
        messageErrorAsync(
            message,
            `Successfully updated <@!${member.user.id}>'s details to the database`,
            `**Updated <@!${member.user.id}>'s details in the database.**`
        );
    } catch (error) {
        console.log(error);
        return botChannelAsync(
            message,
            `There was an error while updating <@!${member.user.id}>'s details`
        );
    }
};

module.exports = {
    addMember,
    addMemberEvent,
    updateMember,
};
