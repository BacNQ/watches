import AccountV from '../../page/accounts/index'

export const metadata = {
  title: 'Tài khoản | B&Q Watches',
  description: 'Quản lý tài khoản',
}

export default function NewsPage(props) {
  return (
    <div className='app'>
      <AccountV {...props}/>
    </div>
  );
}


