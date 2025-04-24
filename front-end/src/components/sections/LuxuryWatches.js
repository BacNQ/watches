'use client'
import React, { useState, useEffect } from 'react';
import ProductItem from '../product/item'
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getProductLuxury } from '../../services/product'

const breakpoints = {
    "640": {
        "slidesPerView": 2,
        "spaceBetween": 8
    },
    "768": {
        "slidesPerView": 3,
        "spaceBetween": 8
    },
    "1024": {
        "slidesPerView": 4,
        "spaceBetween": 8
    },
    "1200": {
        "slidesPerView": 5,
        "spaceBetween": 8
    }
}

const LuxuryWatches = () => {
    const [products, setProducts] = useState()
    useEffect(() => {
        getProductLuxury()
            .then(data => {
                setProducts(data?.response?.results);
            })
            .catch(err => {
                console.error(err.message);
            });
    }, [])
    return (
        <section className="group-luxury flex justify-center">
            <div className="luxury-header w-[350px] flex justify-center items-center">
                <img
                    className='rounded-md'
                    src='/static/image/banner-dong-ho-cao-cap_1714020205.webp'
                    alt='Đồng hồ cao cấp'
                />
            </div>

            <div className="card-body w-[75%] mt-4 -ml-[70px]">
                <Swiper
                    slidesPerView={5}
                    spaceBetween={10}
                    breakpoints={breakpoints}
                    pagination={{ clickable: true }}
                    loop={true}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="swiper-luxury"
                >
                    {
                        products && products.map((product, key) => (<SwiperSlide key={key}><ProductItem product={product} /></SwiperSlide>))
                    }
                </Swiper>
            </div>
        </section>

    )
}

export default LuxuryWatches