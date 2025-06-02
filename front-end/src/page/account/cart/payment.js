import React, { useState, useEffect } from 'react';
import './style.scss';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@nextui-org/react';
import EmptyV from '../../../components/commons/empty';
import ViewAddress from '../../account/user/address/ViewAddress';
import { formatCurrency } from '../../../helpers/format_price';
import { paymentByZaloPay, getShop, getService, calculateFee } from '../../../services/common';
import { useAddress } from '../../../query/profile';

const PaymentV = ({ user, purchase, onBack }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [address, setAddress] = useState(null);
  const [open, setOpen] = useState(false);
  const [shopData, setShopData] = useState([]);
  const [service, setService] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);

  const { data: addresses, refetch } = useAddress();
  const hasAddress = addresses?.data?.length > 0;

  useEffect(() => {
    if (purchase?.length > 0) {
      setSelectedItems(purchase.map(item => item.id));
      setSelectAll(true);
    }
  }, [purchase]);

  useEffect(() => {
    if (hasAddress) {
      const defaultAddr = addresses.data.find(i => i.primary) || addresses.data[0];
      setAddress(defaultAddr);
    }
  }, [addresses]);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const shop = await getShop();
        setShopData(shop);
      } catch (err) {
        console.error('Lỗi lấy shop:', err);
      }
    };
    fetchShop();
  }, []);

  useEffect(() => {
    const fetchServiceAndFee = async () => {
      if (!address || !shopData?.shops?.shops?.[1]?.district_id) return;

      try {
        const res = await getService({
          from_district: shopData.shops.shops[1].district_id,
          to_district: address.district_id,
          weight: 500
        });
        setService(res);

        const selectedService = res?.services?.[0];
        if (selectedService?.service_id) {
          const feeRes = await calculateFee({
            service_id: selectedService.service_id,
            from_district_id: shopData.shops.shops[1].district_id,
            from_ward_code: shopData.shops.shops[1].ward_code,
            to_district_id: address.district_id,
            to_ward_code: address.ward_id,
            height: 10,
            length: 20,
            width: 15,
            weight: 500,
            insurance_value: 0,
          });
          setShippingFee(feeRes?.data?.total || 0);
        }
      } catch (err) {
        console.error('Lỗi gọi API service/fee:', err);
      }
    };

    fetchServiceAndFee();
  }, [address, shopData]);

  const changeAddress = (item, show) => {
    if (item?._id) {
      setAddress(item);
      setOpen(show);
    }
  };

  const handleRemoveItem = id => removeCart([id]);
  const handleRemoveAll = () => removeAllAvailableCart();

  const handleSelectAll = checked => {
    setSelectAll(checked);
    setSelectedItems(checked ? purchase.map(item => item.id) : []);
  };

  const handleSelectItem = (id, checked) => {
    const updated = checked
      ? [...selectedItems, id]
      : selectedItems.filter(itemId => itemId !== id);
    setSelectedItems(updated);
    setSelectAll(updated.length === purchase.length);
  };

  const calculateProductTotal = () =>
    purchase
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.qty, 0);

  const calculateTotal = () =>
    calculateProductTotal() + shippingFee;

  const handleCheckout = async () => {
    const amount = calculateTotal();
    if (!address || selectedItems.length === 0 || amount <= 0) return;

    try {
      const response = await paymentByZaloPay({
        amount,
        address,
        items: purchase
          .filter(item => selectedItems.includes(item.id))
          .map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            images: item.image,
            url: item.url,
            fee_shipping: shippingFee
          }))
      });

      const { order_url } = response.data;
      if (order_url) {
        window.location.href = order_url;
      } else {
        toast.error('Không thể tạo đơn hàng ZaloPay');
      }
    } catch (error) {
      console.error('ZaloPay error:', error);
      toast.error('Lỗi khi tạo đơn hàng ZaloPay');
    }
  };

  return (
    <div className="cart-page">
      <div className="box-info">
        <div className="card-address">
          <div className="panel-header head-address">
            <label className="title-pannel"><i className="fa-solid fa-location-dot" /> Thông tin nhận hàng</label>
            <div className="pull-right">
              {hasAddress && (
                <label className="address-more">
                  Bạn muốn giao hàng tới địa chỉ khác? <span onClick={() => setOpen(true)}>Thay đổi</span>
                </label>
              )}
            </div>
          </div>
          <div className="body-address">
            {hasAddress ? (
              <div className="row flex gap-2">
                <div className="address-name"><span className="bold">{address?.phone}</span></div>
                <div className="address-detail">
                  <div><span style={{ fontWeight: 600 }}>{address?.name}</span></div>
                  <div><span style={{ color: '#9e9e9e' }}>Email: {address?.email}</span></div>
                  <div><span style={{ color: '#9e9e9e' }}>Địa chỉ: {address?.address}, {address?.ward_name}, {address?.district_name}, {address?.province_name}</span></div>
                </div>
              </div>
            ) : (
              <EmptyV className="address-empty" description={<span>Chưa có địa chỉ nhận hàng!</span>}>
                <Button color="primary" onPress={() => setOpen(true)}>Thêm địa chỉ</Button>
              </EmptyV>
            )}
          </div>
        </div>

        <div className="cart-products-payment">
          <div className="cart-header flex items-center mb-2 justify-between">
            <div className="cart-select-all flex items-center">
              <input type="checkbox" checked={selectAll} onChange={e => handleSelectAll(e.target.checked)} className="w-5 h-5 accent-yellow-400" />
              <span style={{ marginLeft: '8px' }}>Chọn tất cả ({selectedItems.length} sản phẩm)</span>
            </div>
            {selectedItems.length > 0 && (
              <button className="cart-remove-all ml-4 text-yellow-500 text-sm" onClick={handleRemoveAll}>
                Xóa ({selectedItems.length} sản phẩm)
              </button>
            )}
          </div>

          {purchase?.length > 0 ? purchase.map((item, index) => (
            <div key={index} className="cart-shop-box">
              <div className="cart-shop-header flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={e => handleSelectItem(item.id, e.target.checked)} className="w-5 h-5" />
                  <span className="text-[14px]">B&Q Watches</span>
                </div>
                <button className="text-gray-400" onClick={() => handleRemoveItem(item.id)}>Xóa</button>
              </div>

              <div className="cart-item flex gap-4 items-center justify-between">
                <div className="cart-item-left flex-1 flex gap-3">
                  <Link href={item.url}>
                    <Image src={item.image} alt="B&Q Watches" className="cart-item-image rounded object-cover border" width={100} height={100} />
                  </Link>
                  <div className="cart-item-info">
                    <div className="cart-item-name"><Link href={item.url}>{item.name}</Link></div>
                    <div className="cart-item-price text-gray-500">Giá sản phẩm: <span className="ml-1">{formatCurrency(item.price)} đ</span></div>
                    <div className="cart-item-price text-gray-500">Phí vận chuyển: <span className="ml-1">Đang cập nhật...</span></div>
                  </div>
                </div>
                <span className="cart-item-qty">x {item.qty}</span>
                <div className="cart-item-total">{formatCurrency(item.price * item.qty)} đ</div>
              </div>
            </div>
          )) : (
            <EmptyV title="Giỏ hàng trống" description="Bạn chưa có sản phẩm nào trong giỏ hàng">
              <Link href="/"><Button color="primary">Tiếp tục mua sắm</Button></Link>
            </EmptyV>
          )}
        </div>
      </div>

      <div className="cart-summary">
        <div className="cart-summary-box">
          <div className="cart-summary-title">Hóa đơn</div>
          <div className="cart-summary-row-box">
            <div className="cart-summary-row"><span>Tổng tiền sản phẩm</span><span>{formatCurrency(calculateProductTotal())} đ</span></div>
            <div className="cart-summary-row"><span>Phí vận chuyển</span><span>{formatCurrency(shippingFee)} đ</span></div>
          </div>
          <div className="cart-summary-total"><span>Tổng tiền:</span> <span style={{ color: 'red' }}>{formatCurrency(calculateTotal())} đ</span></div>
          <div className="w-full flex gap-4">
            <button className="cart-checkout-btn" onClick={onBack}><i className="fa-solid fa-arrow-left mr-2" />Quay lại</button>
            <button
              className="cart-checkout-btn"
              disabled={!hasAddress || selectedItems.length === 0}
              onClick={handleCheckout}
            >
              Mua hàng
            </button>
          </div>
        </div>
      </div>

      {open && (
        <ViewAddress
          open={open}
          close={setOpen}
          customer={user}
          address={address}
          refresh={refetch}
          onChange={changeAddress}
        />
      )}
    </div>
  );
};

export default PaymentV;
