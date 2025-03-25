import Link from 'next/link'
import Image from 'next/image';
import dynamic from 'next/dynamic';
// import Countdown from 'react-countdown-now';
// import ExchangeRate from '../price';
// import { convertCurrency } from '../../helpers/converts'
// const BntFavo = dynamic(() => import('./favorite'), { ssr: false })
// const BntCart = dynamic(() => import('./cart'), { ssr: false })

const ProductItem = (/*{ product, site }*/) => {
    //   if (!product) return '';
    //   let _site = site || product?.site || 'auction';
    //   let sold_mer = product && (product.status === 'ITEM_STATUS_TRADING' || product.status === 'trading' || product.status === 'sold_out'); // sold
    //   let sold_pay = product?.status === 'SOLD';
    return (
        <div className="product-item bg-white rounded-[8px]">
            <div className="card-prod">
                <div className="thumbnail py-2">
                    {/* {sold_pay && <div className="paypay-sold"><img src="/static/svg/paypay_sold.svg" alt="click247" /></div>}
          {sold_mer && <div className="alert-sold"><img src="/static/svg/sold.svg" alt="click247" /></div>} */}
                    {/* <Image className="icon-brand" src={icons[_site]} alt='click247.vn' width={30} height={30} /> */}
                    {/* <a href={`/${_site}/item/${product.code}`} className="prod-image"> */}
                    <Image src={"/static/image/product_test.jpg"} alt={"product.name"} width={250} height={0} />
                    {/* </a> */}
                </div>
                <div className="caption">
                    {/* <a href={`/${_site}/item/${product.code}`} className="group-prod-name"> */}
                    <span className="prod-name bold line-clamp-2 text-[14px] leading-[20px] overflow-hidden text-ellipsis mb-[8px] font-normal px-[10px]">Casio Nam AE-1200WHD-1AVDF</span>
                    {/* </a> */}
                    <div className="group-prod-price px-[10px]">
                        <div className="bid-price flex flex-col gap-[8px] pb-[16px]">
                            {/* <label className="price-vn bold"><ExchangeRate price={product.price || 0} currency={product.currency || 'JPY'} />&ensp;</label> */}
                            {/* <span className="price-jp">{convertCurrency(product.price, product.currency)}</span> */}
                            <span className="price-vn bold text-[16px] block text-[#ed1c24] font-bold leading-[24px]">1,800,000 VNĐ</span>
                            <div className='flex items-center'>
                                <span className='text-[#999999] line-through text-[14px]'>1,300,000</span>
                                <span className='bg-[#f9e9e2] rounded-[2px] text-[#ef5555] ml-[10px] p-[2px] text-[12px]'>-25%</span>
                            </div>
                        </div>
                    </div>
                    <div className="group-action">
                        {/* {_site !== 'auction' && _site !== 'mercari' ? <BntCart product={product} site={_site} /> : (product.new ? <span className='prod-new'>Mới</span> : '')}
            <BntFavo product={product} site={_site} /> */}
                        <div className='flex justify-end pr-[10px] gap-[10px] pb-4 text-gray-600'>
                            <button className="p-[5px] w-[30px] h-[30px] leading-[22px] rounded-full bg-[#eaedf1] text-[#505f77] border border-[#eaedf1] text-center cursor-pointer transition-all duration-200 relative text-[16px]">
                                <i className="fa-solid fa-heart"></i>
                            </button>
                            <button className="p-[5px] w-[30px] h-[30px] leading-[22px] rounded-full bg-[#eaedf1] text-[#505f77] border border-[#eaedf1] text-center cursor-pointer transition-all duration-200 relative text-[16px]">
                                <i className="fa-solid fa-cart-shopping"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ProductItem