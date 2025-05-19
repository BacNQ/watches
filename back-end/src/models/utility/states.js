const Mongoose = require('mongoose');
const StateSchema = new Mongoose.Schema({
    id: {
        type: Number,
    },
    name: {
        type: String,  
    },
    country_id: {
        type: Number,
    },
    country_code: {
        type: String,
    },
    state_code: {
        type: String,
    } 

});

module.exports = Mongoose.model('states', StateSchema, 'states');
