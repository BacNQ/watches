const Product = require('../controllers/product-controller');
const { authMiddleware } = require('../middlewares/auth-middleware')

function connectRoutes(router) {
    router.get('/bnq_watches/product/:slug', Product.getProduct);
    router.get('/bnq_watches/products/trending', Product.getProductTrending);
    router.get('/bnq_watches/products/luxury', Product.getProductLuxury);
    router.get('/bnq_watches/search/:keyword', Product.searchProducts);
    router.post('/bnq_watches/create/product', authMiddleware, Product.createProduct);
}

module.exports.connect = connectRoutes;
