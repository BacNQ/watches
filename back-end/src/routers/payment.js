const Payment = require('../controllers/payment-controller');
const auth = require('../middlewares/auth-middleware');

function connectRoutes(router) {
    router.post('/create-zalopay-order', auth, Payment.createZaloPay);
}

module.exports.connect = connectRoutes;
