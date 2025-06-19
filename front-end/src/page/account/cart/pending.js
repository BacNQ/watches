import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic';
import './style.scss'
import { formatCurrency } from '../../../helpers/format_price'
import EmptyV from '../../../components/commons/empty/index';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation'

const PaymentV = dynamic(() => import('./payment'))

const PendingV = (props) => {
    const { carts, unavailableCarts, loading, user, priceList, removeCart, removeAllAvailableCart, removeAllUnavailableCart } = props
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [show, setShow] = useState(false);
    const [quantities, setQuantities] = useState({});
    const [errors, setErrors] = useState({});
    const searchParams = useSearchParams();
    const selectedSlug = searchParams.get('selected');

    useEffect(() => {
        if (priceList?.length > 0) {
            const initialQuantities = {};
            priceList.forEach(item => {
                initialQuantities[item.id] = item.qty || 1;
            });
            setQuantities(initialQuantities);

            if (selectedSlug) {
                const matchedItem = priceList.find(item => item.slug === selectedSlug);
                if (matchedItem) {
                    setSelectedItems([matchedItem.id]);
                    setSelectAll(false);
                }
            } else {
                setSelectedItems([]);
                setSelectAll(false);
            }
        }
    }, [priceList, selectedSlug]);

    const handleRemoveItem = (id) => {
        removeCart([id]);
        setQuantities(prev => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }

    const handleRemoveAll = () => {
        removeAllAvailableCart();
        setQuantities({});
        setSelectedItems([]);
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

    const handleChangeQuantity = (id, value) => {
        let val = parseInt(value, 10);
        if (isNaN(val) || val < 1) val = 1;

        const stock = priceList.find(item => item.id === id)?.stock;
        if (stock !== null && stock !== undefined) {
            if (val > stock) {
                setQuantities(prev => ({
                    ...prev,
                    [id]: stock
                }));
                setErrors(prev => ({
                    ...prev,
                    [id]: 'Số lượng vượt quá giới hạn sản phẩm còn lại!'
                }));
            } else {
                setQuantities(prev => ({
                    ...prev,
                    [id]: val
                }));
                setErrors(prev => {
                    const copy = { ...prev };
                    delete copy[id];
                    return copy;
                });
            }
        } else {
            if (val > 999) val = 999;
            setQuantities(prev => ({
                ...prev,
                [id]: val
            }));
            setErrors(prev => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });
        }
    }

    const handleIncrease = (id) => {
        const current = quantities[id] || 1;
        const stock = priceList.find(item => item.id === id)?.stock;
        if (stock !== null && stock !== undefined) {
            if (current < stock) {
                setQuantities(prev => ({
                    ...prev,
                    [id]: current + 1
                }));
                setErrors(prev => {
                    const copy = { ...prev };
                    delete copy[id];
                    return copy;
                });
            } else {
                setErrors(prev => ({
                    ...prev,
                    [id]: 'Số lượng vượt quá giới hạn sản phẩm còn lại!'
                }));
            }
        } else {
            if (current < 999) {
                setQuantities(prev => ({
                    ...prev,
                    [id]: current + 1
                }));
            }
            setErrors(prev => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });
        }
    }

    const handleDecrease = (id) => {
        const current = quantities[id] || 1;
        if (current > 1) {
            setQuantities(prev => ({
                ...prev,
                [id]: current - 1
            }));
            setErrors(prev => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });
        }
    }

    const calculateTotal = () => {
        return priceList
            .filter(item => selectedItems.includes(item.id))
            .reduce((total, item) => {
                const qty = quantities[item.id] || 1;
                return total + (item.price * qty + (item.fee_shipping || 0));
            }, 0);
    }

    const calculateProductTotal = () => {
        return priceList
            .filter(item => selectedItems.includes(item.id))
            .reduce((total, item) => {
                const qty = quantities[item.id] || 1;
                return total + (item.price * qty);
            }, 0);
    }

    const calculateShippingTotal = () => {
        return priceList
            .filter(item => selectedItems.includes(item.id))
            .reduce((total, item) => total + (item.fee_shipping || 0), 0);
    }

    const selectedProducts = priceList
        .filter(item => selectedItems.includes(item.id))
        .map(item => ({
            ...item,
            qty: quantities[item.id] || 1,
        }));

    if (show) {
        return (
            <PaymentV
                purchase={selectedProducts}
                user={user}
                onBack={() => setShow(false)}
            />
        );
    }

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

                {priceList?.length > 0 ? priceList?.map((item, index) => {
                    const stock = item.stock;
                    const maxQty = stock !== null && stock !== undefined ? stock : 999;
                    return (
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
                                            Phí vận chuyển: <span className="ml-1">{item.fee_shipping ? formatCurrency(item.fee_shipping) + ' đ' : 'Chưa xác định'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="cart-item-quantity">
                                    <input
                                        type="number"
                                        min={1}
                                        max={maxQty}
                                        value={quantities[item.id] || 1}
                                        onChange={e => handleChangeQuantity(item.id, e.target.value)}
                                        className="input-qty"
                                    />
                                    <div className="arrow-controls">
                                        <button
                                            className="arrow-btn"
                                            onClick={() => handleIncrease(item.id)}
                                            aria-label="Tăng"
                                            type="button"
                                            disabled={stock !== null && stock !== undefined && (quantities[item.id] || 1) >= stock}
                                        >▲</button>
                                        <button
                                            className="arrow-btn"
                                            onClick={() => handleDecrease(item.id)}
                                            aria-label="Giảm"
                                            type="button"
                                            disabled={(quantities[item.id] || 1) <= 1}
                                        >▼</button>
                                    </div>
                                    {errors[item.id] && (
                                        <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>
                                            {errors[item.id]}
                                        </div>
                                    )}
                                </div>

                                <div className="cart-item-total">{formatCurrency(item.price * (quantities[item.id] || 1))} đ</div>
                            </div>
                        </div>
                    );
                })
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
                        <button className="cart-checkout-btn" style={{ fontSize: 16 }} disabled={selectedItems.length === 0} onClick={() => setShow(true)}>
                            Đặt hàng ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PendingV
