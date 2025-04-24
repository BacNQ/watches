"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "./style.scss"

const CategoryMain = () => {
    return (
        <div className="flex max-w-[1320px] mx-auto">
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
                            Xu hướng 2025
                        </a>
                    </li>
                    <li className="mb-2">
                        <a className="flex items-center text-gray-700" href="#">
                            <img alt="Mercari logo" className="mr-2" height="20" src="https://storage.googleapis.com/a1aa/image/mNKwrbVNqoiE9DoXtRjBhl2p9dH89tqdMoX3mJdKYvU.jpg" width="20" />
                            Menu
                        </a>
                    </li>
                    <li className="mb-2">
                        <a className="flex items-center text-gray-700" href="#">
                            <img alt="Paypayfleamarket logo" className="mr-2" height="20" src="https://storage.googleapis.com/a1aa/image/5o7rkQiX9oewmQkCTAM3JUNIKTxWevgq4YnIJYWAzAk.jpg" width="20" />
                            Nam
                        </a>
                    </li>
                    <li className="mb-2">
                        <a className="flex items-center text-gray-700" href="#">
                            <i className="fas fa-shopping-cart mr-2">
                            </i>
                            Nữ
                        </a>
                    </li>
                    <li className="mb-2">
                        <a className="flex items-center text-gray-700" href="#">
                            <img alt="Rakuten logo" className="mr-2" height="20" src="https://storage.googleapis.com/a1aa/image/NEVQpFXbe5Tvnh1N1octkSQB1_dH-VqnaHCtpGHFU-c.jpg" width="20" />
                            Luxury
                        </a>
                    </li>
                    <li className="mb-2">
                        <a className="flex items-center text-gray-700" href="#">
                            <img alt="Rakuma logo" className="mr-2" height="20" src="https://storage.googleapis.com/a1aa/image/eneB1GrZQSWEaAQr6zpVWD6XmDyJH54vZDyJEo82-IA.jpg" width="20" />
                            Cũ cao cấp
                        </a>
                    </li>
                    <li className="mb-2">
                        <a className="flex items-center text-gray-700" href="#">
                            <img alt="Ebay logo" className="mr-2" height="20" src="https://storage.googleapis.com/a1aa/image/3R9DOt3r-pMlaswaKoikLSfArxcZCJVxDAFI2bY0SSk.jpg" width="20" />
                            Treo tường
                        </a>
                    </li>
                </ul>
            </div>
            <div className="slide-banner w-[80%] pt-4 pr-0 pb-4 pl-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <div className="relative">
                            <Swiper
                                modules={[Autoplay, Navigation, Pagination]}
                                spaceBetween={10}
                                slidesPerView={1}
                                pagination={{ clickable: true }}
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
                <div className="strengths_block_default">
                    <div className="item">
                        <div className="icon-item">
                            <i className='bx bxs-watch-alt'></i>
                        </div>
                        <div className="content-right">
                            <div className="title-ctn">Mẫu mã đa dạng</div>
                            <p>Hoàn tiền nếu phát hiện bán hàng giả</p>
                        </div>
                    </div>
                    <div className="item">
                        <div className="icon-item">
                            <i className='bx bxs-rocket' ></i>
                        </div>
                        <div className="content-right">
                            <div className="title-ctn">Giao hàng nhanh</div>
                            <p>Giao hàng nhanh, đóng gói cẩn thận</p>
                        </div>
                    </div>
                    <div className="item">
                        <div className="icon-item">
                            <i className='bx bxs-cube-alt'></i>
                        </div>
                        <div className="content-right">
                            <div className="title-ctn">Đổi hàng 7 ngày</div>
                            <p>1 đổi 1 trong 7 ngày với sản phẩm lỗi</p>
                        </div>
                    </div>
                    <div className="item">
                        <div className="icon-item">
                            <i className='bx bxs-check-shield' ></i>
                        </div>
                        <div className="content-right">
                            <div className="title-ctn">Bảo hành 5 năm</div>
                            <p>Thụ tục nhanh gọn, thay pin miễn phí</p>
                        </div>
                    </div>
                    <div className="item">
                        <div className="icon-item">
                            <i className='bx bxs-wallet'></i>
                        </div>
                        <div className="content-right">
                            <div className="title-ctn">Đeo trước trả sau</div>
                            <p>Trả trước 1 phần, 2 phần còn lại trả sau</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryMain