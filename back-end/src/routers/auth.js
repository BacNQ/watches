const Login = require('../controllers/auth-controller');
const auth = require('../middlewares/auth-middleware')

function connectRoutes(router) {
    router.post('/login', Login.UserLogin);
    router.post('/register', Login.UserRegister);
    router.post('/verify-password', Login.UserVerify);
    router.post('/forgot-password', Login.UserForgot);
    router.get('/info-user', auth, Login.getInfoUser);
    router.put('/session/update', auth, Login.updateProfile);
    router.put('/session/password', auth, Login.updatePassword);
}

module.exports.connect = connectRoutes;
