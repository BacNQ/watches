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
        const code = $('.product_name .box_name .code_sp').text().replace('UPC:', '').trim();
        const ratingText = $('.product_name .box_name span.rate a.rate_count').text().trim();
        const rating = parseFloat(ratingText);
        const soldText = $('.product_name .box_name .sell_products').text().trim().replace(/[^\d]/g, '');
        const sold = +soldText;
        const stock_status = $('.product_name .box_name .statust').text().trim();
        const name = $('.product_name .box_name h1.name_products').text().trim() || 'N/A';
        const price_current_text = $('.product_name .product_base form#buy_simple_form_submit .price .price_current').text().trim();
        const price_current = parseInt(price_current_text.replace(/[^\d]/g, ''), 10); 
        const price_old_text = $('.product_name .product_base form#buy_simple_form_submit .price .price_old').text().trim();
        const price_old = parseInt(price_old_text.replace(/[^\d]/g, ''), 10);
        const discount = $('.product_name .product_base form#buy_simple_form_submit .price .discount').text().trim() || null;
        const brand = $('.product_name .product_base form#buy_simple_form_submit .more_detail span.cate_name strong').text().trim() || null;
        const origin = $('.product_name .product_base form#buy_simple_form_submit .more_detail span.text_ext strong').text().trim() || null;
        const description = $('.summary_pro .description p').text().trim() || null;

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
  
        let related = [];
        $('.list_slide_owl .list_slide_rl .item').each((i, elem) => {
          const link = $(elem).find('a').attr('href').split('/');
          const slug = link[link.length - 1];
          const image = $(elem).find('img').attr('src');
          const stock_status = $(elem).find('.itproduct__over span').text().trim() || null;

          if (slug && image) {
            related.push({ slug, image, stock_status });
          }
        });

        return {
            slug,
            code,
            stock_status,
            rating,
            sold,
            name,
            price_current,
            brand,
            origin,
            price_old,
            thumbnails,
            discount,
            specifics,
            description,
            related,
        };
    } catch (error) {
        console.error('Error scraping product info:', error);
        throw error;
    }
}

module.exports = {
    scrapeProductDetail,
};
