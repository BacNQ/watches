'use client';
import React, { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar';
import './style.scss';
import HeaderInfo from '../../components/header/HeaderInfo';
import { Table, Spin, Tooltip, Image, Select, Modal, Input, Button, Space } from 'antd';
import { getAllOrders, updateOrderStatus, cancelOrder, generateInvoice } from '../../services/order';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FilePdfOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const OrdersV = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelNote, setCancelNote] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditingStatus, setIsEditingStatus] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await getAllOrders({ search: searchQuery, status: selectedStatus });
                setOrders(res?.data?.results || []);
            } catch (error) {
                toast.error('Lỗi khi tải đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [searchQuery, selectedStatus]);

    const renderStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'Đang xử lý';
            case 'approved':
                return 'Đã duyệt mua';
            case 'shipping':
                return 'Đang giao hàng';
            case 'success':
                return 'Mua thành công';
            case 'cancelled':
                return 'Đơn bị hủy';
            default:
                return status;
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            toast.success('Cập nhật trạng thái thành công!');
            const res = await getAllOrders({ search: searchQuery, status: selectedStatus });
            setOrders(res?.data?.results || []);
            setIsEditingStatus(false);
        } catch (error) {
            toast.error('Lỗi khi cập nhật trạng thái');
        }
    };

    const handleCancelOrder = async () => {
        if (!cancelNote.trim()) {
            toast.error('Lý do hủy đơn không được để trống!');
            return;
        }
        try {
            await cancelOrder(selectedOrder._id, cancelNote);
            toast.success('Hủy đơn thành công!');
            setIsCancelModalVisible(false);
            const res = await getAllOrders({ search: searchQuery, status: selectedStatus });
            setOrders(res?.data?.results || []);
        } catch (error) {
            toast.error('Lỗi khi hủy đơn hàng');
        }
    };

    const handleGenerateInvoice = async (orderId) => {
        try {
            const response = await generateInvoice(orderId, { responseType: 'blob' });

            const blob = response.data;
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);

            link.href = url;
            link.download = `invoice_${orderId}.pdf`;
            link.click();

            window.URL.revokeObjectURL(url);

            toast.success('Hóa đơn đã được tải về!');
        } catch (error) {
            toast.error('Lỗi khi xuất hóa đơn');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            const fetchOrders = async () => {
                setLoading(true);
                try {
                    const res = await getAllOrders({ search: searchQuery, status: selectedStatus });
                    setOrders(res?.data?.results || []);
                } catch (error) {
                    toast.error('Lỗi khi tải đơn hàng');
                } finally {
                    setLoading(false);
                }
            };

            fetchOrders();
        }
    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'app_trans_id',
            key: 'app_trans_id',
            align: 'center'
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `${amount?.toLocaleString()}`,
            align: 'center'
        },
        {
            title: 'Phí ship',
            key: 'fee_shipping',
            align: 'center',
            render: (_, record) =>
                record.items && record.items[0]
                    ? `${record.items[0].fee_shipping?.toLocaleString()}`
                    : 'N/A',
        },
        {
            title: 'Địa chỉ giao hàng',
            key: 'full_address',
            render: (_, record) => {
                const a = record.address;
                const fullAddress = `${a.address}, ${a.ward_name}, ${a.district_name}, ${a.province_name}`;
                return (
                    <Tooltip title={fullAddress}>
                        <div style={{ maxWidth: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {fullAddress}
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Người nhận',
            dataIndex: ['address', 'name'],
            key: 'receiver_name',
            align: 'center'
        },
        {
            title: 'Số điện thoại',
            dataIndex: ['address', 'phone'],
            key: 'receiver_phone',
            align: 'center',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            width: 150,
            render: (date) => new Date(date).toLocaleString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => renderStatus(status),
            align: 'center'
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <div className="action-buttons">
                    <Tooltip title="Xuất hóa đơn">
                        <Button
                            icon={<FilePdfOutlined />}
                            onClick={() => handleGenerateInvoice(record._id)}
                        />
                    </Tooltip>
                    <Tooltip title="Cập nhật trạng thái">
                        <Button
                            icon={<EditOutlined />}
                            style={{ marginLeft: 10 }}
                            onClick={() => {
                                setSelectedOrder(record);
                                setSelectedStatus(record.status);
                                setIsEditingStatus(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Hủy đơn">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            style={{ marginLeft: 10 }}
                            onClick={() => {
                                setSelectedOrder(record);
                                setIsCancelModalVisible(true);
                            }}
                        />
                    </Tooltip>
                </div>
            ),
            align: 'center'
        },
    ];

    const expandedRowRender = (record) => {
        const productColumns = [
            {
                title: 'Tên sản phẩm',
                dataIndex: 'name',
                key: 'name',
                render: (text) => (
                    <Tooltip title={text}>
                        <div style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {text}
                        </div>
                    </Tooltip>
                ),
            },

            {
                title: 'Hình ảnh',
                dataIndex: 'images',
                key: 'image',
                width: 100,
                align: 'center',
                render: (images) =>
                    images && images[0] ? (
                        <Image
                            src={images[0]}
                            alt="Ảnh sản phẩm"
                            width={50}
                            height={50}
                        />
                    ) : (
                        'Không có ảnh'
                    ),
            },
            {
                title: 'Số lượng',
                dataIndex: 'qty',
                key: 'qty',
                width: 100,
                align: 'center'
            },
            {
                title: 'Giá sản phẩm',
                dataIndex: 'price',
                key: 'price',
                align: 'center',
                width: 150,
                render: (price) => `${price?.toLocaleString()}`,
            },
            {
                title: 'Đường dẫn',
                dataIndex: 'url',
                key: 'url',
                render: (url) => (
                    <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                ),
            },
        ];

        return (
            <Table
                columns={productColumns}
                dataSource={record.items || []}
                rowKey="_id"
                pagination={false}
            />
        );
    };

    return (
        <div className='order-manage'>
            <SideBar />
            <div className='body-content'>
                <HeaderInfo />
                <div className='main-content'>
                    <div className='main-header'>
                        <nav aria-label="breadcrumb" className='breadcrumb'>
                            <ol className="breadcrumb-list">
                                <li className="breadcrumb-item">
                                    <Link href="/"><i className='bx bx-home-alt-2' />Trang chủ</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    <i className='bx bx-chevron-right' />
                                    <span>Quản lý đơn hàng</span>
                                </li>
                            </ol>
                        </nav>

                        <div className="order-filter">
                            <Input
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyPress={handleSearchKeyPress}
                                placeholder="Tìm kiếm đơn hàng"
                                style={{ width: 300, marginRight: 10 }}
                            />
                            <Select
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                style={{ width: 200 }}
                                placeholder="Chọn trạng thái"
                            >
                                <Select.Option value="">Tất cả</Select.Option>
                                <Select.Option value="pending">Đang xử lý</Select.Option>
                                <Select.Option value="approved">Đã duyệt mua</Select.Option>
                                <Select.Option value="shipping">Đang giao hàng</Select.Option>
                                <Select.Option value="success">Mua thành công</Select.Option>
                                <Select.Option value="cancelled">Đơn bị hủy</Select.Option>
                            </Select>
                        </div>
                    </div>

                    <div className="order-table">
                        {loading ? (
                            <div className="loading-center">
                                <Spin size="large" />
                            </div>
                        ) : (
                            <Table
                                dataSource={orders}
                                columns={columns}
                                rowKey="_id"
                                expandable={{ expandedRowRender }}
                                pagination={{ pageSize: 10 }}
                            />
                        )}
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

            <Modal
                title="Cập nhật trạng thái đơn hàng"
                open={isEditingStatus}
                onOk={() => handleStatusChange(selectedOrder._id, selectedStatus)}
                onCancel={() => setIsEditingStatus(false)}
            >
                <Select
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    style={{ width: '100%' }}
                >
                    <Select.Option value="pending">Đang xử lý</Select.Option>
                    <Select.Option value="approved">Đã duyệt mua</Select.Option>
                    <Select.Option value="shipping">Đang giao hàng</Select.Option>
                    <Select.Option value="success">Mua thành công</Select.Option>
                    <Select.Option value="cancelled">Đơn bị hủy</Select.Option>
                </Select>
            </Modal>
        </div>
    );
};

export default OrdersV;
