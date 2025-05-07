import SearchPage from '../../../../page/product/search/index';

export const metadata = {
  title: 'Tìm kiếm sản phẩm trên B&Q Watches',
  description: 'Tìm kiếm sản phẩm trên B&Q Watches'
};

export default async function SearchProduct({ params }) {
    const { keyword } = await params;

    return <SearchPage keyword={keyword} />;
}
