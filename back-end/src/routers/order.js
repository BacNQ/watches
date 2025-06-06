const Orders = require('../controllers/order-controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth-middleware')

function connectRoutes(router) {
    router.get('/orders/user', authMiddleware, Orders.getOrderUser);
    router.get('/orders/all', authMiddleware, isAdmin, Orders.getAllOrders);
    router.put('/orders/status', authMiddleware, isAdmin, Orders.updateOrderStatus);
    router.put('/orders/cancel', authMiddleware, isAdmin, Orders.cancelOrder);
    router.get('/orders/invoice/:orderId', authMiddleware, Orders.generateInvoice);
}

module.exports.connect = connectRoutes;
