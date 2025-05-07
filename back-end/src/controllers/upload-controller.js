
const ObjectId = require("mongodb").ObjectId;
const moment = require("moment");
const Images = require("../models/images/images");
const MediaModel = require("../models/common/media");
const UserModel = require("../models/users/user");
const { uploadSingle, uploadMultiple, multipleFile, uploadFile } = require("../config/multer.config");
const { path_images } = require("../config/config");

module.exports.uploadUser = async (req, res) => {
    try {
      UserModel.findOne({ _id: req.userId })
      .then((user) => {
        if(user) {
          let folder = user.customer_no || 'common';
              folder = folder.toLowerCase();
              folder = `users/${folder}`;
  
          const uploadUser = uploadSingle(folder)
          uploadUser(req, res, (err) => {
            if (err) return res.status(500).send({code: 0, message: 'Lỗi lưu ảnh'});
            if (req.file) {
              const { type, description } = req.body;
              const fileName = req.file.filename;
              const path = `/${path_images.media + folder}/${fileName}`;
              const homeUrl = `${req.protocol}://${req.get("host")}`;
              const urlImage = homeUrl + path;
  
              new Images({
                type: type || "user",
                path: path,
                url: urlImage,
                name: fileName,
                description: description || null,
                size: req.file.size,
                status: true,
                createdBy: req.userId || null
              }).save();
  
  
              if(path && type == 'avatar') {
                UserModel.updateOne({ _id: req.userId }, { $set: { avatar: path } }).exec()
              }
  
              if(path && type == 'passport_one' && user.passport && !user.passport.active) {
                UserModel.updateOne({ _id: req.userId }, { $set: { 'passport.img_one': path } })
              }
  
              if(path && type == 'passport_two' && user.passport && !user.passport.active) {
                UserModel.updateOne({ _id: req.userId }, { $set: { 'passport.img_two': path } })
              }
  
              const data = {
                name: fileName,
                status: "done",
                image: path,
                thumbUrl: urlImage,
                url: urlImage
              };
              res.send({code: 1, data });
            } else {
              res.status(404).send({code: 0, message: 'Không tìm thấy ảnh lưu'});
            }
          })
        } else {
          res.status(400).send({code: 0, message: 'Không tìm thấy người dùng'});
        }
      }).catch((error) => {
        res.status(400).send({code: 0, message: 'Lỗi lưu ảnh'});
      })
    } catch (error) {
      res.status(500).send({code: 0, message: 'Lỗi lưu ảnh'});
    }
  };