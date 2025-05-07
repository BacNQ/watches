/* eslint-disable default-case */
/* eslint-disable camelcase */
const multer = require("multer");
const path = require("path");

const createStorage = (folder = "", name = null) => {
  let ext = null;
  const storage = multer.diskStorage({
    destination: path.resolve(process.cwd(), `media/${folder}`),
    filename(req, file, cb) {
      // Mimetype stores the file type, set extensions according to filetype
      switch (file.mimetype) {
        case "image/jpeg":
          ext = ".jpeg";
          break;
        case "image/png":
          ext = ".png";
          break;
        case "image/jpg":
          ext = ".jpg";
          break;
        case "image/gif":
          ext = ".gif";
          break;
      }
      if(ext) {
        let file_name = name ? name : file.originalname.slice(0, 4) + Date.now() + ext;
            file_name = file_name.toLowerCase();
        cb(null, file_name);
      } else {
        cb(null, file.originalname);
      }
    }
  });
  return storage;
};

const createFileStorage = (img_path = "") => {
  let ext = null;
  const storage = multer.diskStorage({
    destination: path.resolve(process.cwd(), `documents/${img_path}`),
    filename(req, file, cb) {
      // Mimetype stores the file type, set extensions according to filetype
      cb(null, file.originalname);
    }
  });
  return storage;
};

// Check File Type
// eslint-disable-next-line consistent-return
function checkImageType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|doc|pdf|docx|xlxs|xls|txt/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb("Error: File Only!");
}

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /doc|pdf|docx|xlxs|xls|txt/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb("Error: Document Only!");
}

// Upload singple
const upload = (folder, name) => {
  const uploadSingle = multer({
    storage: createStorage(folder, name),
    limits: {
      fileSize: 10000000
    },
    fileFilter(req, file, cb) {
      checkImageType(file, cb);
    }
  });
  return uploadSingle.single("file");
};

const uploadFile = img_path => {
  const uploadSingle = multer({
    storage: createFileStorage(img_path),
    limits: {
      fileSize: 10000000
    },
    fileFilter(req, file, cb) {
      checkFileType(file, cb);
    }
  });
  return uploadSingle.single("file");
};

const multipleFile = (file_path) => {
  const uploadMultiple = multer({
    storage: createStorage(file_path),
    limits: {
      fileSize: 10000000
    },
    fileFilter(req, file, cb) {
      checkFileType(file, cb);
    }
  });
  return uploadMultiple.array("files", 50);
};

// Upload multiple
const multiple = (img_path) => {
  const uploadMultiple = multer({
    storage: createStorage(img_path),
    limits: {
      fileSize: 10000000
    },
    fileFilter(req, file, cb) {
      checkImageType(file, cb);
    }
  });
  return uploadMultiple.array("files", 50);
};

const imgur = multer({ storage: multer.memoryStorage({}) });

module.exports = {
  uploadSingle: upload,
  uploadFile: uploadFile,
  uploadImgur: imgur,
  uploadMultiple: multiple,
  multipleFile: multipleFile
};
