const Cart = require('../controllers/cart-controller');
const { authMiddleware } = require('../middlewares/auth-middleware')

function connectRoutes(router) {
    router.post('/cart', authMiddleware, Cart.create);
    router.get('/cart/user', authMiddleware, Cart.getCartByUser);
    router.post('/cart/remove', authMiddleware, Cart.removeCart);
    router.post('/cart/remove-all', authMiddleware, Cart.removeAllCart);
}

module.exports.connect = connectRoutes;
