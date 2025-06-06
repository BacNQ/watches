import OrdersV from '../../page/orders/index'

export const metadata = {
  title: 'Đơn hàng | B&Q Watches',
  description: 'Quản lý đơn hàng',
}

export default function CartPage(props) {
  return (
    <div className='app'>
      <OrdersV {...props}/>
    </div>
  );
}


