import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic';
import './style.scss'
import { formatCurrency } from '../../../helpers/format_price'
import EmptyV from '../../../components/commons/empty/index';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { paymentByZaloPay } from '../../../services/common';
// import ViewAddress from '../../account/user/address/ViewAddress';
// import { useAddress } from '../../../query/profile';

const PendingV = (props) => {
    const { carts, unavailableCarts, loading, user, priceList, removeCart, removeAllAvailableCart, removeAllUnavailableCart } = props
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    // const { data: addresses, refetch } = useAddress();
    // const [address, setAddress] = useState(null)
    // const [open, setOpen] = useState(false)

    // useEffect(() => {
    //     if (addresses && addresses.length) {
    //         let _address = addresses.find(i => i.primary);
    //         if (!_address) _address = addresses[0];
    //         setAddress(_address)
    //     }
    // }, [addresses])

    const changeAddress = (item, show) => {
        if (item && item._id) {
            setAddress(item)
            setOpen(show)
        }
    }

    useEffect(() => {
        setSelectedItems([]);
        setSelectAll(false);
    }, [priceList]);

    const handleRemoveItem = (id) => {
        removeCart([id]);
    }

    const handleRemoveAll = () => {
        removeAllAvailableCart();
    }

    const handleSelectAll = (checked) => {
        setSelectAll(checked);
        if (checked) {
            setSelectedItems(priceList.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    }

    const handleSelectItem = (id, checked) => {
        if (checked) {
            setSelectedItems([...selectedItems, id]);
            if (selectedItems.length + 1 === priceList.length) {
                setSelectAll(true);
            }
        } else {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
            setSelectAll(false);
        }
    }

    const calculateTotal = () => {
        return priceList
            .filter(item => selectedItems.includes(item.id))
            .reduce((total, item) => total + (item.price * item.qty + item.fee_shipping), 0);
    }

    const calculateProductTotal = () => {
        return priceList
            .filter(item => selectedItems.includes(item.id))
            .reduce((total, item) => total + (item.price * item.qty), 0);
    }

    const calculateShippingTotal = () => {
        return priceList
            .filter(item => selectedItems.includes(item.id))
            .reduce((total, item) => total + item.fee_shipping, 0);
    }

    const handleCheckout = async () => {
        const selectedProducts = priceList.filter(item => selectedItems.includes(item.id));
        console.log('helo', selectedProducts)
        const amount = calculateTotal();

        if (selectedProducts.length === 0 || amount <= 0) return;

        try {
            const response = await paymentByZaloPay({
                amount: amount,
                items: selectedProducts.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    qty: item.qty,
                    image: item.image,
                    url: item.url,
                    fee_shipping: item.fee_shipping
                })),
            });

            const { order_url } = response.data;

            if (order_url) {
                window.location.href = order_url;
            } else {
                alert('Không thể tạo đơn hàng ZaloPay');
            }
        } catch (error) {
            console.error('ZaloPay error:', error);
            alert('Lỗi khi tạo đơn hàng ZaloPay');
        }
    };

    return (
        <div className="cart-page">
            <div className="cart-products">
                <div className="cart-header flex items-center mb-2 justify-between">
                    <div className="cart-select-all flex items-center">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="w-5 h-5 accent-yellow-400"
                        />
                        <span style={{ marginLeft: '8px' }}>Chọn tất cả ({selectedItems.length} sản phẩm)</span>
                    </div>
                    {selectedItems.length > 0 && (
                        <button
                            className="cart-remove-all ml-4 text-yellow-500 text-sm"
                            onClick={handleRemoveAll}
                        >
                            Xóa ({selectedItems.length} sản phẩm)
                        </button>
                    )}
                </div>

                {priceList?.length > 0 ? priceList?.map((item, index) => (
                    <div key={index} className="cart-shop-box">
                        <div className="cart-shop-header flex items-center justify-between mb-4">
                            <div className='flex items-center gap-2'>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                                    className="w-5 h-5"
                                />
                                <span className='text-[14px]'>B&Q Watches</span>
                            </div>
                            <button className="text-gray-400" onClick={() => handleRemoveItem(item.id)}>Xóa</button>
                        </div>

                        <div className="cart-item flex gap-4 items-center justify-between">
                            <div className='cart-item-left flex-1 flex gap-3'>
                                <Link href={item.url}>
                                    <Image
                                        src={item.image}
                                        alt='B&Q Watches'
                                        className="cart-item-image rounded object-cover border"
                                        width={100}
                                        height={100}
                                    />
                                </Link>
                                <div className="cart-item-info">
                                    <div className="cart-item-name">
                                        <Link href={item.url}>{item.name}</Link>
                                    </div>
                                    <div className="cart-item-price text-gray-500">
                                        Giá sản phẩm: <span className="ml-1">{formatCurrency(item.price)} đ</span>
                                    </div>
                                    <div className="cart-item-shipping text-gray-500">
                                        Phí vận chuyển: <span className="ml-1">{item.fee_shipping} đ</span>
                                    </div>
                                </div>
                            </div>
                            <span className="cart-item-qty">x {item.qty}</span>
                            <div className="cart-item-total">{formatCurrency(item.price * item.qty + item.fee_shipping)} đ</div>
                        </div>
                    </div>
                ))
                    :
                    <EmptyV loading={loading} title="Giỏ hàng trống" description={'Bạn chưa có sản phẩm nào trong giỏ hàng'}>
                        <Link href="/"><Button color='primary'>Tiếp tục mua sắm</Button></Link>
                    </EmptyV>
                }
            </div>

            <div className="cart-summary">
                <div className="cart-summary-box">
                    <div className="cart-summary-title">Hóa đơn</div>
                    <div className='cart-summary-row-box'>
                        <div className="cart-summary-row">
                            <span>Tổng tiền sản phẩm</span>
                            <span>{formatCurrency(calculateProductTotal())} đ</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>Phí vận chuyển</span>
                            <span>{formatCurrency(calculateShippingTotal())} đ</span>
                        </div>
                    </div>
                    <div className="cart-summary-total">
                        <span>Tổng tiền: </span>
                        <span style={{ color: 'red' }}>{formatCurrency(calculateTotal())} đ</span>
                    </div>
                    <div className='w-full'>
                        <button className="cart-checkout-btn" disabled={selectedItems.length === 0} onClick={handleCheckout}>
                            MUA HÀNG
                        </button>
                    </div>
                </div>
            </div>
            {/* {open && <ViewAddress open={open} close={setOpen} customer={user} address={address} refresh={refetch} onChange={changeAddress} />} */}
        </div>
    )
}
export default PendingV
