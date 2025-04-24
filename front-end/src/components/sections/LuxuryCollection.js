"use client";
import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/pagination";
const LuxuryCollection = () => {
    return (
        <section className="group-collection">
            <div className="header-collection">
                <h1>Bộ sưu tập Luxury</h1>
            </div>
            <div className="content-collection">
                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={10}
                    slidesPerView={2}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    navigation={true}
                    className="swiper-main"
                >
                    <SwiperSlide>
                        <a href='http://localhost:3000/product/detail/dong-ho-frederique-constant-nam-fc-310ms5b6-p5130'>
                            <img src="static/image/fc-luxury-banner_1711707751.webp" alt="B&Q Watches" className="w-full h-[380px] object-cover rounded-lg" />
                        </a>
                    </SwiperSlide>
                    <SwiperSlide>
                        <a href='http://localhost:3000/product/detail/dong-ho-omega-nam-23110392157001-p12376'>
                            <img src="static/image/omega-luxury-banner_1711707171.webp" alt="B&Q Watches" className="w-full h-[380px] object-cover rounded-lg" />
                        </a>
                    </SwiperSlide>
                    <SwiperSlide>
                        <a href='http://localhost:3000/product/detail/dong-ho-longines-nam-l26285797-1-p14782'>
                            <img src="static/image/lg-giam-34-banner_1711707950.webp" alt="B&Q Watches" className="w-full h-[380px] object-cover rounded-lg" />
                        </a>
                    </SwiperSlide>
                </Swiper>
                <div className="absolute inset-0 flex items-center justify-between px-4">
                    <button className="text-white text-2xl">
                        <i className="fas fa-chevron-left">
                        </i>
                    </button>
                    <button className="text-white text-2xl">
                        <i className="fas fa-chevron-right">
                        </i>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default LuxuryCollection