const express = require("express");
const router = express.Router();

require("./routers/product").connect(router);

module.exports = router;
