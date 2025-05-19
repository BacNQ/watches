import dynamic from 'next/dynamic';
import AddressV from '../../../page/account/user/address/AddressV';

export const metadata = {
  title: 'Sổ địa chị | B&Q Watches',
  description: 'Sổ địa chỉ khách hàng',
}

export default function AddressesPage(props) {

  return (
    <div className='app'>
      <AddressV {...props} />
    </div>
  );
}

