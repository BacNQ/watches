import React, { useState } from 'react';
import dayjs from 'dayjs';
import Image from 'next/image'
import Link from 'next/link';
import { formatCurrency } from '../../../../helpers/format_price';
import { Button, Modal, Input } from 'antd';
import { cancelOrder } from '../../../../services/order'
import toast from 'react-hot-toast';
import './style.scss'

const ItemProduct = ({ item }) => {
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelNote, setCancelNote] = useState('');

    const handleCancelOrder = async () => {
        if (!cancelNote.trim()) {
            toast.error('Lý do hủy đơn không được để trống!');
            return;
        }
        try {
            await cancelOrder(selectedOrder._id, cancelNote);
            toast.success('Gửi yêu cầu hủy đơn thành công!');
            setIsCancelModalVisible(false);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            toast.error('Lỗi khi hủy đơn hàng');
        }
    };
    return (
        <div className="cart-page">
            <div className="cart-products">
                <div className="cart-shop-box">
                    <div className="cart-item flex gap-4 items-center justify-between">
                        <div className='cart-item-left flex-1 flex gap-3'>
                            <Link href={item?.items[0].url}>
                                <Image
                                    src={item?.items[0].images?.[0]}
                                    alt='B&Q Watches'
                                    className="cart-item-image rounded object-cover border"
                                    width={100}
                                    height={100}
                                />
                            </Link>
                            <div className="cart-item-info">
                                <div className="cart-item-name">
                                    <Link href={item?.items[0].url}>{item?.items[0].name}</Link>
                                </div>
                                <div className="cart-item-price text-gray-500">
                                    Mã đơn hàng: <span className="ml-1">{item.app_trans_id}</span>
                                </div>
                                <div className="cart-item-shipping text-gray-500">
                                    Tổng tiền: <span className="ml-1">{formatCurrency(item?.amount)} đ</span>
                                </div>
                                <div className="cart-item-shipping text-gray-500">
                                    Đã thanh toán vào: <span className="ml-1">{dayjs(item.paid_at).format('HH:mm | DD-MM-YYYY')}</span>
                                </div>
                            </div>
                        </div>
                        <span className="cart-item-qty">x {item?.items[0].qty}</span>
                        <div className="cart-item-total">{formatCurrency(item?.amount)} đ</div>
                        <div className='flex flex-col gap-5'>
                            {
                                item.status && objStatus[item.status] && (
                                    <div className="cart-item-status mt-2">
                                        <span
                                            className="tag-status"
                                            style={{ background: objStatus[item.status].color }}
                                        >
                                            <i className="fa fa-tag mr-2" />
                                            {objStatus[item.status].label}
                                        </span>
                                    </div>
                                )
                            }

                            {
                                item.status && item.status === 'pending' && (
                                    <Button onClick={() => {
                                        setSelectedOrder(item);
                                        setIsCancelModalVisible(true);
                                    }} style={{ borderRadius: 18 }}>Hủy đơn hàng</Button>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="Lý do hủy đơn hàng"
                open={isCancelModalVisible}
                onOk={handleCancelOrder}
                onCancel={() => setIsCancelModalVisible(false)}
            >
                <Input.TextArea
                    rows={4}
                    value={cancelNote}
                    onChange={(e) => setCancelNote(e.target.value)}
                    placeholder="Nhập lý do hủy đơn hàng"
                />
            </Modal>
        </div>
    );
};

const objStatus = {
    pending: { label: 'Đang xử lý', color: '#f35048' },
    success: { label: 'Mua thành công', color: '#19ca19' },
    approved: { label: 'Đã duyệt mua', color: '#2866cf' },
    shipping: { label: 'Đang vận chuyển', color: '#ff7d01' },
    cancelled: { label: 'Đơn bị hủy', color: '#999' },
    cancel_requested: { label: 'Đã gửi yêu cầu hủy đơn', color: '#f35048' },
};


export default ItemProduct;
