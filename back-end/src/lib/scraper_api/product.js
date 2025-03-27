const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeProductDetail(slug) {
    try {
        const { data: html } = await axios.get(`https://www.watchstore.vn/${slug}`);
        
        const $ = cheerio.load(html);

        let thumbnails = [];

        $("#sync1 .item").each((index, element) => {
          const imgTag = $(element).find("img");
          const image = imgTag.attr("src") || imgTag.attr("data-src");
          if (image) {
            thumbnails.push(image);
          }
        });
        const name = $('.product_name .box_name h1.name_products').text().trim() || 'N/A';
        const price_current = $('.product_name .product_base form#buy_simple_form_submit .price .price_current').text().trim();
        const price_old = $('.product_name .product_base form#buy_simple_form_submit .price .price_old').text().trim();
        const discount = $('.product_name .product_base form#buy_simple_form_submit .price .discount').text().trim();
        const brand = $('.product_name .product_base form#buy_simple_form_submit .more_detail span.cate_name strong').text().trim();
        
        const specifics = [];

        $(".characteristic_content .charactestic_table tr").each((i, el) => {
          const tds = $(el).find("td");
          tds.each((j, td) => {
            const title = $(td).find(".title_charactestic").text().trim().replace(":", "");
            const content = $(td).find(".content_charactestic").text().trim();
            if (title && content) {
              specifics.push({ [title]: content });
            }
          });
        });

        return {
            slug,
            name,
            price_current,
            brand,
            price_old,
            thumbnails,
            discount,
            specifics
        };
    } catch (error) {
        console.error('Error scraping product info:', error);
        throw error;
    }
}

module.exports = {
    scrapeProductDetail,
};
