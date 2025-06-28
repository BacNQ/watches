const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const queryString = require('query-string');

async function scrapeCategory(category_id, page = 1, params = {}) {
    let baseUrl = `https://www.watchstore.vn/${category_id}`;
    if (page > 1) {
        baseUrl += `#page=${page}`;
    }

    const queryStr = queryString.stringify(params);
    const url = queryStr ? `${baseUrl}?${queryStr}` : baseUrl;
    console.log('Scraping:', url);

    const browser = await puppeteer.launch({ headless: true });
    const pageObj = await browser.newPage();
    await pageObj.setUserAgent('Mozilla/5.0');

    await pageObj.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    await new Promise(r => setTimeout(r, 2000));

    const html = await pageObj.content();
    const $ = cheerio.load(html);

    // Lấy max page
    const lastPageLink = $('button.last-page').attr('data-link');
    let maxPage = 1;
    if (lastPageLink) {
        const match = lastPageLink.match(/#page=(\d+)/);
        if (match) {
            maxPage = parseInt(match[1], 10);
        }
    }

    // Lấy danh sách sản phẩm
    const products = [];
    $('.product_grid .item .itproduct').each((index, el) => {
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

    await browser.close();

    return {
        results: products,
        maxPage,
    };
}

module.exports = {
    scrapeCategory,
};
