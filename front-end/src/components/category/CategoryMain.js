"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "./style.scss"

const CategoryMain = () => {
    return (
        <div className="container flex max-w-[1320px] mx-auto">
            <div className="w-[20%] bg-white p-4 my-4 rounded-lg">
                <div className="bg-[#070e35] rounded-[5px] font-semibold text-[13px] text-white px-4 py-2 mb-4 w-full text-left">
                    <div>
                        <i className="fas fa-bars mr-3"></i>
                        <span>DANH MỤC SẢN PHẨM</span>
                    </div>
                </div>
                <ul>
                    <li className="mb-2">
                        <a className="flex items-center text-gray-700" href="#">
                            <i className="fas fa-gavel mr-2">
                            </i>
                            Yahoo! Auction
                        </a>
                    </li>
                    <li className="mb-2">
                        <a className="flex items-center text-gray-700" href="#">
                            <img alt="Mercari logo" className="mr-2" height="20" src="https://storage.googleapis.com/a1aa/image/mNKwrbVNqoiE9DoXtRjBhl2p9dH89tqdMoX3mJdKYvU.jpg" width="20" />
                            Mercari
                        </a>
                    </li>
                    <li className="mb-2">
                        <a className="flex items-center text-gray-700" href="#">
                            <img alt="Paypayfleamarket logo" className="mr-2" height="20" src="https://storage.googleapis.com/a1aa/image/5o7rkQiX9oewmQkCTAM3JUNIKTxWevgq4YnIJYWAzAk.jpg" width="20" />
                            Paypayfleamarket
                        </a>
                    </li>
                    <li className="mb-2">
                        <a className="flex items-center text-gray-700" href="#">
                            <i className="fas fa-shopping-cart mr-2">
                            </i>
                            Yahoo! Shopping
                        </a>
                    </li>
                    <li className="mb-2">
                        <a className="flex items-center text-gray-700" href="#">
                            <img alt="Rakuten logo" className="mr-2" height="20" src="https://storage.googleapis.com/a1aa/image/NEVQpFXbe5Tvnh1N1octkSQB1_dH-VqnaHCtpGHFU-c.jpg" width="20" />
                            Rakuten
                        </a>
                    </li>
                    <li className="mb-2">
                        <a className="flex items-center text-gray-700" href="#">
                            <img alt="Rakuma logo" className="mr-2" height="20" src="https://storage.googleapis.com/a1aa/image/eneB1GrZQSWEaAQr6zpVWD6XmDyJH54vZDyJEo82-IA.jpg" width="20" />
                            Rakuma
                        </a>
                    </li>
                    <li className="mb-2">
                        <a className="flex items-center text-gray-700" href="#">
                            <img alt="Ebay logo" className="mr-2" height="20" src="https://storage.googleapis.com/a1aa/image/3R9DOt3r-pMlaswaKoikLSfArxcZCJVxDAFI2bY0SSk.jpg" width="20" />
                            Ebay
                        </a>
                    </li>
                    <li className="mb-2">
                        <a className="flex items-center text-gray-700" href="#">
                            <img alt="Jomashop logo" className="mr-2" height="20" src="https://storage.googleapis.com/a1aa/image/HHnf2PP5ELUANLdazJ2lLWyh77MKLD7NWxYgS6aYmeY.jpg" width="20" />
                            Jomashop
                        </a>
                    </li>
                </ul>
            </div>
            <div className="slide-banner w-[80%] p-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <div className="relative">
                            <Swiper
                                modules={[Autoplay, Navigation]}
                                spaceBetween={10}
                                slidesPerView={1}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                loop={true}
                                navigation={true}
                                className="swiper-main"
                            >
                                <SwiperSlide>
                                    <img src="static/banner/banner_1.jpg" alt="B&Q Watches" className="w-full h-[366px] object-cover rounded-lg" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src="static/banner/banner_2.jpg" alt="B&Q Watches" className="w-full h-[366px] object-cover rounded-lg" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src="static/banner/banner_3.jpg" alt="B&Q Watches" className="w-full h-[366px] object-cover rounded-lg" />
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
                    </div>
                    <div className="grid grid-rows-2 gap-4">
                        <img alt="B&Q Watches" className="w-full h-[175px] object-cover rounded-lg" src="static/banner/banner_5.png"/>
                        <img alt="B&Q Watches" className="w-full h-[175px] object-cover rounded-lg" src="static/banner/banner_6.png"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryMain