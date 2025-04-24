const auth = require('../middlewares/auth-middleware');
const Category = require('../controllers/categories-controller');

function connectRoutes(router) {
    router.get('/categories', Category.searchCategories);
    router.get('/category/tops', Category.getTopCategories);
    router.get('/category/home', Category.getHomeCategories);
    router.get('/category/get', Category.getCategories);
    router.get('/category/main', Category.getCategoryMain);
    router.get('/category/tree', Category.getCategoryTree);
    router.get('/category/parent/:id', Category.getByParent);
    router.get('/category/id/:id', Category.getCategoryById);
    router.post('/category', auth, Category.addCategory);
    router.put('/category/:id', auth, Category.updateCategory);
    router.delete('/category/:id', auth, Category.deleteCategory);
}


module.exports.connect = connectRoutes;
