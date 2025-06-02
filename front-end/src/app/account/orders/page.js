import OrdersV from "../../../page/account/orders/OrdersV";

export const metadata = {
  title: 'Quản lý đơn hàng | B&Q Watches',
  description: 'Quản lý đơn hàng',
}

export default function OrdersPage(props) {
  return (
    <div className='app'>
      <OrdersV {...props}/>
    </div>
  );
}
