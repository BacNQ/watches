const express = require("express");
const router = express.Router();

require("./routers/product").connect(router);
require("./routers/favourite").connect(router);
require("./routers/cart").connect(router);
require("./routers/auth").connect(router);
require("./routers/categories").connect(router);
require("./routers/user-contact").connect(router);
require("./routers/payment").connect(router);
require("./routers/utility").connect(router);
require("./routers/order").connect(router);
require("./routers/upload").connect(router);
require("./routers/news").connect(router);
require("./routers/common").connect(router);

module.exports = router;
