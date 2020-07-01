const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serverSchema = new Schema(
    {
        name: { type: String, required: true },
        serverId: { type: String, required: true },
        region: { type: String, required: true },
        icon: { type: String, required: true },
        memberCount: { type: Number, required: true, default: 0 },
        botCount: { type: Number, required: true, default: 0 },
        members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
        serverCreatedAt: { type: Date, required: true, default: Date.now() },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Server', serverSchema);
