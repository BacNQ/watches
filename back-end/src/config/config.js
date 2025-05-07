/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
const { resolve } = require("path");

if (process.env.BROWSER) {
  throw new Error(
    "Do not import `config.js` from inside the client-side code."
  );
}

module.exports = {
  path_images: {
    media: "media/",
    images: "images/",
    category: "images/category/"
  },
  language: {
    en: "en",
    vi: "vi"
  },
  UPLOAD_PATH: "uploads",
  UPLOAD_FOLDER: {
    popularCategories: "popularCategories"
  },
  MAX_UPLOAD_SIZE: 5242880,
};
