import FavouriteV from '../../../../page/account/favourite/ProductsV'

export const metadata = {
  title: 'Sản phẩm yêu thích | B&Q Watches',
  description: 'Quản lý sản phẩm yêu thích',
}

export default function SellerPage(props) {
  return (
    <div className='app'>
      <FavouriteV {...props}/>
    </div>
  );
}

