const Payment = require('../controllers/payment-controller');
const auth = require('../middlewares/auth-middleware');

function connectRoutes(router) {
    router.post('/create-zalopay-order', auth, Payment.paymentByZaloPay);
    router.post('/zalopay/callback', Payment.zaloPayCallback);
}

module.exports.connect = connectRoutes;
