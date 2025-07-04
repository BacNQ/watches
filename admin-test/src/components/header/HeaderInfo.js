'use client';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { Avatar, Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";
import { UserOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { useUser } from '../../provider/UserProvider'
import './style.scss'

const HeaderInfo = (props) => {
    const { user } = useUser();
    const router = useRouter();
    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Đăng xuất thành công!');
        router.push('/auth/login');
    };

    return (
        <>
            {user
                ?
                (<div className="group-user">
                    <Link href="/" className='avatar'>
                        <Avatar
                            size={40}
                            isBordered
                            showFallback
                            icon={<UserOutlined style={{ fontSize: '22px' }} />}
                            src={user?.avatar}
                            shape="square"
                            radius="sm"
                        />
                    </Link>
                    <div className="user-label">
                        <div className='label-account flex gap-2'>
                            <Link href="/"><span className="bold text-base font-semibold">{user?.username}</span></Link>
                            <Popover placement="bottom" showArrow={true}>
                                <PopoverTrigger>
                                    <span className="fa fa-angle-down text-sm mt-[6px] cursor-pointer" />
                                </PopoverTrigger>
                                <PopoverContent className='bg-white p-[12px] text-sm rounded-[6px] mt-[12px] shadow-[4px_16px_10px_rgba(0,0,0,0.3)] outline outline-[2px] outline-[#e2e2e2] !pb-[2px] min-w-[300px]'>
                                    <div className='popover-user'>
                                        <div className='user-segment bg-[#ebedee] p-[10px] mt-[5px] mb-2 min-w-[260px] rounded-[10px]'>
                                            <div className='segment-item relative text-base flex items-center gap-[10px] justify-between font-semibold'>
                                                <Link href="/" className="bold user-name">{user?.username}</Link>
                                                <Link href={'/'} className='user-edit'><i className="fa fa-pencil !text-[13px]" /></Link>
                                            </div>
                                        </div>
                                        <ul className="user-menu ml-2 mt-4">
                                            <li className='hover:text-red-500 transition duration-200 ease-in-out'><a className='cursor-pointer' onClick={handleLogout}><i className="fa fa-sign-out" />&ensp;Đăng xuất</a></li>
                                        </ul>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>)
                :
                (<div className="group-user">
                    <Link href="/auth/login" className='avatar'>
                        <Avatar
                            size={40}
                            isBordered
                            showFallback
                            icon={<UserOutlined style={{ fontSize: '16px' }} />}
                            src={user?.avatar}
                            shape="square"
                            radius="sm"
                        />
                    </Link>
                    <div className="user-label">
                        <div className='label-account'>
                            <Link href="/auth/login">
                                <span className="bold text-base font-semibold">Đăng nhập</span>
                            </Link>
                        </div>
                    </div>
                </div>)
            }
        </>
    )
}

export default HeaderInfo
