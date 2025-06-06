const ObjectId = require('mongodb').ObjectId;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ProductSchema = new Schema({
    slug: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    code: {type: Number, trim: true},
    url: { type: String, trim: true },
    price_current: { type: Number, required: true },
    price_old: { type: Number },
    discount: { type: Number },
    rating: { type: Number },
    stock_status: { type: String },
    sold: { type: Number },
    stock: { type: Number },
    description: { type: String },
    brand: { type: String },
    origin: { type: String },
    specifics: [
        mongoose.Schema.Types.Mixed
    ],
    images: { type: [String] },
    thumbnails: { type: [String] },
    related: [
        {
            slug: { type: String },
            image: { type: String },
            stock_status: { type: String }
        }
    ],
    deleted: { type: Boolean, default: false },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
});

ProductSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

ProductSchema.set('toJSON', {
    virtuals: true
});

ProductSchema.set('toObject', {
    virtuals: true
});

ProductSchema.plugin(AutoIncrement, { inc_field: 'code' });

ProductSchema.statics.findById = function (id) {
    return this.findOne({ _id: ObjectId(id) })
        .exec();
};

ProductSchema.statics.findPagination = function (query, requestData) {
    const size = Number(requestData.size) > 0 ? Number(requestData.size) : 20;
    const page = Number(requestData.page) > 0 ? Number(requestData.page) : 1;
    const sortBy = requestData.sortBy || {};
    return this.find(query)
        .sort(sortBy)
        .skip(size * page - size)
        .limit(size)
        .populate({ path: 'categories', select: '_id name icon image' })
        .populate({ path: 'brand', select: '_id name icon image' })
        .then(products => {
            return this.countDocuments(query).then(count => ({
                results: products || [],
                pagination: {
                    size: size,
                    page: page,
                    total: count,
                }
            }));
        });
};

module.exports = mongoose.model('products', ProductSchema);
