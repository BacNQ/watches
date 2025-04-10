import LoginV from "../../../page/account/auth/login"

export const metadata = {
  title: 'Đăng nhập',
  description: 'Đăng nhập tài khoản',
}

export default function LoginPage() {

  return (
      <div className='app'>
        <div className='page-auth'>
          <LoginV />
        </div>
      </div>
  );
}

