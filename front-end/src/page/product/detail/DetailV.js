import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import GalleryProduct from '../../../components/product/gallery';
import { formatCurrency } from '../../../helpers/format_price';
import SectionRelate from "../components/SectionRelate";
import { Rate } from "antd";
import './product.scss';
import SectionComment from '../components/SectionComment';

const BtnBuyProduct = dynamic(() => import('../../../components/product/buy-cart'), { ssr: false });
const BtnCart = dynamic(() => import('../../../components/product/cart'), { ssr: false });
const FavoriteProduct = dynamic(() => import('../../../components/product/favourite'), { ssr: false });

const ProductV = (props) => {
    const { product } = props;
    const [quantity, setQuantity] = useState(1);
    const maxQty = typeof product?.stock === 'number' ? product.stock : 999;

    const handleIncrease = () => {
        if (typeof product?.stock === 'number') {
            if (quantity < product.stock) {
                setQuantity(quantity + 1);
            }
        } else {
            setQuantity(qty => Math.min(qty + 1, 999));
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleChangeQuantity = (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 1) val = 1;

        if (typeof product?.stock === 'number') {
            if (val > product.stock) {
                setQuantity(product.stock);
            } else {
                setQuantity(val);
            }
        } else {
            if (val > 999) val = 999;
            setQuantity(val);
        }
    };

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
                                <FavoriteProduct product={product} />
                            </div>
                        </div>
                        <div className='product-rating'>
                            <Rate allowHalf disabled defaultValue={product?.rating} />
                            <span className='number-rating'>{product?.rating || '0'}</span>
                        </div>
                        <span className='product-sold'>Đã bán {product.sold} sản phẩm</span>
                        {product.stock_status && product.stock_status === 'Còn hàng' ? (
                            <div className='product-status in-stock'>Còn hàng</div>
                        ) : (
                            <div className='product-status out-of-stock'>Hết hàng</div>
                        )}
                        <div className="product-price">
                            <div className='price-current'>{formatCurrency(product.price_current)} đ</div>
                            {product.price_old && <div className='price-old'>{formatCurrency(product.price_old)} đ</div>}
                            {product.discount && <div className='discount'>-{product.discount}%</div>}
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

                        <div className="product-quantity">
                            <span className="label-quantity">Số lượng:</span>
                            <div className="quantity-controls">
                                <button
                                    type="button"
                                    className="btn-quantity btn-quantity-decrease"
                                    onClick={handleDecrease}
                                    disabled={quantity <= 1}
                                >-</button>
                                <input
                                    type="number"
                                    min={1}
                                    max={maxQty}
                                    value={quantity}
                                    onChange={handleChangeQuantity}
                                    className="input-quantity"
                                />
                                <button
                                    type="button"
                                    className="btn-quantity btn-quantity-increase"
                                    onClick={handleIncrease}
                                    disabled={typeof product?.stock === 'number' ? quantity >= product.stock : quantity >= 999}
                                >+</button>
                            </div>
                        </div>

                        <div className='product-buy'>
                            <BtnCart
                                product={product}
                                size="lg"
                                label="Thêm vào giỏ"
                                quantity={quantity}
                            />
                            <BtnBuyProduct
                                product={product}
                                size="lg"
                                label="Mua ngay"
                                quantity={quantity}
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

            <article className="product-comment">
                <SectionComment productId={product._id} title="Bình luận"/>
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

            {product?.related?.length > 0 &&
                <article className="product-relate">
                    <SectionRelate product={product} title="Sản phẩm tương tự" />
                </article>
            }
        </div>
    )
}
export default ProductV
