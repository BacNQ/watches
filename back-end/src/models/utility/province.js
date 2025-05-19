const Mongoose = require('mongoose');


const ProvinceSchema = new Mongoose.Schema({
    id: {
        type: Number,
    },
    countryId: {
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

module.exports = Mongoose.model('provinces', ProvinceSchema, 'provinces');
