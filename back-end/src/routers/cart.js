const Cart = require('../controllers/cart-controller');
const auth = require('../middlewares/auth-middleware');

function connectRoutes(router) {
    router.post('/cart', auth, Cart.create);
    router.get('/cart/user', auth, Cart.getCartByUser);
    router.post('/cart/remove', auth, Cart.removeCart);
    router.post('/cart/remove-all', auth, Cart.removeAllCart);
}

module.exports.connect = connectRoutes;
