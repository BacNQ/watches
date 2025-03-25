'use client'
import React, { useState, useEffect } from 'react';
import ProductItem from '../product/item'
import Image from 'next/image';
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import './section.scss'
// import { getProducts } from "../../helpers/history";

const breakpoints = {
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

const SectionTrending = () => {
  // const [products, setProducts] = useState()
  // useEffect(() => {
  //   const _products = getProducts();
  //   setProducts(_products)
  // }, [])
  // if (products && products.length > 0) {
    return (
      <section className="group-trending max-w-[1320px] mx-auto bg-[#fe7902] rounded-[8px]">
        <div className="trending-header">
          <Image className='rounded-t-[8px]' width={1320} height={30} src='/static/image/trend_watches.jpg' alt='' />
        </div>
        <div className="card-body pd-0">
          <Swiper
            slidesPerView={2}
            spaceBetween={10}
            breakpoints={breakpoints}
            loop={true}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="swiper-trending"
          >
            {/* {
              products
                .filter(product => product.url && product.code)
                .map((product, key) => ( */}
                  <SwiperSlide /*key={key}*/>
                    <ProductItem /*product={product}*/ />
                  </SwiperSlide>
                {/* ))
            } */}
          </Swiper>
        </div>
      </section>
    );
  // } else {
  //   return null
  // }
}

export default SectionTrending

