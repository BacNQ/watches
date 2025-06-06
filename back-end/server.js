const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require('./src/db/connect');
const path = require('path');
const api = require('./src/api');

const app = express();
db();
app.use(cors());
app.use(express.json());

app.use("/api", api);
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
