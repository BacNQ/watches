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
        const slug = req.params.slug
        const product = await scrapeProductDetail(slug);
        res.status(200).send({ code: 1, data: product });
    } catch (error) {
        console.log('Error get product: ', error)
        return res.status(400).send({ code: 0, message: 'Không tìm thấy sản phẩm' });
    }
}

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

