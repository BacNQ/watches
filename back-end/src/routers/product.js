const Product = require('../controllers/product-controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth-middleware')

function connectRoutes(router) {
    router.get('/bnq_watches/product/:slug', Product.getProduct);
    router.get('/bnq_watches/products/trending', Product.getProductTrending);
    router.get('/bnq_watches/products/luxury', Product.getProductLuxury);
    router.get('/bnq_watches/search/:keyword', Product.searchProducts);
    router.post('/bnq_watches/create/product', authMiddleware, isAdmin, Product.createProduct);
    router.get('/products', authMiddleware, isAdmin, Product.getAllProducts);
    router.put('/update/products/:id', authMiddleware, isAdmin, Product.updateProduct);
    router.delete('/delete/products/:id', authMiddleware, isAdmin, Product.deleteProduct);
    router.put('/hide/products/:id', authMiddleware, isAdmin, Product.hideProduct);
    router.put('/unhide/products/:id', authMiddleware, isAdmin, Product.unhideProduct);
}

module.exports.connect = connectRoutes;
