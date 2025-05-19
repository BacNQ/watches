const Mongoose = require('mongoose');
const CitySchema = new Mongoose.Schema({
    id: {
        type: Number,
    },
    name: {
        type: String,  
    },
    state_id: {
        type: Number,
    },
    state_code: {
        type: String,
    },
    country_id: {
        type: Number,
    },
    country_code: {
        type: String,
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    } 

});

module.exports = Mongoose.model('cities', CitySchema, 'cities');
