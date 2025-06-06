import ProductV from '../../page/products/index'

export const metadata = {
  title: 'Sản phẩm | B&Q Watches',
  description: 'Quản lý sản phẩm',
}

export default function CartPage(props) {
  return (
    <div className='app'>
      <ProductV {...props}/>
    </div>
  );
}


