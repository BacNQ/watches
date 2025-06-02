const User = require('../controllers/user-contact-controller');
const { authMiddleware } = require('../middlewares/auth-middleware')

function connectRoutes(router) {
    router.get("/user/address", authMiddleware , User.searchContacts);
    router.get("/user/address/user", authMiddleware , User.loadContactUser);
    router.get("/user/address/id/:id", authMiddleware , User.loadContactById);
    router.post("/user/address/add", authMiddleware , User.createContact);
    router.put("/user/address/edit/:id", authMiddleware , User.updateContact);
    router.delete("/user/address/remove/:id", authMiddleware , User.removeContact);
}

module.exports.connect = connectRoutes;
