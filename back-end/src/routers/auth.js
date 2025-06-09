const Login = require('../controllers/auth-controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth-middleware')

function connectRoutes(router) {
    router.post('/login', Login.UserLogin);
    router.post('/admin/login', Login.AdminLogin);
    router.post('/admin/register', authMiddleware, isAdmin, Login.createAdmin);
    router.post('/register', Login.UserRegister);
    router.post('/verify-password', Login.UserVerify);
    router.post('/forgot-password', Login.UserForgot);
    router.get('/info-user', authMiddleware, Login.getInfoUser);
    router.put('/session/update', authMiddleware, Login.updateProfile);
    router.put('/session/password', authMiddleware, Login.updatePassword);
    router.get('/get/accounts', authMiddleware, isAdmin, Login.getAllUsers);
    router.post('/create/accounts', authMiddleware, isAdmin, Login.createAccount);
    router.put('/lock-account', authMiddleware, isAdmin, Login.lockAccount);
}

module.exports.connect = connectRoutes;
