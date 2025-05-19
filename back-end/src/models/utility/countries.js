const Mongoose = require('mongoose');
const DistrictSchema = new Mongoose.Schema({
    id: {
        type: Number,
    },
    name: {
        type: String,  
    },
    iso3: {
        type: String,  
    },
    iso2: {
        type: String,  
    },
    phone_code: {
        type: String,  
    },
    capital: {
        type: String,  
    },
    currency: {
        type: String,  
    },
    emoji: {
        type: String,  
    },
    emojiU: {
        type: String,  
    },
});

module.exports = Mongoose.model('countries', DistrictSchema, 'countries');
