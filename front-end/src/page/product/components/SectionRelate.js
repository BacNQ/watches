import React from 'react'
import ProductItem from '../../../components/product/item-related'
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const breakpoints = {
    "640": {
        "slidesPerView": 3,
        "spaceBetween": 20
    },
    "768": {
        "slidesPerView": 4,
        "spaceBetween": 40
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
const SectionRelate = (props) => {
    const { product, title } = props;
    return (
        <section className="group-relates">
            <div className="card-header">
                <h4 className="title-main bold">{title}</h4>
            </div>
            <div className="card-body pd-0">
                <Swiper
                    slidesPerView={2}
                    spaceBetween={10}
                    breakpoints={breakpoints}
                    loop={true}
                    navigation={true}
                    modules={[Pagination]}
                    className="swiper-relates"
                >
                    {product?.related && product?.related.length > 0 && product?.related.map((product, key) => (
                        <SwiperSlide key={key}>
                            <ProductItem product={product} stock={true} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}

export default SectionRelate