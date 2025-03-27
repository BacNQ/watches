import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button, Textarea } from "@nextui-org/react";
import GalleryProduct from '../../../components/product/gallery';
// import { setProduct } from "../../../helpers/history";
import { useEffect, useState } from 'react';
// import { useUser } from '../../../provider/UserProvider';

// const BtnCartProduct = dynamic(() => import('../../../components/product/buycart'), { ssr: false })
// const FavoriteProduct = dynamic(() => import('../../../components/product/favorite'), { ssr: false })
// const FavoriteSeller = dynamic(() => import('../../../components/seller/favorite'), { ssr: false })
// const BtnQuoteProduct = dynamic(() => import('../../../components/product/quote'), { ssr: false })
// const SectionRelate = dynamic(() => import('../_components/SectionRelate'), { ssr: false })
// const SellerDetail = dynamic(() => import('../_components/SellerDetail'), { ssr: false })

const ProductV = (props) => {
    const { product } = props;

    // useEffect(() => {
    //     if (product) setProduct('paypay', product)
    // }, [product])

    return (
        <div className='content-body'>
            <article className="box-product">
                <div className="row">
                    <section className="col-md-4 col-sm-12 border-right">
                        <GalleryProduct thumbnails={product.thumbnails || []} product={product} />
                    </section>
                </div>
            </article>
        </div>
    )
}
export default ProductV
