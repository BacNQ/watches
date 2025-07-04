const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');
const FavProductModel = require('../models/product/favourite');
const { validObjectId } = require('../helpers/mongo-helper');

const mapOrder = (sort_order) => {
  let sortBy = { created_date: -1 }
  if (sort_order) {
    let orders = sort_order.split(':')
    if (orders.length > 0) {
      delete sortBy['created_date'];
      let key = orders[0]
      sortBy[key] = orders[1] == 'asc' ? 1 : -1
    }
  }
  return sortBy;
}
module.exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (data.slug && data.name && data.price) {
      const userId = req.userId;
      const count = await FavProductModel.countDocuments({ user_id: userId, deleted: false, slug: { $ne: data.slug } });
      if (count >= 300) {
        res.status(400).send({ code: 0, message: 'Bạn thêm vượt quá 300 sản phẩm. Vui lòng xóa bớt các sản phẩm khác để thêm' })
      } else {
        const favorite = await FavProductModel.findOne({ slug: data.slug, user_id: userId, deleted: false })
        if (favorite) {
          await FavProductModel.deleteOne({ _id: favorite._id })
          res.status(200).send({ code: 1, message: "Đã xóa sản phẩm khỏi danh sách yêu thích!" })
        } else {
          const dataNew = {
            slug: data.slug,
            name: data.name,
            price: data.price,
            url: data.url,
            description: data.description,
            images: data.images,
            user_id: userId,
          }
          await new FavProductModel(dataNew).save();
          res.status(200).send({ code: 1, message: "Đã thêm sản phẩm vào danh sách yêu thích!" })
        }
      }
    } else {
      res.status(400).send({ code: 0, message: 'Sản phẩm không tồn tại' })
    }
  } catch (error) {
    res.status(500).send({ code: 0, message: 'Xin lỗi. Bạn không thể thêm vào danh sách yêu thích' })
  }
}

module.exports.getFavoriteByUser = async (req, res) => {
  try {
    const favorites = await FavProductModel.find({ user_id: req.userId, deleted: false })
      .sort({ created_date: 1 })
      .exec();
    return res.send({ code: 1, message: 'success', res: favorites || [] }).end();
  } catch (error) {
    return res.send({ code: 0, message: 'failed', error }).end();
  }
};

module.exports.searchFavorities = async (req, res) => {
  const { sort, order, from, to } = req.query;

  const requestData = {
    size: parseInt(req.query.size, 10) || 20,
    page: parseInt(req.query.page, 10) || 1,
    sortBy: mapOrder(sort || order),
  };

  let filter = {
    user_id: req.userId,
    deleted: false,
  };

  let created_date = {};
  if (from && moment(from).isValid()) {
    created_date.$gte = new Date(moment(from).startOf('day').toISOString());
  }
  if (to && moment(to).isValid()) {
    created_date.$lte = new Date(moment(to).endOf('day').toISOString());
  }

  if (Object.keys(created_date).length > 0) {
    filter.created_date = created_date;
  }

  FavProductModel.findPagination(filter, requestData)
    .then(data => {
      if (data && data.results && data.results.length) {
        data.results = data.results.map(item => ({
          ...item,
          status: item.status ? item.status.toString() : 'false',
        }));
      }
      return res.send({ code: 1, message: 'success', res: data || [] }).end();
    })
    .catch(error => {
      console.log('API searchFavorities Error:', error.message || error);
      return res.status(500).send({
        code: 0,
        message: 'Có lỗi xảy ra trong quá trình lấy sản phẩm yêu thích!',
        error,
      }).end();
    });
};

module.exports.deleteByUser = async (req, res) => {
  const { ids, all } = req.body;
  const userId = req.userId;

  try {
    if (ids && ids.length > 0) {
      const _ids = ids.map(id => id);
      await FavProductModel.deleteMany({
        _id: { $in: _ids },
        user_id: userId
      });

      return res.status(200).send({ code: 1, message: 'success', data: true });
    } else if (all) {
      await FavProductModel.deleteMany({
        user_id: userId
      });

      return res.status(200).send({ code: 1, message: 'success', data: true });
    } else {
      return res.status(404).send({ code: 0, message: 'Id order not exists or not valid' });
    }
  } catch (err) {
    return res.status(400).send({ code: 0, message: 'failed', error: err.message });
  }
};