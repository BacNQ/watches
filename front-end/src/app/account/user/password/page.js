import PasswordV from '../../../../page/account/user/password/PasswordV'

export const metadata = {
  title: 'Thay đổi mật khẩu | B&Q Watches',
  description: 'Thay đổi mật khẩu',
}

export default function PasswordPage(props) {
  return (
    <div className='app'>
      <PasswordV {...props}/>
    </div>
  );
}

