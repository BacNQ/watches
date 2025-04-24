const ObjectId = require('mongodb').ObjectId;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
    slug: { type: String,required: true, trim: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    price: { type: Number, required: true },
    description: { type: String },
    url: { type: String, trim: true },
    images: { type: [String] },
    deleted: { type: Boolean, default: false },
    user_id: { type: Schema.Types.ObjectId, required: true },
    created_date: { type: Date, default: Date.now },
});

FavoriteSchema.set('toJSON', { virtuals: true });
FavoriteSchema.set('toObject', { virtuals: true });

FavoriteSchema.index({ slug: 1, user_id: 1 }, { unique: true });
FavoriteSchema.virtual("id").get(function () {
    return this._id ? this._id.toHexString() : "";
});
FavoriteSchema.statics.findById = function (id) {
    return this.findOne({ _id: ObjectId(id) })
        .exec();
};

FavoriteSchema.statics.findPagination = function (query, requestData) {
    const size = Number(requestData.size) > 0 ? Number(requestData.size) : 20;
    const page = Number(requestData.page) > 0 ? Number(requestData.page) : 1;
    const sortBy = requestData.sortBy || {};
    return this.find(query)
        .sort(sortBy)
        .skip(size * page - size)
        .limit(size)
        .lean()
        .then(products => {
            return this.countDocuments(query).then(count => ({
                results: products || [],
                pagination: {
                    size: Math.ceil(count / size),
                    page,
                    total: count,
                }
            }));
        });
};

module.exports = mongoose.model('favourite', FavoriteSchema);
