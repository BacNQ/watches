const axios = require('axios');
const { scrapeProductDetail, scrapeProductTrending, scrapeProductLuxury } = require('../lib/scraper_api/product');
const { scrapeSearch } = require('../lib/scraper_api/search');
const ProductModel = require('../models/product/item'); 

module.exports.searchProducts = async (req, res) => {
    try {
        const { keyword } = req.params;
        const { page = 1, ...queryParams } = req.query;

        if (!keyword) {
            return res.status(400).json({ message: 'Thiếu từ khóa tìm kiếm' });
        }

        const pageNumber = parseInt(page, 10) || 1;

        const results = await scrapeSearch(keyword, pageNumber, queryParams);

        res.status(200).send({ code: 1, message: "Thành công", response: results });
    } catch (error) {
        console.error('Error search: ', error);
        res.status(400).send({ code: 0, message: 'Lỗi tìm kiếm' });
    }
};

module.exports.createProduct = async (req, res) => {
    try {
        const data = req.body;

        if (!data.slug || !data.name || data.price_current == null) {
            return res.status(400).json({ code: 0, message: 'Thiếu thông tin bắt buộc' });
        }

        const newProduct = new ProductModel({
            ...data,
            created_date: new Date(),
            updated_date: new Date()
        });

        await newProduct.save();

        return res.status(201).json({ code: 1, message: 'Tạo sản phẩm thành công', data: newProduct });
    } catch (error) {
        console.error('Error create product:', error);
        return res.status(500).json({ code: 0, message: 'Lỗi khi tạo sản phẩm' });
    }
};

module.exports.getProduct = async (req, res) => {
  try {
    const slug = req.params.slug;

    let product = await ProductModel.findOne({ slug });

    if (product) {
        res.status(200).send({ code: 1, data: product });
    } else {
        const scrapedData = await scrapeProductDetail(slug);
        res.status(200).send({ code: 1, data: scrapedData });
    }

  } catch (error) {
    console.error('Error get product: ', error);
    res.status(500).send({ code: 0, message: 'Lỗi hệ thống' });
  }
};


module.exports.getProductTrending = async (req, res) => {
    try {
        const products = await scrapeProductTrending();
        res.status(200).send({ code: 1, message: 'Thành công', response: products });
    } catch (error) {
        console.log('Error get product: ', error)
        return res.status(400).send({ code: 0, message: 'Không tìm thấy sản phẩm' });
    }
}

module.exports.getProductLuxury = async (req, res) => {
    try {
        const products = await scrapeProductLuxury();
        res.status(200).send({ code: 1, message: 'Thành công', response: products });
    } catch (error) {
        console.log('Error get product: ', error)
        return res.status(400).send({ code: 0, message: 'Không tìm thấy sản phẩm' });
    }
}

module.exports.getAllProducts = async (req, res) => {
    try {
        const size = parseInt(req.query.size) > 0 ? parseInt(req.query.size) : 20;
        const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
        const search = req.query.search || '';
        const sortField = req.query.sortBy || 'created_date';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const skip = (page - 1) * size;

        const query = {};

        if (search.trim() !== '') {
            const keyword = new RegExp(search.trim(), 'i');
            query.name = keyword;
        }

        const sortBy = { [sortField]: sortOrder };

        const total = await ProductModel.countDocuments(query);

        const products = await ProductModel.find(query)
            .skip(skip)
            .limit(size)
            .sort(sortBy);

        return res.status(200).json({
            code: 1,
            message: 'Lấy danh sách sản phẩm thành công',
            data: products,
            pagination: {
                size,
                page,
                total
            }
        });
    } catch (error) {
        console.error('Error get all products:', error);
        return res.status(500).json({ code: 0, message: 'Lỗi khi lấy danh sách sản phẩm' });
    }
};

module.exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({ code: 0, message: 'Thiếu ID sản phẩm' });
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ code: 0, message: 'Không có dữ liệu để cập nhật' });
        }

        updateData.updated_date = new Date();

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ code: 0, message: 'Không tìm thấy sản phẩm để cập nhật' });
        }

        return res.status(200).json({
            code: 1,
            message: 'Cập nhật sản phẩm thành công',
            data: updatedProduct
        });
    } catch (error) {
        console.error('Error update product:', error);
        return res.status(500).json({ code: 0, message: 'Lỗi khi cập nhật sản phẩm' });
    }
};

module.exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ code: 0, message: 'Thiếu ID sản phẩm' });
        }

        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ code: 0, message: 'Không tìm thấy sản phẩm để xóa' });
        }

        return res.status(200).json({
            code: 1,
            message: 'Xóa sản phẩm thành công',
            data: deletedProduct
        });
    } catch (error) {
        console.error('Error delete product:', error);
        return res.status(500).json({ code: 0, message: 'Lỗi khi xóa sản phẩm' });
    }
};

module.exports.hideProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ code: 0, message: 'Thiếu ID sản phẩm' });
        }

        const updated = await ProductModel.findByIdAndUpdate(
            id,
            { $set: { deleted: true, updated_date: new Date() } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ code: 0, message: 'Không tìm thấy sản phẩm để ẩn' });
        }

        return res.status(200).json({ code: 1, message: 'Ẩn sản phẩm thành công', data: updated });
    } catch (error) {
        console.error('Error hide product:', error);
        return res.status(500).json({ code: 0, message: 'Lỗi khi ẩn sản phẩm' });
    }
};

module.exports.unhideProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await ProductModel.findByIdAndUpdate(
            id,
            { $set: { deleted: false, updated_date: new Date() } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ code: 0, message: 'Không tìm thấy sản phẩm để hiện lại' });
        }

        return res.status(200).json({ code: 1, message: 'Hiện lại sản phẩm thành công', data: updated });
    } catch (error) {
        console.error('Error unhide product:', error);
        return res.status(500).json({ code: 0, message: 'Lỗi khi hiện lại sản phẩm' });
    }
};