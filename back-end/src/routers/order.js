const Orders = require('../controllers/order-controller');
const { authMiddleware } = require('../middlewares/auth-middleware')

function connectRoutes(router) {
    router.get('/orders/user', authMiddleware, Orders.getOrderUser);
}

module.exports.connect = connectRoutes;
