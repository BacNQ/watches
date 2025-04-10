import RegisterV from "../../../page/account/auth/register"

export const metadata = {
    title: 'Đăng ký | B&Q Watches',
    description: 'Đăng ký tài khoản',
  }

export default function RegisterPage() {

  return (
      <div className='app'>
        <div className='page-auth'>
          <RegisterV />
        </div>
      </div>
  );
}

