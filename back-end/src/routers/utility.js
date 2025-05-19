const Utility = require('../controllers/utility-controller');

function connectRoutes(router) {
    router.get('/utility/provinces', Utility.getProvinces);
    router.get('/utility/district/:id', Utility.getDistrict);
    router.get('/utility/ward/:id', Utility.getWard);
    router.get('/utility/countries', Utility.getCountries);
    router.get('/utility/states/:id', Utility.getStates);
    router.get('/utility/cities/:id', Utility.getCities);
}

module.exports.connect = connectRoutes;
