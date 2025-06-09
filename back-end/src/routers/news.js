const News = require('../controllers/news-controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth-middleware');

function connectRoutes(router) {
    router.get('/news', authMiddleware, isAdmin, News.getAllNews);
    router.post('/news', authMiddleware, isAdmin, News.createNews);
    router.put('/news/:id', authMiddleware, isAdmin, News.updateNews);
    router.delete('/news/:id', authMiddleware, isAdmin, News.deleteNews);
}

module.exports.connect = connectRoutes;
