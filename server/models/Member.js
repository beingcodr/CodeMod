const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema(
    {
        entity: { type: String, required: true },
        discordId: { type: String, required: true },
        discriminator: { type: String, required: true },
        username: { type: String, required: true },
        nickName: { type: String },
        avatar: { type: String },
        server: { type: String, required: true },
        roles: [{ type: String }],
        level: { type: Number, required: true },
        levelUp: { type: Number, required: true },
        totalPoints: { type: Number, required: true },
        joinedAt: { type: String, required: true },
        warn: [
            {
                warnedBy: { type: String, required: true },
                warnedOnChannel: { type: String, required: true },
                warnedFor: { type: String, required: true },
            },
            { timestamps: true },
        ],
        points: {
            contribution: { type: Number, required: true },
            error: { type: Number, required: true },
            doubt: { type: Number, required: true },
            resource: { type: Number, required: true },
            slang: { type: Number, required: true },
            spam: { type: Number, required: true },
            abuse: { type: Number, required: true },
            rage: { type: Number, required: true },
        },
    },
    { timestamps: true }
);

module.exports = new mongoose.model('Member', memberSchema);
