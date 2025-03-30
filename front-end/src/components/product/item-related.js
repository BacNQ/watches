import React from "react"

const ProductItem = ({ product }) => {
    return (
        <div className="product-item bg-white rounded-[8px]">
            <div className="card-prod">
                <div className="thumbnail py-2">
                    <a href={`/product/detail/${product?.slug}`} className="prod-image">
                        <img src={product.image} alt="sản phẩm tương tự"/>
                        {product?.stock_status !== null &&
                            <div className="absolute top-3 left-[40px]">
                                <span className="inline-block px-[5px] py-[4px] leading-[1.3] bg-[#ddd] rounded text-[12px]">{product?.stock_status}</span>
                            </div>
                        }
                    </a>
                </div>
            </div>
        </div>
    )
}


export default ProductItem