const Member = require('../server/models/Member');
const Server = require('../server/models/Server');
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
    let returnedServer = await Server.findOne({ serverId: message.guild.id });
    if (!returnedServer) {
        messageErrorAsync(
            message,
            'The server is not registered. Please register it first with `/addserver` command',
            `<@!${message.author.id}> the server is not registered. Please register it first with \`/addserver\` command`
        );
        return { success: false, message: ' ' };
    }
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
        serverId: returnedServer._id,
        discordSlug: `${message.author.id}${message.guild.id}`,
        discriminator: `#${message.author.discriminator}`,
        username: message.author.username,
        nickName: message.member.nickname,
        avatar: message.author.avatarURL(),
        joinedAt: message.guild.joinedAt,
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
        returnedServer.members.push(savedMember.id);
        await returnedServer.save();
        return { success: true, member: savedMember };
    } catch (error) {
        return { success: false };
    }
};

const addMentionedMember = async (message, reason) => {
    deleteMessage(message, 0);
    let returnedServer = await Server.findOne({ serverId: message.guild.id });
    if (!returnedServer) {
        messageErrorAsync(
            message,
            'The server is not registered. Please register it first with `/addserver` command',
            `<@!${message.author.id}> the server is not registered. Please register it first with \`/addserver\` command`
        );
        return { success: false, message: ' ' };
    }
    let mentionedMember = message.guild.member(message.mentions.users.first());
    if (!mentionedMember) return { success: false };
    
    let returnedMember = await Member.findOne({
        discordSlug: `${mentionedMember.user.id}${mentionedMember.guild.id}`,
    });
    if (returnedMember) {
        messageErrorAsync(
            message,
            `<@${mentionedMember.user.id}> is already in the database`,
            `**<@${mentionedMember.user.id}> is already in the database.**`
        );
        return { success: false, message: ' ' };
    }

    let newUser = new Member({
        entity: 'Member',
        discordId: mentionedMember.user.id,
        serverId: returnedServer._id,
        discordSlug: `${mentionedMember.user.id}${mentionedMember.guild.id}`,
        discriminator: `#${mentionedMember.user.discriminator}`,
        username: mentionedMember.user.username,
        nickName: mentionedMember.nickname,
        avatar: mentionedMember.user.avatarURL(),
        joinedAt: mentionedMember.guild.joinedAt,
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
        roles: [...mentionedMember._roles],
    });

    try {
        const savedMember = await newUser.save();
        returnedServer.members.push(savedMember.id);
        await returnedServer.save();
        return { success: true, member: savedMember };
    } catch (error) {
        return { success: false };
    }
};

const addMemberEvent = async (member, reason) => {
    let returnedServer = await Server.findOne({ serverId: member.guild.id });
    if (!returnedServer) {
        memberErrorAsync(
            member,
            'The server is not registered. Please register it first with `/addserver` command',
            `<@!${member.user.id}> the server is not registered. Please register it first with \`/addserver\` command`
        );
        return { success: false, message: ' ' };
    }
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

    let newUser = new Member({
        entity: 'Member',
        discordId: member.user.id,
        serverId: returnedServer._id,
        discordSlug: `${member.user.id}${member.guild.id}`,
        discriminator: `#${member.user.discriminator}`,
        username: member.user.username,
        nickName: member.nickname,
        avatar: member.user.avatarURL(),
        joinedAt: member.guild.joinedAt,
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
        returnedServer.members.push(savedMember.id);
        await returnedServer.save();
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

const addServer = async (message) => {
    const returnedServer = await Server.findOne({ serverId: message.guild.id });
    if (returnedServer) {
        messageErrorAsync(
            message,
            'This server is already registered',
            `<@${message.author.id}>, this server is already registered`
        );
        return { success: false, message: 'Server is already registered' };
    }

    let botCountResult = calculateMember(message);

    const newServer = new Server({
        serverId: message.guild.id,
        name: message.guild.name,
        region: message.guild.region,
        icon: message.guild.iconURL(),
        memberCount: message.guild.memberCount - botCountResult,
        botCount: botCountResult,
        serverCreatedAt: message.guild.createdAt,
        members: [],
    });

    try {
        await newServer.save();
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
};

module.exports = {
    addMember,
    addMentionedMember,
    addMemberEvent,
    addServer,
    updateMember,
};
