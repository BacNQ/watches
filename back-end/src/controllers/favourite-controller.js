const ObjectId = require('mongodb').ObjectId;
const FavProductModel = require('../models/product/favourite');

module.exports.create = async (req, res) => {
    try {
      const data = req.body;
      if (data.code && data.name && data.price) {
        // const userId = req.userId;
        const count = await FavProductModel.countDocuments({ /*user_id: userId,*/ deleted: false, code: { $ne: data.code } });
        if (count >= 300) {
          res.status(400).send({ code: 0, message: 'Bạn thêm vượt quá 300 sản phẩm. Vui lòng xóa bớt các sản phẩm khác để thêm' })
        } else {
          const favorite = await FavProductModel.findOne({ code: data.code/*, user_id: ObjectId(userId)*/ })
          if (favorite) {
            await FavProductModel.deleteOne({ _id: favorite._id })
            res.status(200).send({ code: 1, message: "Đã xóa sản phẩm khỏi danh sách yêu thích" })
          } else {
            const dataNew = {
              code: data.code,
              name: data.name,
              url: data.url,
              price: data.price,
              description: data.description,
              images: data.images,
            //   user_id: ObjectId(userId),
            }
            await new FavProductModel(dataNew).save();
            res.status(200).send({ code: 1, message: "Đã thêm sản phẩm vào danh sách yêu thích" })
          }
        }
      } else {
        res.status(400).send({ code: 0, message: 'Sản phẩm không tồn tại' })
      }
    } catch (error) {
      res.status(500).send({ code: 0, message: 'Xin lỗi. Bạn không thể thêm vào danh sách yêu thích' })
    }
  }