const HISTORY_KEY = 'keyword.history';
const getHistoryKeywords = () => {
  try {
    const keywords = localStorage.getItem(HISTORY_KEY);
    return keywords ? JSON.parse(keywords) : [];
  } catch {
    return [];
  }
};

const setHistoryKeywords = (keyword) => {
  try {
    let keywords = getHistoryKeywords();
    keywords = [keyword, ...keywords.filter(k => k !== keyword)];
    keywords = keywords.slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(keywords));
  } catch {

  }
};

const deleteHistoryKeywords = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {

  }
};

const getProducts = () => {
    try {
      let products = localStorage.getItem(`viewed_products`);
      if(products) {
        return JSON.parse(products)
      }
      return [];
    } catch (error) {
      return [];
    }
  }
  
  const setProduct = (product) => {
    try {
      let products = getProducts();
      const _product = {
        url: `http://localhost:3000/product/detail/${product.slug}`,
        slug: product.slug,
        price_current: product.price_current,
        price_old: product.price_old,
        discount: product.discount,
        image: product?.images?.length ? product.images [0] : product?.thumbnails?.length ? product.thumbnails[0] : null,
        name: product.name,
      }
      if(products && products.length > 0) {
        products = products.filter(i => i.slug !== product.slug);
        products = products.slice(0, 99);
        products.unshift(_product);
      } else {
        products = [_product]
      }
      localStorage.setItem(`viewed_products`, JSON.stringify(products));
    } catch (error) {
    }
  }
  
  const deleteProduct = () => {
    try {
      localStorage.removeItem(`viewed_products`);
    } catch (error) {
      
    }
  }

  export {
    getHistoryKeywords,
    setHistoryKeywords,
    deleteHistoryKeywords,
    getProducts,
    setProduct,
    deleteProduct,
  }