// Dependencies
const ObjectId = require('mongodb').ObjectId;
const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
// const { DOMAIN } = require("../../config/config");
mongoose.plugin(slug);

const Schema = mongoose.Schema;
const CategorySchema = new Schema({
    lang: { type: String, default: 'vi' },
    // type_code: { type: String, required: true, trim: true },
    category_id: { type: String, required: true, trim: true },
    name: { type: String, required: true },
    name_origin: { type: String },
    url: { type: String },
    slug: { type: String, slug: ["name"], slugPaddingSize: 1 },
    description: { type: String },
    position: { type: Number },
    image: { type: String },
    icon: { type: String },
    parent_id: { type: Schema.Types.ObjectId },
    parent_code: { type: [String] },
    role: { type: String, default: 'customer' },
    root: { type: Boolean, default: false },
    home: { type: Boolean, default: false },
    main: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    primary: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date }
});

CategorySchema.index({ /*type_code: 1,*/ category_id: 1 }, { unique: true });

CategorySchema.virtual('id').get(function () {
    return this._id ? this._id.toHexString() : null;
});

// Ensure virtual fields are serialised.
CategorySchema.set('toJSON', {
    virtuals: true
});

CategorySchema.set('toObject', {
    virtuals: true
});

CategorySchema.virtual('parent', {
    ref: 'categories',
    localField: 'parent_code',
    foreignField: 'category_id',
    justOne: true,
});

CategorySchema.virtual('childrens', {
    ref: 'categories',
    localField: 'category_id',
    foreignField: 'parent_code'
});

CategorySchema.virtual('img_url').get(function () {
    return this.image ? `http://localhost:3000/${this.image}` : null;
});

CategorySchema.statics.findById = function (id) {
    return this.findOne({ _id: new ObjectId(id) })
        .exec();
};

CategorySchema.statics.findBySlug = function (slug) {
    return this.find({ slug: slug })
        .exec();
};

CategorySchema.statics.findByParent = function (parent_id) {
    parent_id = parent_id ? new ObjectId(parent_id) : null;
    return this.find({ parent_id })
        .exec();
};

CategorySchema.statics.findPagination = function (query, requestData) {
    const size = Number(requestData.size) > 0 && Number(requestData.size) < 100 ? Number(requestData.size) : 20;
    const page = Number(requestData.page) > 0 ? Number(requestData.page) : 1;
    const sortBy = requestData.sortBy || {};
    return this.find(query)
        .sort(sortBy)
        .skip(size * page - size)
        .limit(size)
        .populate({ path: 'parent', select: '_id name' })
        .then(categories => {
            return this.countDocuments(query).then(count => ({
                results: categories || [],
                pagination: {
                    size: Math.ceil(count / size),
                    page,
                    total: count,
                }
            }));
        });
};

module.exports = mongoose.model('categories', CategorySchema);
