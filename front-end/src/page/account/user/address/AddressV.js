'use client'
import './style.scss';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AddressModal from './AddressModal';
import EmptyV from '../../../../components/commons/empty';
import { useUser } from '../../../../provider/UserProvider';
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa'
import { useAddress } from '../../../../query/profile';
import { removeAddress } from '../../../../services/auth';
import { Button, Modal } from 'antd';
import Link from 'next/link';

const AddressV = (props) => {
    const { user } = useUser();
    const { data: addresses, refetch } = useAddress();
    const [show, setShow] = useState(false)
    const [item, setItem] = useState(null)

    const [confirmVisible, setConfirmVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const handleConfirmRemove = async () => {
        if (!selectedAddress?._id) return;
        try {
            const data = await removeAddress(selectedAddress._id);
            if (data?.data.code === 1) {
                toast.success('Hủy thành công!');
                refetch();
            } else {
                toast.error('Hủy thất bại!');
            }
        } catch (error) {
            toast.error('Hủy thất bại!');
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
        setItem(item)
        setShow(true)
    }

    return (
        <>
            <nav aria-label="breadcrumb" className='breadcrumb'>
                <ol className="breadcrumb-list">
                    <li className="breadcrumb-item">
                        <Link href="/"><i className='bx bx-home-alt-2' />Trang chủ</Link>
                    </li>
                    <li className="breadcrumb-item active">
                        <i className='bx bx-chevron-right' />
                        <span>Sổ địa chỉ</span>
                    </li>
                </ol>
            </nav>
            <div className='page-address'>
                <div className='body-page'>
                    <div className='pannel-address'>
                        <div className='content-address'>
                            {addresses && addresses?.data?.length > 0
                                ?
                                <div className="box-item">
                                    <ul className='list-address'>
                                        {addresses?.data.map((item, key) => (
                                            <li className={`item-address`} value={item._id} key={key}>
                                                <div className='flex flex-col gap-3'>
                                                    <label className='add-name'>
                                                        <i className="fa-solid fa-user text-[13px]"></i>&ensp;<span className="bold">{item.name}</span>
                                                        &emsp;&emsp;
                                                        {item.primary && <span className='text-success'><i className='bx bx-check-circle align-middle' />&ensp;Địa chỉ chính</span>}
                                                    </label>
                                                    <label className='add-contact'>
                                                        <span className='label-add'><i className="fa-solid fa-phone"></i>&ensp;Số ĐT:</span>
                                                        <span>{item.phone}</span>
                                                    </label>
                                                    <label className='add-contact'>
                                                        <span className='label-add'><i className="fa-solid fa-location-dot text-[13px]"></i>&ensp;Địa chỉ:</span>
                                                        <span>{item.address}, {item.ward_name}, {item.district_name}, {item.province_name}</span>
                                                    </label>
                                                    <div onClick={(e) => e.preventDefault()} className='address-action'>
                                                        {item.type === 'home' ? <span className="tag home">Nhà riêng</span> : <span className="tag offfice">Văn phòng</span>}
                                                        <span onClick={() => editAddress(item)} className='icon-action'><FaRegEdit /></span>
                                                        <span onClick={() => showConfirmModal(item)} className='icon-action'><FaRegTrashAlt /></span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className='btn-add-address'>
                                        <Button className='add-address' color='primary' onClick={() => editAddress(null)}><i className="fa fa-plus" />Thêm địa chỉ mới</Button>
                                    </div>
                                </div>
                                :
                                <EmptyV title="Chưa có địa chỉ nhận hàng!">
                                    <Button color='primary' onClick={() => editAddress(null)} >Thêm mới</Button>
                                </EmptyV>
                            }
                        </div>
                    </div>
                </div>

                <AddressModal open={show} close={setShow} address={item} user={user} refresh={refetch} />

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
            </div></>
    )
}

export default AddressV;
