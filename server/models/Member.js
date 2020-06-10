const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    entity: { type: String, required: true },
    discordId: { type: String, required: true },
    discriminator: { type: String, required: true },
    username: { type: String, required: true },
    nickName: { type: String },
    avatar: { type: String },
    server: { type: String, required: true },
    roles: [{ type: String }],
    level: { type: Number, required: true },
    totalPoints: { type: Number, required: true },
    joinedAt: { type: String, required: true },
    points: {
        contribution: { type: Number, required: true },
        codeError: { type: Number, required: true },
        verbalDoubt: { type: Number, required: true },
        codeDoubt: { type: Number, required: true },
        sharedResource: { type: Number, required: true },
        slangUsed: { type: Number, required: true },
    },
});

module.exports = new mongoose.model('Member', memberSchema);
