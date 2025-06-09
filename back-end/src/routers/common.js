const Dashboard = require('../controllers/common-controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth-middleware')

function connectRoutes(router) {
    router.get('/stats', authMiddleware, isAdmin, Dashboard.getDashboardStats);
    router.get('/revenue/by-day', authMiddleware, isAdmin, Dashboard.getRevenueByDay);
    router.get('/revenue/by-month', authMiddleware, isAdmin, Dashboard.getRevenueByMonth);
    router.get('/order-by-status', authMiddleware, isAdmin, Dashboard.getOrderByStatus);
    router.get('/top-products', authMiddleware, isAdmin, Dashboard.getTopSoldProducts);
    router.get('/low-stock', authMiddleware, isAdmin, Dashboard.getLowStockProducts);
    router.get('/orders/recent', authMiddleware, isAdmin, Dashboard.getRecentOrders);
}

module.exports.connect = connectRoutes;
