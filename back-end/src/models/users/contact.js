const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const AddressSchema = new Mongoose.Schema({
    user: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    remark: { type: String},
    type: { type: String, enum: ['home', 'office'], default: 'home' },
    primary: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

AddressSchema.virtual("id").get(function() {
    return this._id ? this._id.toHexString() : "";
});

AddressSchema.statics.findPagination = function(query, requestData) {
    const size = Number(requestData.size) > 0 ? Number(requestData.size) : 20;
    const page = Number(requestData.page) > 0 ? Number(requestData.page) : 1;
    const sortBy = requestData.sortBy || {};
    return this.find({...query, user_id: { $exists: true }})
    .sort(sortBy)
    .skip(size * page - size)
    .limit(size)
    .then(quotes => {
        return this.countDocuments(query).then(count => ({
            results: quotes || [],
            pagination: {
                size: Math.ceil(count / size),
                page,
                total: count,
            }
        }));
    });
};

module.exports = Mongoose.model("address", AddressSchema);

