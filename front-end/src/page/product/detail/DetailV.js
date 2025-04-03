import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button, Textarea } from "@nextui-org/react";
import GalleryProduct from '../../../components/product/gallery';
import { formatCurrency } from '../../../helpers/format_price'
// import { setProduct } from "../../../helpers/history";
import { useEffect, useState } from 'react';
import SectionRelate from "../components/SectionRelate";
import { Rate } from "antd";
import './product.scss'

const BtnBuyProduct = dynamic(() => import('../../../components/product/buy-cart'), { ssr: false })
const BtnCart = dynamic(() => import('../../../components/product/cart'), { ssr: false })

// const FavoriteProduct = dynamic(() => import('../../../components/product/favorite'), { ssr: false })

const ProductV = (props) => {
    const { product } = props;
    console.log(product)
    // useEffect(() => {
    //     if (product) setProduct('paypay', product)
    // }, [product])

    return (
        <div className='content-body'>
            <article className="box-product">
                <div className="row">
                    <section className="gallery border-right">
                        <GalleryProduct thumbnails={product.thumbnails || []} product={product} />
                    </section>
                    <section className='info-product'>
                        <div className='product-header'>
                            <h1 className='product-name'>{product.name || ""}</h1>
                            <div className='product-action'>
                                {/* <FavoriteProduct product={product} /> */}
                                <i className="fa-solid fa-heart"></i>
                            </div>
                        </div>
                        <div className='product-rating'>
                            <Rate allowHalf disabled defaultValue={product?.rating} />
                            <span className='number-rating'>{product?.rating || '0'}</span>
                        </div>
                        <span className='product-sold'>Đã bán {product.sold} sản phẩm</span>
                        {product.stock_status && product.stock_status === 'Còn hàng' ?
                            <div className='product-status in-stock'>Còn hàng</div> :
                            <div className='product-status out-of-stock'>Hết hàng</div>
                        }
                        <div className="product-price">
                            <div className='price-current'>{formatCurrency(product.price_current)} đ</div>
                            {product.price_old && <div className='price-old'>{formatCurrency(product.price_old)} đ</div>}
                            {product.discount && <div className='discount'>{product.discount}</div>}
                        </div>
                        <div className='product-brand'>
                            {product.brand && <span>Chính hãng từ: <strong>{product.brand}</strong></span>}
                        </div>
                        <div className="product-specifics">
                            {product?.specifics.map((item, index) => {
                                const [label, value] = Object.entries(item)[0];
                                return (
                                    <div key={index} className="item-specifics">
                                        <strong>{label}:</strong>{" "}
                                        <span className="text-specifics">{value}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className='product-buy'>
                            <BtnCart
                                product={product}
                                size="lg"
                                label="Thêm vào giỏ"
                            />
                            <BtnBuyProduct
                                product={product}
                                size="lg"
                                label="Mua ngay"
                            />
                        </div>
                        <div className='hotline_detail'>
                            <p>Gọi mua hàng: </p>
                            <div className='phone-link'>
                                <a href="tel:0353827279">035 382 7279</a> - <a href="tel:0981651127">098 165 1127</a>
                            </div>
                        </div>
                        <div className='box-commitment'>
                            <div className='title-box'>
                                <div className='title'>CAM KẾT CỦA B&Q WATCHES</div>
                            </div>
                            <ul className='grid-item'>
                                <li className='item'>
                                    <div className='item-content'>
                                        <i className="fa-solid fa-award"></i>
                                        <span className='item-text'>Bảo hành máy 5 năm toàn quốc, thủ tục nhanh gọn</span>
                                    </div>
                                </li>
                                <li className='item'>
                                    <div className='item-content'>
                                        <i className="fa-solid fa-not-equal"></i>
                                        <span className='item-text'>Không bán hàng fake, chỉ bán hàng chính hãng</span>
                                    </div>
                                </li>
                                <li className='item'>
                                    <div className='item-content'>
                                        <i className="fa-solid fa-box"></i>
                                        <span className='item-text'>Sẵn hàng - quay chụp hình thực tế gửi khách xem</span>
                                    </div>
                                </li>
                                <li className='item'>
                                    <div className='item-content'>
                                        <i className="fa-solid fa-truck"></i>
                                        <span className='item-text'>Freeship toàn quốc, thanh toán khi nhận hàng</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </section>
                </div>
            </article>

            {product?.description &&
                <article className="box-product">
                    <section className="box-description-product">
                        {product?.description && (
                            <div className="product-description">
                                <div className='pannel-header'>
                                    <h3 className='title-header bold'>Mô tả sản phẩm</h3>
                                </div>
                                <div className='pannel-body'>
                                    <p>{product?.description}</p>
                                </div>
                            </div>
                        )}
                    </section>
                </article>
            }

            {product?.related &&
                <article className="product-relate">
                    <SectionRelate product={product} title="Sản phẩm tương tự" />
                </article>
            }
        </div>
    )
}
export default ProductV
