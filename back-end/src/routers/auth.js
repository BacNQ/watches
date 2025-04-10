const Login = require('../controllers/auth-controller');
const auth = require('../middlewares/auth-middleware')

function connectRoutes(router) {
    router.post('/login', Login.UserLogin);
    router.post('/register', Login.UserRegister);
    router.post('/verify-password', Login.UserVerify);
    router.post('/forgot-password', Login.UserForgot);
    router.get('/info-user', auth, Login.getInfoUser);
}

module.exports.connect = connectRoutes;
