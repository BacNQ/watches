'use client'
import React, { useState, useEffect } from 'react';
import ProductItem from '../product/item'
import Image from 'next/image';
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import './section.scss'
import { getProductTrending } from '../../services/product'

const breakpoints = {
  "640": {
    "slidesPerView": 2,
    "spaceBetween": 2
  },
  "768": {
    "slidesPerView": 3,
    "spaceBetween": 2
  },
  "1024": {
    "slidesPerView": 4,
    "spaceBetween": 2
  },
  "1200": {
    "slidesPerView": 5,
    "spaceBetween": 2
  }
}

const SectionTrending = () => {
  const [products, setProducts] = useState()
  useEffect(() => {
    getProductTrending()
      .then(data => {
        setProducts(data?.response?.results);
      })
      .catch(err => {
        console.error(err.message);
      });
  }, [])
    return (
      <section className="group-trending max-w-[1320px] mx-auto bg-[#fe7902] rounded-[8px]">
        <div className="trending-header">
          <Image className='rounded-t-[8px]' width={1320} height={30} src='/static/image/trend_watches.jpg' alt='' />
        </div>
        <div className="card-body px-4 md:px-8 lg:px-8 py-6">
          <Swiper
            slidesPerView={5}
            spaceBetween={10}
            breakpoints={breakpoints}
            loop={true}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="swiper-trending"
          >
            {
              products && products.map((product, key) => (<SwiperSlide key={key}><ProductItem product={product}/></SwiperSlide>))
            }
          </Swiper>
        </div>
      </section>
    );
}

export default SectionTrending

