const FavoriteProd = require('../controllers/favourite-controller');
const { authMiddleware } = require('../middlewares/auth-middleware')

function connectRoutes(router) {
    router.post('/favorite/product', authMiddleware, FavoriteProd.create);
    router.get('/favorite/product/user', authMiddleware, FavoriteProd.getFavoriteByUser);
    router.get('/favorite/products', authMiddleware, FavoriteProd.searchFavorities);
    router.post('/favorite/product/delete', authMiddleware, FavoriteProd.deleteByUser);

}

module.exports.connect = connectRoutes;
