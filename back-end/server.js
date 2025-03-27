const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbs = require('./src/dbs');
const api = require('./src/api');

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", api);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
