const FavoriteProd = require('../controllers/favourite-controller');
const auth = require('../middlewares/auth-middleware');

function connectRoutes(router) {
    router.post('/favorite/product', auth, FavoriteProd.create);
    router.get('/favorite/product/user', auth, FavoriteProd.getFavoriteByUser);
    router.get('/favorite/products', auth, FavoriteProd.searchFavorities);
    router.post('/favorite/product/delete', auth, FavoriteProd.deleteByUser);

}

module.exports.connect = connectRoutes;
