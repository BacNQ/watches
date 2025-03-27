const axios = require('axios');
const { scrapeProductDetail } = require('../lib/scraper_api/product');
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