const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    thumbnail: { type: String, default: "" },
    images: { type: [String], default: [] },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    tags: [String],
    category: {
        type: String,
        enum: ['review', 'huongdan', 'tintuc', 'khac'],
        default: 'tintuc',
    },
    status: { type: Boolean, default: true },
    views: {
        type: Number,
        default: 0,
    },
    deleted: { type: Boolean, default: false },
}, {
    timestamps: true
});

module.exports = mongoose.model('news', newSchema);
