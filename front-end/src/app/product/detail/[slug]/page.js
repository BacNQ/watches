import DetailPage from '../../../../page/product/detail/index';
import { getProduct } from '../../../../services/product';

export default async function ProductDetail({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  return <DetailPage params={params} product={product?.data} />
}
