const Product = require('../controllers/product-controller');

function connectRoutes(router) {
    router.get('/bnq_watches/product/:slug', Product.getProduct);
    router.get('/bnq_watches/products/trending', Product.getProductTrending);
    router.get('/bnq_watches/products/luxury', Product.getProductLuxury);
}

module.exports.connect = connectRoutes;
