'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import './style.scss'

const menuItems = [
    { label: 'Trang chủ', to: '/', icon: 'fa-solid fa-house' },
    { label: 'Quản lý sản phẩm', to: '/products', icon: 'fa-solid fa-box' },
    { label: 'Quản lý đơn hàng', to: '/orders', icon: 'fa-solid fa-truck' },
    { label: 'Danh mục sản phẩm', to: '/category', icon: 'fa-solid fa-list' },
    { label: 'Quản lý bài viết', to: '/news', icon: 'fa-solid fa-newspaper' },
    { label: 'Quản lý tài khoản', to: '/accounts', icon: 'fa-solid fa-user' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <Link href="/">
                <img src="/static/logo/logo.png" alt="Logo" />
            </Link>
            <nav>
                {menuItems.map((item) => (
                    <Link
                        key={item.to}
                        href={item.to}
                        className={clsx('menu-item', {
                            'active': item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)
                        })}
                    >
                        <i className={item.icon} style={{ marginRight: '8px' }}></i>
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
