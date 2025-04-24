"use client";
import React, { useState, useEffect } from 'react';
import ProductItem from '../product/item'
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getProducts } from "../../helpers/history";

const breakpoints={
    "640": {
      "slidesPerView": 3,
      "spaceBetween": 10
    },
    "768": {
      "slidesPerView": 4,
      "spaceBetween": 10
    },
    "1024": {
      "slidesPerView": 5,
      "spaceBetween": 10
    },
    "1200": {
      "slidesPerView": 6,
      "spaceBetween": 10
    }
  }

const HistoryProduct = () => {
    const [products, setProducts] = useState()
    useEffect(() => {
        const _products = getProducts();
        setProducts(_products)
    }, [])
    return (
        products?.length > 0 && (
            <section className="group-history">
                <div className="header-history">
                    <h1>Sản phẩm đã xem</h1>
                </div>
                <div className="card-body px-4 md:px-8 lg:px-4">
                    <Swiper
                        spaceBetween={10}
                        breakpoints={breakpoints}
                        loop={true}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        className="swiper-history"
                    >
                        {products.map((product, key) => (
                            <SwiperSlide key={key}>
                                <ProductItem product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        )
    );    
}

export default HistoryProduct
