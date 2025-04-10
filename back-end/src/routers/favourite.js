const FavoriteProd = require('../controllers/favourite-controller');
// const auth = require('../middlewares/auth');
// const dpopAuth = require("../middlewares/dpop-validate");

function connectRoutes(router) {
    router.post('/favorite/product', FavoriteProd.create);
}

module.exports.connect = connectRoutes;
