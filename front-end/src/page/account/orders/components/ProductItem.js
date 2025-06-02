import React from 'react';
import dayjs from 'dayjs';
import Image from 'next/image'
import Link from 'next/link';
import { formatCurrency } from '../../../../helpers/format_price';
import './style.scss'

const ItemProduct = ({ item }) => {
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
                        <div className="cart-item-total">{formatCurrency(item?.amount)} đ</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const objStatus = {
    pending: { label: 'Đang xử lý', color: '#f35048' },
    success: { label: 'Mua thành công', color: '#19ca19' },
    approved: { label: 'Đã duyệt mua', color: '#2866cf' },
    shipping: { label: 'Đang vận chuyển', color: '#ff7d01' },
    cancelled: { label: 'Đơn bị hủy', color: '#999' },
};


export default ItemProduct;
