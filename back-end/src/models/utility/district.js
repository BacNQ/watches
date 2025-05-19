const Mongoose = require('mongoose');
const DistrictSchema = new Mongoose.Schema({
    id: {
        type: Number,
    },
    provinceId: {
        type: Number,
    },
    name: {
        type: String,  
    },
    type: {
        type: String,
    }, 
    deleted: {
        type: Boolean, default: false
    },
    updated_date: { type: Date, default: Date.now },
    created_date: { type: Date, default: Date.now },
});

DistrictSchema.statics.findPagination = function(query, model) {
    const size = Number(model.size) > 0 ? Number(model.size) : 20;
    const page = Number(model.page) > 0 ? Number(model.page) : 1;
    const sortBy = model.sortBy || {name: 1};
    return this.find(query)
    .sort(sortBy)
    .skip(size * page - size)
    .limit(size)
    .then(districts => {
        return this.countDocuments(query).then(count => ({
            results: districts || [],
            pagination: {
                size: Math.ceil(count / size),
                page,
                total: count,
            }
        }));
    });
  };

module.exports = Mongoose.model('districts', DistrictSchema, 'districts');
