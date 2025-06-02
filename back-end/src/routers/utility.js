const Utility = require('../controllers/utility-controller');

function connectRoutes(router) {
    router.get('/utility/provinces', Utility.getProvinces);
    router.get('/utility/districts', Utility.getDistrict);
    router.post('/utility/districts', Utility.getDistrict);
    router.get('/utility/wards', Utility.getWard);
    router.post('/utility/wards', Utility.getWard);
    router.get('/utility/shop', Utility.getShop);
    router.post('/utility/services', Utility.getService);
    router.post('/calculate-fee', Utility.calculateFee);
}

module.exports.connect = connectRoutes;
