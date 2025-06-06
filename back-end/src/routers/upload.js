const Upload = require('../controllers/upload-controller');
const { authMiddleware } = require('../middlewares/auth-middleware')

function connectRoutes(router) {
    router.post('/upload/image', authMiddleware, Upload.uploadImages);
}

module.exports.connect = connectRoutes;
