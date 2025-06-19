const Comments = require('../controllers/comments-controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth-middleware')

function connectRoutes(router) {
    router.get('/comments/:product_id', Comments.getComments);
    router.post('/add/comments/:product_id', authMiddleware, Comments.addComment);
    router.put('/comments/:comment_id', authMiddleware, Comments.editComment);
    router.delete('/comments/:comment_id', authMiddleware, Comments.deleteComment);
}

module.exports.connect = connectRoutes;
