module.exports = {
    getByDiscordTag: async (rows, tag) => {
        const user = rows.filter((row) => {
            return row.discordUsername === tag;
        });
        return user;
    },
};
