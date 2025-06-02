const axios = require('axios');
const cheerio = require('cheerio');
const queryString  = require('query-string');

async function scrapeSearch(keyword, page = 1, params = {}) {
    let baseUrl = `https://www.watchstore.vn/tim-kiem/${encodeURIComponent(keyword)}`;
    if (page > 1) {
        baseUrl += `/page-${page}`;
    }

    const queryStr = queryString.stringify(params);
    const url = queryStr ? `${baseUrl}?${queryStr}` : baseUrl;

    const { data } = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });

    const $ = cheerio.load(data);

    const lastPageHref = $('div.pagination a.last-page').attr('href');
    let maxPage = 1;
    if (lastPageHref) {
        const match = lastPageHref.match(/page-(\d+)/);
        if (match) {
            maxPage = parseInt(match[1], 10);
        }
    }

    let total = 0;
    const totalText = $('div.product_result div.title_icon h1 span strong').first().text().trim();
    if (totalText) {
        total = parseInt(totalText.replace(/[^\d]/g, ''), 10);
    }

    const products = [];
    $('.product_grid .item .itproduct').each(function (index, el) {
        let link = $(el).find('figure.itproduct__img a').attr('href');
        let slug = link?.split('/').filter(Boolean).pop();
        let url = `http://localhost:3000/product/detail/${slug}`;
        let name = $(el).find('.content_other_item h3.itproduct__title a').text().trim();
        let img = $(el).find('figure.itproduct__img a img');
        let image = img.attr('src') || img.attr('data-src');
        let price_current_text = $(el).find('.content_other_item .itproduct__price .itproduct__price--current').text().trim();
        const price_current = parseInt(price_current_text.replace(/[^\d]/g, ''), 10);
        let price_old_text = $(el).find('.content_other_item .itproduct__price .itproduct__discount .itproduct__price--old').text().trim();
        const price_old = parseInt(price_old_text.replace(/[^\d]/g, ''), 10);
        let discountText = $(el).find('.content_other_item .itproduct__price .itproduct__discount .price_discount').text().trim();
        let discountMatch = discountText.match(/(\d+)/);
        let discount = discountMatch ? parseInt(discountMatch[1], 10) : 0;

        products.push({
            slug,
            url,
            image,
            name,
            price_current,
            price_old,
            discount
        });
    });

    return {
        results: products,
        maxPage,
        total
    };
}

module.exports = {
    scrapeSearch,
};

