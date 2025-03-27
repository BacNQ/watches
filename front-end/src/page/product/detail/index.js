'use client'
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Empty from "../../../components/empty/detail";
// import Skeleton from '../../../components/skeleton/product';
const DetailV = dynamic(() => import('./DetailV'), { ssr: false })

const ProductV = ({ product }) => {
    return (
        <div className="page-product">
            <div className="container">
                {/* <nav aria-label="breadcrumb">
                    <ol className="breadcrumb inline-flex items-center">
                        <li className="breadcrumb-item">
                            <Link href="/"><i className='bx bx-home-alt-2'/>Trang chủ</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <i className='bx bx-chevron-right'/>
                            <Link href="/paypay">Paypay</Link>
                        </li>
                        <li className="breadcrumb-item active">
                            <i className='bx bx-chevron-right'/>
                            <span>Sản phẩm</span>
                        </li>
                    </ol>
                </nav> */}
                {product
                ? <DetailV product={product}/>
                : <Empty/>
                }
            </div>
        </div>
    )
}

export default ProductV;