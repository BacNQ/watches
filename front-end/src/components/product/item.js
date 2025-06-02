import Image from 'next/image';
import { formatCurrency } from '../../helpers/format_price'
import dynamic from 'next/dynamic';

const FavoriteProduct = dynamic(() => import('../../components/product/favourite'), { ssr: false })
const CartProduct = dynamic(() => import('../../components/product/cart'), { ssr: false })

const ProductItem = ({ product }) => {
    if (!product) return '';
    return (
        <div className="product-item bg-white rounded-[8px] max-w-[240px]">
            <div className="card-prod">
                <div className="thumbnail py-2">
                    <a href={product?.url} className="prod-image">
                    <Image src={product?.image} alt={product.name} width={250} height={0} />
                    </a>
                </div>
                <div className="caption">
                    <a href={product?.url} className="group-prod-name">
                        <span className="prod-name bold line-clamp-2 text-[14px] leading-[20px] overflow-hidden text-ellipsis mb-[8px] font-normal px-[10px] min-h-[40px] place-content-center">{product?.name}</span>
                    </a>
                    <div className="group-prod-price px-[10px]">
                        <div className="bid-price flex flex-col gap-[8px] pb-[16px]">
                            <span className="price-vn bold text-[16px] block text-[#ed1c24] font-bold leading-[24px]">{formatCurrency(product?.price_current)} đ</span>
                            <div className='flex items-center'>
                                <span className='text-[#999999] line-through text-[14px]'>{formatCurrency(product?.price_old)} đ</span>
                                <span className='bg-[#f9e9e2] rounded-[2px] text-[#ef5555] ml-[10px] p-[2px] text-[12px]'>-{product?.discount}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="group-action">
                        <div className='flex justify-end pr-[10px] gap-[10px] pb-4 text-gray-600'>
                            <FavoriteProduct product={product} />
                            <button className="p-[5px] w-[30px] h-[30px] leading-[22px] rounded-full bg-[#eaedf1] text-[#505f77] border border-[#eaedf1] text-center cursor-pointer transition-all duration-200 relative text-[16px]">
                                <CartProduct product={product} isIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ProductItem