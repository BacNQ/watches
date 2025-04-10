import ForgotV from "../../../page/account/auth/forgot"

export const metadata = {
    title: 'Quên mật khẩu',
    description: 'Quên mật khẩu tài khoản',
}

export default function ForgotPage() {

    return (
        <div className='app'>
            <div className='page-auth'>
                <ForgotV />
            </div>
        </div>
    );
}

