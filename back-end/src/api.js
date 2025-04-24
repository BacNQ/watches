const express = require("express");
const router = express.Router();

require("./routers/product").connect(router);
require("./routers/favourite").connect(router);
require("./routers/cart").connect(router);
require("./routers/auth").connect(router);
require("./routers/categories").connect(router);

module.exports = router;
