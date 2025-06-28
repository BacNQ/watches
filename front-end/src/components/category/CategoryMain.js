"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "./style.scss";
import { seachCategories, getDetailCategory } from '../../services/categories';

function buildCategoryTree(categories) {
    const map = {};
    const roots = [];

    categories.forEach(cat => {
        map[cat._id] = { ...cat, children: [] };
    });

    categories.forEach(cat => {
        if (cat.parent_id && map[cat.parent_id]) {
            map[cat.parent_id].children.push(map[cat._id]);
        } else if (cat.root) {
            roots.push(map[cat._id]);
        }
    });

    return roots.sort((a, b) => (a.position || 0) - (b.position || 0));
}

const MegaMenu = ({ category, onClose }) => {
    if (!category || !category.children || category.children.length === 0) return null;

    const columns = category.children.map(child => ({
        title: child.name,
        items: child.children || []
    }));

    return (
        <div
            className="mega-menu absolute left-4 top-4 w-[1040px] h-[450px] bg-white shadow-lg border rounded-lg z-30"
            onMouseLeave={onClose}
        >
            <div className="p-6 flex gap-10 h-full">
                <div>
                    <div className="font-semibold text-base mb-2 border-b pb-2">{category.name}</div>
                    <ul>
                        {category.children.map(child => (
                            <li key={child._id} className="py-1 text-[15px] text-gray-800 font-medium">
                                <a href={`/category/${child.category_id || child.slug}`} className="hover:text-blue-600">{child.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                {columns.map((col, i) => col.items.length > 0 && (
                    <div key={i}>
                        <div className="font-semibold text-base mb-2 border-b pb-2">{col.title}</div>
                        <ul>
                            {col.items.map(sub => (
                                <li key={sub._id} className="py-1 text-[15px] text-gray-700">
                                    <a href={`/category/${sub.category_id || sub.slug}`} className="hover:text-blue-600">{sub.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CategoryMain = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await seachCategories({});
                const raw = res.data.data || [];
                setCategories(buildCategoryTree(raw));
            } catch (error) {
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleMouseEnter = (cat) => setHoveredCategory(cat);
    const handleAreaMouseLeave = () => setHoveredCategory(null);

    return (
        <div className="flex max-w-[1320px] mx-auto relative">
            <div
                className="relative flex w-full"
                onMouseLeave={handleAreaMouseLeave}
                style={{ minHeight: 450 }}
            >
                {/* Sidebar */}
                <div className="w-[20%] bg-white p-4 my-4 rounded-lg relative z-20">
                    <div className="bg-[#070e35] rounded-[5px] font-semibold text-[13px] text-white px-4 py-2 mb-4 w-full text-left">
                        <div>
                            <i className="fas fa-bars mr-3"></i>
                            <span>DANH MỤC SẢN PHẨM</span>
                        </div>
                    </div>
                    {loading ? (
                        <div className="text-center text-gray-400 py-4">Đang tải danh mục...</div>
                    ) : (
                        <ul className="category-root-menu">
                            {categories.length === 0 ? (
                                <li className="text-gray-500">Không có danh mục nào.</li>
                            ) : (
                                categories.map(cat => (
                                    <li
                                        key={cat._id}
                                        className="relative group"
                                        onMouseEnter={() => handleMouseEnter(cat)}
                                    >
                                        <a className="flex items-center px-3 py-2 hover:bg-gray-100 font-medium"
                                            href={`/category/${cat.category_id || cat.slug}`}>
                                            {cat.name}
                                            {cat.children && cat.children.length > 0 &&
                                                <i className="fas fa-chevron-right ml-auto text-xs"></i>
                                            }
                                        </a>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>

                <div className="slide-banner w-[80%] pt-4 pr-0 pb-4 pl-4 relative">
                    {hoveredCategory && (
                        <MegaMenu category={hoveredCategory} onClose={() => { }} />
                    )}
                    <div className="grid grid-cols-3 gap-4 pointer-events-auto">
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
                            </div>
                        </div>
                        <div className="grid grid-rows-2 gap-4">
                            <img alt="B&Q Watches" className="w-full h-[175px] object-cover rounded-lg" src="static/banner/banner_5.png" />
                            <img alt="B&Q Watches" className="w-full h-[175px] object-cover rounded-lg" src="static/banner/banner_6.png" />
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
        </div>
    );
};


export default CategoryMain;
