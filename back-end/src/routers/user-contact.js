const User = require('../controllers/user-contact-controller');
const auth = require('../middlewares/auth-middleware');

function connectRoutes(router) {
    router.get("/user/address", auth , User.searchContacts);
    router.get("/user/address/user", auth , User.loadContactUser);
    router.get("/user/address/id/:id", auth , User.loadContactById);
    router.post("/user/address/add", auth , User.createContact);
    router.put("/user/address/edit/:id", auth , User.updateContact);
    router.delete("/user/address/remove/:id", auth , User.removeContact);
}

module.exports.connect = connectRoutes;
