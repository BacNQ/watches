'use client';
import React, { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar';
import HeaderInfo from '../../components/header/HeaderInfo';
import { Table, Spin, Input, Row, Col, Button, Modal, Form, Select } from 'antd';
import { getAllUsers, createAccount, updatePassword, lockAccount } from '../../services/auth';
import Link from 'next/link';
import moment from 'moment';
import toast from 'react-hot-toast';
import { LockOutlined, KeyOutlined } from '@ant-design/icons';
import './style.scss';

const { Option } = Select;

const AccountV = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm] = Form.useForm();

    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [passwordForm] = Form.useForm();

    const fetchUsers = async ({ page = 1, pageSize = 10, search = '' }) => {
        setLoading(true);
        try {
            const response = await getAllUsers({ page, limit: pageSize, search: search.trim() });
            setUsers(response.data);
            setPagination({ current: page, pageSize: pageSize, total: response.total });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers({ page: pagination.current, pageSize: pagination.pageSize });
    }, []);

    const handleTableChange = (pagination) => {
        fetchUsers({ page: pagination.current, pageSize: pagination.pageSize, search: searchTerm });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            fetchUsers({ page: 1, pageSize: pagination.pageSize, search: searchTerm });
        }
    };

    const handleCreateAccount = async (values) => {
        try {
            await createAccount(values);
            toast.success('Tạo tài khoản thành công!');
            setIsCreateModalOpen(false);
            fetchUsers({ page: 1, pageSize: pagination.pageSize, search: searchTerm });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi tạo tài khoản');
        }
    };

    const handleLockUser = async () => {
        try {
            await lockAccount(selectedUserId);
            toast.success('Đã khóa tài khoản!');
            setIsLockModalOpen(false);
            fetchUsers({ page: pagination.current, pageSize: pagination.pageSize, search: searchTerm });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi khi khóa tài khoản');
        }
    };

    const handleChangePassword = async (values) => {
        try {
            await updatePassword(values);
            toast.success('Đổi mật khẩu thành công!');
            setIsChangePasswordModalOpen(false);
            passwordForm.resetFields();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi đổi mật khẩu');
        }
    };

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'username',
            key: 'username',
            align: 'center',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            align: 'center',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'center',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role) => <span>{role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</span>,
            align: 'center',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => moment(createdAt).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            align: 'center',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                    <Button
                        icon={<KeyOutlined />}
                        onClick={() => {
                            setSelectedUserId(record._id);
                            setIsChangePasswordModalOpen(true);
                        }}
                    />
                    <Button
                        icon={<LockOutlined />}
                        danger
                        onClick={() => {
                            setSelectedUserId(record._id);
                            setIsLockModalOpen(true);
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="account-manage">
            <SideBar />
            <div className="body-content">
                <HeaderInfo />
                <div className="main-content">
                    <nav aria-label="breadcrumb" className="breadcrumb">
                        <ol className="breadcrumb-list">
                            <li className="breadcrumb-item">
                                <Link href="/"><i className="bx bx-home-alt-2" />Trang chủ</Link>
                            </li>
                            <li className="breadcrumb-item active">
                                <i className="bx bx-chevron-right" />
                                <span>Quản lý tài khoản</span>
                            </li>
                        </ol>
                    </nav>

                    <Row justify="space-between" style={{ marginBottom: 20 }}>
                        <Col>
                            <Input
                                placeholder="Tìm theo tên, email, số điện thoại..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearch}
                                style={{ width: 400 }}
                                allowClear
                            />
                        </Col>
                        <Col>
                            <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
                                <i className="fa-solid fa-plus"></i> Tạo tài khoản
                            </Button>
                        </Col>
                    </Row>

                    <Spin spinning={loading}>
                        <Table
                            columns={columns}
                            dataSource={users}
                            rowKey="_id"
                            pagination={pagination}
                            onChange={handleTableChange}
                        />
                    </Spin>

                    <Modal
                        title="Tạo tài khoản mới"
                        open={isCreateModalOpen}
                        onCancel={() => setIsCreateModalOpen(false)}
                        footer={null}
                    >
                        <Form layout="vertical" form={createForm} onFinish={handleCreateAccount}>
                            <Form.Item
                                name="username"
                                label="Tên người dùng"
                                rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="phone" label="Số điện thoại">
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                            >
                                <Input type="email" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="role"
                                label="Vai trò"
                                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                            >
                                <Select placeholder="Chọn vai trò">
                                    <Option value="user">Người dùng</Option>
                                    <Option value="admin">Quản trị viên</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Lưu
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Đổi mật khẩu"
                        open={isChangePasswordModalOpen}
                        onCancel={() => {
                            passwordForm.resetFields();
                            setIsChangePasswordModalOpen(false);
                        }}
                        footer={null}
                    >
                        <Form layout="vertical" form={passwordForm} onFinish={handleChangePassword}>
                            <Form.Item
                                name="oldPassword"
                                label="Mật khẩu cũ"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Mật khẩu mới"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="confirmpassword"
                                label="Xác nhận mật khẩu mới"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Đổi mật khẩu
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Xác nhận khóa tài khoản"
                        open={isLockModalOpen}
                        onCancel={() => setIsLockModalOpen(false)}
                        onOk={handleLockUser}
                        okText="Xác nhận"
                        okButtonProps={{ danger: true }}
                        cancelText="Hủy"
                    >
                        <p>Bạn có chắc chắn muốn khóa tài khoản này không?</p>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default AccountV;
