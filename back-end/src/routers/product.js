const Product = require('../controllers/product-controller');
// const auth = require('../middlewares/auth');
// const dpopAuth = require("../middlewares/dpop-validate");

function connectRoutes(router) {
    router.get('/bnq_watches/product/:slug', Product.getProduct);
}

module.exports.connect = connectRoutes;
