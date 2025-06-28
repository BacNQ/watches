import CategoryPage from '../../../page/category/index';

export const metadata = {
  title: 'Danh mục sản phẩm B&Q Watches',
  description: 'Danh mục sản phẩm B&Q Watches'
};

export default async function DetailCategory({ params }) {
    const { category_id } = await params;

    return <CategoryPage category_id={category_id} />;
}
