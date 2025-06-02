import React, { useState } from 'react';
import toast from 'react-hot-toast';
import AddressForm from './AddressForm';
import EmptyV from '../../../../components/commons/empty/index';
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa';
import { useAddress } from '../../../../query/profile';
import { Modal, Button } from 'antd';
import { removeAddress } from '../../../../services/auth';
import './view.scss'

const ViewAddress = (props) => {
    const { open, close, address, onChange } = props;
    const [show, setShow] = useState(false);
    const [item, setItem] = useState(null);
    const { data: addresses, refetch } = useAddress();
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const handleConfirmRemove = async () => {
        if (!selectedAddress?._id) return;
        try {
            const data = await removeAddress(selectedAddress._id);
            if (data?.data.code === 1) {
                toast.success('Xóa thành công!');
                refetch();
            } else {
                toast.error('Xóa thất bại!');
            }
        } catch (error) {
            toast.error('Xóa thất bại!');
        } finally {
            setConfirmVisible(false);
            setSelectedAddress(null);
        }
    }

    const showConfirmModal = (record) => {
        setSelectedAddress(record);
        setConfirmVisible(true);
    }

    const editAddress = (item) => {
        setItem(item);
        setShow(true);
    };

    return (
        <>
            <Modal
                title={
                    show ? (
                        <div className="modal-back">
                            <span className="icon-back cursor-pointer hover:text-red-500" onClick={() => setShow(false)}>
                                <i className="fa fa-chevron-left mr-2 text-[13px]" />
                            </span>
                            <span style={{ fontWeight: 600 }}>{item ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</span>
                        </div>
                    ) : (
                        <span style={{ fontWeight: 600 }}>Danh sách địa chỉ</span>
                    )
                }
                open={open}
                onCancel={() => close(false)}
                footer={null}
                width={800}
                className="modal-address"
            >
                <div className="popup-body">
                    <div className="pannel-address">
                        {!show ? (
                            <div className="box-item">
                                {addresses && addresses?.data.length > 0 ? (
                                    <>
                                        <ul className="list-address" value={address?._id || address?.address_id || ''}>
                                            {addresses?.data.map((item, key) => {
                                                let selected = (address?._id || address?.address_id) === item._id;
                                                return (
                                                    <li
                                                        className={`item-address ${selected ? 'seleted' : ''}`}
                                                        value={item._id}
                                                        onClick={() => onChange(item, false)}
                                                        key={key}
                                                    >
                                                        <div className='relative'>
                                                            <div className='info-address'>
                                                                <label className="add-name" style={{ fontWeight: 600 }}>{item.name}</label>
                                                                <label>{item.phone}</label>
                                                                <label className="add-contact">{item.address}, {item.ward_name}, {item.district_name}, {item.province_name}</label>
                                                            </div>
                                                            <div onClick={(e) => e.preventDefault()} className="address-action">
                                                                <span className="tag">{item.type === 'home' ? 'Nhà riêng' : 'Văn phòng'}</span>
                                                                <span
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        editAddress(item);
                                                                    }}
                                                                    className="icon-action cursor-pointer"
                                                                >
                                                                    <FaRegEdit />
                                                                </span>
                                                                <span
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        showConfirmModal(item);
                                                                    }}
                                                                    className="icon-action cursor-pointer"
                                                                >
                                                                    <FaRegTrashAlt />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        {/* <div className="btn-add-address">
                                            <span className="add-address" onClick={() => editAddress(null)}>
                                                <i className="fa fa-plus" /> &ensp;Thêm địa chỉ mới
                                            </span>
                                        </div> */}
                                    </>
                                ) : (
                                    <EmptyV status="empty" title="Chưa có địa chỉ nhận hàng!">
                                        <Button type="primary" onClick={() => editAddress(null)}>Thêm địa chỉ mới</Button>
                                    </EmptyV>
                                )}
                            </div>
                        ) : (
                            <div className="box-item">
                                <AddressForm refresh={refetch} address={item} close={setShow} />
                            </div>
                        )}

                    </div>
                </div>
            </Modal>

            <Modal
                title="Xác nhận xoá"
                open={confirmVisible}
                onOk={handleConfirmRemove}
                onCancel={() => setConfirmVisible(false)}
                okText="Có"
                cancelText="Không"
            >
                <p>Bạn có chắc chắn muốn xoá địa chỉ này không?</p>
            </Modal>
        </>
    );
};

export default ViewAddress
