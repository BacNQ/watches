import ProfileV from '../../../page/account/user/profile/ProfileV'

export const metadata = {
  title: 'Thông tin tài khoản | B&Q Watches',
  description: 'Thông tin tài khoản',
}

export default function ProfilePage(props) {
  return (
    <div className='app'>
      <ProfileV {...props}/>
    </div>
  );
}
