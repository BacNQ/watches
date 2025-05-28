const ObjectId = require('mongodb').ObjectId;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    code: { type: String, trim: true },
    slug: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    qty: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
    description: { type: String },
    images: { type: [String] },
    user_id: { type: Schema.Types.ObjectId },
    deleted: { type: Boolean, default: false },
    sold_out: { type: Boolean, default: false },
    created_date: { type: Date, default: Date.now },
});

CartSchema.set('toJSON', {
    virtuals: true
});

CartSchema.set('toObject', {
    virtuals: true
});

CartSchema.virtual("id").get(function () {
    return this._id ? this._id.toHexString() : "";
});

CartSchema.statics.findById = function (id) {
    return this.findOne({ _id: ObjectId(id) })
        .exec();
};

module.exports = mongoose.model('carts', CartSchema);
