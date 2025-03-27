
import "swiper/css";
import "swiper/css/navigation"
import "swiper/css/pagination"
import queryString from "query-string";
import ImgLightbox from './lightbox';
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

export default function GalleryProduct({ thumbnails, product }) {
  const [thumbs, setThumbs] = useState(null);
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if(thumbnails?.length) {
      let _thumbnails = thumbnails.map((image) => {
        let params = queryString.parseUrl(image)
        return params?.url ? params.url : image;
      })
      setImages(_thumbnails)
    }
  }, [thumbnails])

  const openLightbox = (index) => {
    setIndex(index)
    setOpen(true);
  }

  return (
    <>
      <Swiper
        style={{'--swiper-navigation-color': '#fff','--swiper-pagination-color': '#fff'}}
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbs?.el ? thumbs : null }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="swiper-images"
      >
          {images && images.map((image, key) => {
            return(
              <SwiperSlide key={key}>
                <div className="main-gallery">
                  <div className="img">
                    <figure className="image-product" onClick={() => openLightbox(key)}>
                      <img src={image} alt='B&Q Watches'/>
                    </figure>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
      </Swiper>
      <Swiper onSwiper={setThumbs} loop={true} spaceBetween={10} slidesPerView={4} freeMode={true} watchslidesvisibility="true" watchSlidesProgress={true} className="swiper-thumnails">
        {thumbnails && thumbnails.map((image, key) => <SwiperSlide key={key}><div className="item-gallery"><figure className="img-thumb" ><img src={image} alt='click247.vn'/></figure></div></SwiperSlide>)}
      </Swiper>
      <ImgLightbox images={images} open={open} setOpen={setOpen} index={index} setIndex={setIndex} />
    </>
  )
}