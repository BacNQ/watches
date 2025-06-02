const Payment = require('../controllers/payment-controller');
const { authMiddleware } = require('../middlewares/auth-middleware')

function connectRoutes(router) {
    router.post('/create-zalopay-order', authMiddleware, Payment.paymentByZaloPay);
    router.post('/zalopay/callback', Payment.zaloPayCallback);
}

module.exports.connect = connectRoutes;
