const ObjectId = require('mongodb').ObjectId;
const CartModel = require('../models/product/cart');
const { validObjectId } = require('../helpers/mongo-helper');

module.exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (data.name && data.price) {
      const userId = req.userId;
      const cart = await CartModel.findOne({ slug: data.slug, user_id: userId, deleted: false })
      if (cart) {
        return res.status(400).send({ code: 0, message: 'Sản phẩm đã tồn tại trong giỏ hàng!' });
      } else {
        const dataNew = {
          slug: data.slug,
          name: data.name,
          price: data.price,
          description: data.description,
          images: data.images,
          user_id: userId,
          qty: data.qty,
          url: data.url,
          sold_out: data.sold_out === 'Còn hàng' ? false : true
        }
        await new CartModel(dataNew).save();
        res.status(200).send({ code: 1, message: "Đã thêm sản phẩm vào giỏ hàng!" })
      }
    } else {
      res.status(400).send({ code: 0, message: 'Sản phẩm không tồn tại' })
    }
  } catch (error) {
    res.status(500).send({ code: 0, message: 'Xin lỗi. Bạn không thể thêm vào giỏ hàng' })
  }
}

module.exports.getCartByUser = async (req, res) => {
  try {
    const _carts = await CartModel.find({ user_id: req.userId, deleted: false }).sort({ created_date: -1 }).exec();
    const reUpdate = [];
    const carts = await Promise.all(_carts.map(async (item) => {
      if (item.sold_out !== true) {
        try {
          if (item.sold_out == true) {
            item.sold_out == true
            reUpdate.push(item._id);
          }
        } catch (error) {
          console.error(`Failed to fetch product from Mercari: ${error}`);
        }
      }
      return item;
    }));
    if (reUpdate.length > 0) {
      await CartModel.updateMany({ _id: { $in: reUpdate } }, { $set: { sold_out: true } });
    }
    const unavailables = carts.filter(item => item.sold_out == true);
    const availables = carts.filter(item => item.sold_out !== true);
    return res.send({ code: 1, message: 'success', data: availables || [], unavailables }).end();
  } catch (error) {
    return res.send({ code: 0, message: 'failed', error }).end();
  }
};

module.exports.removeCart = async (req, res) => {
  try {
    const { ids } = req.body;
    const userId = req.userId;
    if (ids && ids.length) {
      let _ids = ids.filter(id => validObjectId(id)).map((i) => new ObjectId(i));
      CartModel.deleteMany({ _id: { $in: _ids }, user_id: userId })
        .then((result) => {
          return res.send({ code: 1, message: "success", data: result }).end();
        })
        .catch((err) => {
          return res.status(400).send({ code: 0, message: "Xóa thất bại", error: err }).end();
        });
    } else {
      return res.status(404).send({ code: 0, message: "Không có dữ liệu xóa", error: err }).end();
    }
  } catch (error) {
    console.log(`API removeCart error: ${error}`);
    return res.status(500).send({ code: 0, message: 'Có lỗi xảy ra trong quá trình xoá giỏ hàng' });
  }
}

module.exports.removeAllCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { unavailable } = req.body;
    if (userId) {
      let query = null;
      if (unavailable === true) {
        query = { user_id: userId, deleted: false, sold_out: true }
      } else {
        query = { user_id: userId, deleted: false, sold_out: { $ne: true } }
      }
      CartModel.deleteMany(query)
        .then((result) => {
          return res.status(200).send({ code: 1, message: "success", data: result }).end();
        })
        .catch((err) => {
          return res.status(200).send({ code: 0, message: "Xóa thất bại", error: err }).end();
        });
    } else {
      return res.status(400).send({ code: 0, message: 'Không tìm thấy thông tin người dùng' }).end();
    }
  } catch (error) {
    console.log(`API removeAllCart error: ${error}`);
    return res.status(500).send({ code: 0, message: 'Có lỗi xảy ra trong quá trình xoá giỏ hàng' });
  }
}