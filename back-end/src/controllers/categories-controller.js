const Promise = require('bluebird');
// const cheerio = require('cheerio');
const ObjectId = require('mongodb').ObjectId;
const CategoryModel = require('../models/category/model');
const { validObjectId } = require('../helpers/mongo-helper');
const parse = require('../helpers/parse');
const _ = require('lodash');

module.exports.searchCategories = async (req, res) => {
  const { status, main, root, role, home, primary, search } = req.query;

  const requestData = {
    size: req.query.size || 20,
    page: req.query.page || 1,
    sortBy: req.query.sortBy || { position: 1 },
  };
  const filter = {}
  if (search) {
    const _search = search.trim();
    filter.$or = [
      { name: { $regex: _search, $options: "i" } },
      { name_origin: { $regex: _search, $options: "i" } },
      { description: { $regex: _search, $options: "i" } },
      { category_id: { $regex: _search, $options: "i" } }
    ];
  }

  if (role !== undefined) {
    filter.role = role
  }
  if (status !== undefined) {
    filter.status = parse.getBooleanIfValid(status, true);
  }
  if (main !== undefined) {
    filter.main = parse.getBooleanIfValid(main, true);
  }
  if (home !== undefined) {
    filter.home = parse.getBooleanIfValid(home, true);
  }
  if (primary !== undefined) {
    filter.primary = parse.getBooleanIfValid(primary, true);
  }
  if (root !== undefined) {
    filter.root = parse.getBooleanIfValid(root, true);
  }
  const query = {
    deleted: false,
    ...filter,
  };

  CategoryModel.findPagination(query, requestData)
    .then(data => {
      return res.send({ code: 1, message: 'sucess', data: data || [] }).end();
    })
    .catch(error => {
      console.log('Error:', error);
      return res.status(500).send({ code: 0, message: "Lỗi", error: error }).end();
    });
};

module.exports.getTopCategories = async (req, res) => {
  const { search, main, home, primary, size, page, category_id, sortBy } = req.query;
  const requestData = {
    size: size || 20,
    page: page || 1,
    sortBy: sortBy || { position: 1 },
  };
  const query = {
    deleted: false,
    status: true,
  };
  if (search) {
    query['name'] = { '$regex': search, '$options': 'i' };
  }
  if (primary) query['primary'] = true;
  if (main) query['main'] = true;
  if (home) query['home'] = true;

  if (category_id) {
    query['category_id'] = category_id;
  }

  CategoryModel.findPagination(query, requestData)
    .then(data => {
      return res.status(200).send({ code: 1, data: data || [] });
    })
    .catch(error => {
      return res.status(500).send({ code: 0, message: "Lỗi", error: error }).end();
    });
};

module.exports.getHomeCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find({ main: true, deleted: false }).limit(20);
        return res.status(200).send({ code: 1, data: categories || [] });
    } catch (error) {
        return res.status(500).send({ code: 0, message: 'Lỗi lấy danh mục' });
    }
};  

module.exports.getCategories = async (req, res) => {
  let perPage = Number(req.query.size || 50);
  let page = Number(req.query.page || 1);
  perPage = !isNaN(perPage) ? perPage : 100;
  page = !isNaN(page) ? page : 1;

  const { id, deleted, search, product, menu } = req.query;

  const query = {
    deleted: false,
  };

  if (product !== undefined) {
    query.product = parse.getBooleanIfValid(product, true);
  }
  if (menu !== undefined) {
    query.menu = parse.getBooleanIfValid(menu, true);
  }

  if (validObjectId(id)) {
    query._id = ObjectId(id);
  }
  if (deleted) {
    query.deleted = validBoolean(deleted);
  }

  if (search) {
    query.$or = [{ name: { $regex: `.*${search}.*`, $options: 'ig' } }];
  }

  try {
    const categories = await CategoryModel.find(query)
      .sort({ position: 1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const arrIds = categories.map(catego => catego._id);

    const children = await CategoryModel.find({ parent_id: { $in: arrIds }, deleted: false })
      .sort({ position: -1 })
      .exec();

    const arrCategories = categories.map(category => {
      category.children = children.filter(child => String(child.parent_id) === String(category._id));
      return category;
    });

    const count = await CategoryModel.countDocuments(query).exec();

    const data = {
      categories: arrCategories,
      page,
      pages: Math.ceil(count / perPage),
      total: count,
    };
    return res.send({ code: 1, message: 'sucess', data: data || [] }).end();
  } catch (error) {
    return res.send({ code: 0, message: 'failed', error }).end();
  }
};

module.exports.getByParent = async (req, res) => {
    try {
      let category_id = req.params.id;
      category_id = validObjectId(category_id) ? category_id : null;
  
      const parents = await CategoryModel.findByParent(category_id);
  
      const data = await Promise.all(parents.map(async (parent) => {
        const children = await CategoryModel.find({ parent_id: parent._id, deleted: false });
  
        return {
          title: parent.name,
          value: parent._id,
          children: children.map(child => ({
            title: child.name,
            value: child._id
          }))
        };
      }));
  
      return res.status(200).send({ code: 1, message: 'success', data });
    } catch (error) {
      console.error("Error getByParent:", error);
      return res.status(500).send({ code: 0, message: "Lỗi", error });
    }
  };
//  
module.exports.getCategoryById = async (req, res) => {
  const id = req.params.id;
  if (validObjectId(id)) {
    CategoryModel.findById(id)
      .then(category => {
        res.send({ code: 1, message: 'success', data: category });
      })
      .catch(error => {
        return res.status(500).send({ code: 0, message: "Lỗi", error: error }).end();
      });
  } else {
    return res.status(401).send({ code: 0, message: 'Id category not valid' });
  }
};

module.exports.getCategoryMain = async (req, res) => {
  try {
    const filters = req.query.filters || {};
    const requestData = {
      size: parseInt(req.query.size) || 5,
      page: parseInt(req.query.page) || 1,
      sortBy: req.query.sortBy || { position: 1 },
    };

    const search = {};
    if (req.query.search) {
      search.name = { $regex: req.query.search, $options: 'i' };
    }

    const query = {
      deleted: false,
      main: true,
      ...search,
      ...filters,
    };

    const data = await CategoryModel.findPagination(query, requestData);

    const results = await Promise.map(data.results, async (category) => {
      if (!category?._id || !ObjectId.isValid(category._id)) return category;

      const parent_id = new ObjectId(category._id);
      const arrIds = [parent_id];

      const subCategories = await CategoryModel.find({ parent_id, deleted: false });
      for (const item of subCategories) {
        if (item._id && ObjectId.isValid(item._id)) {
          arrIds.push(new ObjectId(item._id));
        }
      }

      return category;
    });

    return res.status(200).send({ code: 1, message: 'success', data: results || [] });
  } catch (error) {
    console.error('getCategoryMain error:', error);
    return res.status(500).send({ code: 0, message: 'error', error: error.message || error });
  }
};

module.exports.getCategoryTree = async (req, res) => {
  const _lang = req.headers.lang || 'vi';
  let perPage = Number(req.query.size || 50);
  let page = Number(req.query.page || 1);
  perPage = !isNaN(perPage) ? perPage : 50;
  page = !isNaN(page) ? page : 1;

  const { id, search, lang } = req.query;

  const query = {
    parent_id: null,
    lang: lang || _lang,
    deleted: false
  };

  if (ObjectId.isValid(id)) {
    query._id = ObjectId(id);
  }

  if (search) {
    query.$or = [{ name: { $regex: `.*${search}.*`, $options: 'ig' } }];
  }

  CategoryModel.find(query)
    .populate({
      path: 'childrens',
      select: '_id name url image icon category_id slug description status',
      populate: {
        path: 'childrens',
        select: '_id name url image icon category_id slug description status',
        populate: {
          path: 'childrens',
          select: '_id name url image icon category_id slug description status',
          populate: {
            path: 'childrens',
            select: '_id name url image icon category_id slug description status',
          }
        }
      }
    })
    .then((results) => {
      return res.status(200).send({ code: 1, message: 'success', data: results || [] }).end();
    })
    .catch((error) => {
      return res.status(400).send({ code: 0, message: 'failed', error }).end();
    })
};

module.exports.addCategory = async (req, res) => {
  try {
    const data = req.body;

    const exist = await CategoryModel.exists({ category_id: data.category_id });
    if (exist) {
      return res.status(400).send({ code: 0, message: 'Danh mục sản phẩm đã tồn tại' });
    }

    const count = await CategoryModel.countDocuments({});
    const position = count + 1;

    const hasParent = data.parent_id && ObjectId.isValid(data.parent_id);

    const dataCategory = {
      lang: data.lang || 'vi',
      category_id: data.category_id,
      name: data.name,
      url: data.url,
      description: data.description,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      meta_keywords: data.meta_keywords,
      home: data.home,
      main: data.main,
      primary: data.primary,
      status: data.status,
      position: data.position || position,
      image: data.image,
      icon: data.icon,
      role: 'admin',
      parent_id: hasParent ? new ObjectId(data.parent_id) : null,
      root: !hasParent,
    };

    const newCategory = new CategoryModel(dataCategory);
    const category = await newCategory.save();

    return res.status(200).send({ code: 1, data: category });

  } catch (error) {
    return res.status(500).send({ code: 0, message: error.message || 'Lỗi thêm danh mục' });
  }
};


module.exports.updateCategory = (req, res) => {
  const { category } = req.body;
  const id = req.params.id;
  if (category && ObjectId.isValid(id)) {
    const categoryObjectID = new ObjectId(id);
    return documenUpdate(id, category)
      .then(dataToSet => CategoryModel.updateOne({ _id: categoryObjectID }, { $set: dataToSet }))
      .then(result => {
        return res.status(200).send({ code: 1, message: "success", data: result })
      })
      .catch((error) => {
        return res.status(400).send({ code: 0, message: (error && error.message) || 'Lỗi cập nhập' })
      })
  } else {
    return res.status(500).send({ code: 0, message: 'Lỗi cập nhập' })
  }
}

module.exports.deleteCategory = async (req, res) => {
  const id = req.params.id;

  if (!validObjectId(id)) {
    return res.send({ code: 0, message: 'Id order not exists or not valid' });
  }

  try {
    const result = await CategoryModel.updateOne(
      { _id: new ObjectId(id) },
      { deleted: true }
    );

    res.send({ code: 1, message: 'success', data: result });
  } catch (err) {
    res.send({ code: 0, message: 'failed', error: err });
  }
};

// Lib function
function documenUpdate(id, data) {
  return new Promise((resolve, reject) => {
    if (!ObjectId.isValid(id)) {
      reject('Invalid identifier');
    }
    if (Object.keys(data).length === 0) {
      reject('Required fields are missing');
    }

    const category = {
      role: 'admin',
      updated_date: new Date()
    };

    if (data.name !== undefined) {
      category.name = parse.getString(data.name);
    }

    if (data.category_id !== undefined) {
      category.category_id = parse.getString(data.category_id);
    }

    if (data.url !== undefined) {
      category.url = parse.getString(data.url);
    }

    if (data.description !== undefined) {
      category.description = parse.getString(data.description);
    }

    if (data.status !== undefined) {
      category.status = parse.getBooleanIfValid(data.status, false);
    }

    if (data.root !== undefined) {
      category.root = parse.getBooleanIfValid(data.root, false);
    }

    if (data.home !== undefined) {
      category.home = parse.getBooleanIfValid(data.home, false);
    }

    if (data.main !== undefined) {
      category.main = parse.getBooleanIfValid(data.main, false);
    }

    if (data.primary !== undefined) {
      category.primary = parse.getBooleanIfValid(data.primary, false);
    }

    if (data.image !== undefined) {
      category.image = data.image;
    }

    if (data.icon !== undefined) {
      category.icon = data.icon;
    }

    if (data.position !== undefined) {
      category.position = data.position;
    }

    if (validObjectId(data.parent_id)) {
      category.parent_id = parse.getObjectIDIfValid(data.parent_id);
    } else {
      category.parent_id = null;
    }
    resolve(category);
  });
}
