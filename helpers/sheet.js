module.exports = {
    getByDiscordTag: async (rows, tag) => {
        const user = rows.filter((row) => {
            return row.projectUrls === tag;
        });
        return user;
    },
};
