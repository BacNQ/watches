import CartV from '../../../page/account/cart/index'

export const metadata = {
  title: 'Giỏ hàng | B&Q Watches',
  description: 'Quản lý giỏ hàng',
}

export default function CartPage(props) {
  return (
    <div className='app'>
      <CartV {...props}/>
    </div>
  );
}


