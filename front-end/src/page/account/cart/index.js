'use client'
import './style.scss';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { Modal } from 'antd';
import { useCarts } from '../../../query/product';
import { useUser } from '../../../provider/UserProvider';
import { removeAllCarts, removeCarts } from '../../../services/common';
import Link from 'next/link';

const PendingV = dynamic(() => import('./pending'))

const CartV = (props) => {
    const { user } = useUser();
    const { data: cartData, isLoading: loading, refetch } = useCarts();
    const [carts, setCarts] = useState([]);
    const [unavailableCarts, setUnavailableCarts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        onOk: () => {},
        ids: []
    });

    const priceList = (cartData?.availables?.data || []).map(item => ({
        slug: item.slug,
        price: item.price,
        qty: item.qty,
        name: item.name,
        image: item.images[0],
        fee_shipping: 0,
        id: item.id,
        url: item.url
    }));

    React.useEffect(() => {
        if (cartData) {
            setCarts(cartData.availables);
            setUnavailableCarts(cartData.unavailables);
        }
    }, [cartData])

    const loadSuccess = () => {
        refetch();
    }

    const showModal = (title, onOk, ids = []) => {
        setModalConfig({
            title,
            onOk,
            ids
        });
        setIsModalOpen(true);
    };

    const handleOk = () => {
        modalConfig.onOk();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const removeCart = (ids) => {
        if (ids && ids.length) {
            showModal('Bạn có chắc chắn muốn xoá sản phẩm này?', () => {
                removeCarts({ ids: ids })
                    .then(({ data }) => {
                        if (data?.code == 1) {
                            refetch();
                            toast.success('Xóa giỏ hàng thành công!')
                        } else {
                            toast.error('Xóa giỏ hàng thất bại!')
                        }
                    })
                    .catch((error) => {
                        toast.error('Xóa giỏ hàng thất bại!')
                    })
            }, ids);
        }
    }

    const removeAllAvailableCart = () => {
        showModal('Bạn chắc chắn muốn bỏ tất cả sản phẩm này?', () => {
            removeAllCarts({ unavailable: false })
                .then(({ data }) => {
                    if (data?.code == 1) {
                        refetch();
                        toast.success('Xóa thành công!')
                    } else {
                        toast.error('Xóa thất bại!')
                    }
                })
                .catch((error) => {
                    toast.error('Xóa thất bại!')
                })
        });
    }

    const removeAllUnavailableCart = () => {
        showModal('Bạn chắc chắn muốn bỏ tất cả sản phẩm không hoạt động này?', () => {
            removeAllCarts({ unavailable: true })
                .then(({ code }) => {
                    if (code) {
                        refetch();
                        toast.success('Xóa thành công!')
                    } else {
                        toast.error('Xóa thất bại!')
                    }
                })
                .catch((error) => {
                    toast.error('Xóa thất bại!')
                })
        });
    }

    const pageProps = {
        ...props,
        carts,
        unavailableCarts,
        loading,
        user,
        priceList,
        refetch,
        removeCart,
        removeAllAvailableCart,
        removeAllUnavailableCart
    }

    return (
        <>
            <div className='page-carts'>
                <div className='max-w-[1320px] mx-auto'>
                    <nav aria-label="breadcrumb" className='breadcrumb'>
                        <ol className="breadcrumb-list">
                            <li className="breadcrumb-item">
                                <Link href="/"><i className='bx bx-home-alt-2' />Trang chủ</Link>
                            </li>
                            <li className="breadcrumb-item active">
                                <i className='bx bx-chevron-right' />
                                <span>Giỏ hàng</span>
                            </li>
                        </ol>
                    </nav>
                    <PendingV {...pageProps} />
                </div>
            </div>
            <Modal
                title={modalConfig.title}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Xác nhận"
                cancelText="Quay lại"
            />
        </>
    );
}

export default CartV

