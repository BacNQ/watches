'use client';
import React, { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar';
import HeaderInfo from '../../components/header/HeaderInfo';
import { Table, Image, Switch, Spin, Input, Modal, Form, Button, Select } from 'antd';
import { getAllCategories, updateCategory, addCategory, deleteCategory } from '../../services/category';
import toast from 'react-hot-toast';
import Link from 'next/link';
import './style.scss';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const CategoriesV = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        status: undefined,
        home: undefined,
        main: undefined,
        root: undefined,
        sort: 'created_date',
        order: 'desc',
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await getAllCategories(filters);
            if (res?.code === 1 && Array.isArray(res.data.categories)) {
                setCategories(res.data.categories);
            } else {
                toast.error('Không thể tải danh mục');
            }
        } catch (err) {
            toast.error('Lỗi máy chủ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [filters]);

    const handleToggle = async (id, field, value) => {
        try {
            const res = await updateCategory(id, { [field]: value });
            if (res?.code === 1) {
                toast.success('Cập nhật thành công');
                fetchCategories();
            } else {
                toast.error('Cập nhật thất bại');
            }
        } catch {
            toast.error('Lỗi cập nhật');
        }
    };

    const handleSearchInput = (e) => {
        setFilters({ ...filters, search: e.target.value });
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') fetchCategories();
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            form.setFieldsValue(category);
            setEditingCategory(category);
        } else {
            form.resetFields();
            setEditingCategory(null);
        }
        setIsModalVisible(true);
    };

    const handleSubmitCategory = async (values) => {
        try {
            const res = editingCategory
                ? await updateCategory(editingCategory._id, values)
                : await addCategory(values);

            if (res?.code === 1) {
                toast.success(editingCategory ? 'Cập nhật thành công' : 'Thêm thành công');
                setIsModalVisible(false);
                fetchCategories();
            } else {
                toast.error(res.message || 'Lỗi');
            }
        } catch (error) {
            toast.error(error?.message || 'Lỗi xử lý');
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteCategory(id);
            if (res?.code === 1) {
                toast.success('Xóa thành công');
                fetchCategories();
            } else {
                toast.error('Xóa thất bại');
            }
        } catch (err) {
            toast.error('Lỗi máy chủ');
        }
    };

    const columns = [
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: 'Mã danh mục',
            dataIndex: 'category_id',
            key: 'category_id',
            align: 'center'
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (img) =>
                img ? <Image width={50} src={`http://localhost:3000/${img}`} /> : 'Không có',
            align: 'center'
        },
        {
            title: 'Danh mục cha',
            dataIndex: 'parent_id',
            key: 'parent_id',
            render: (parentId) => {
                const parent = categories.find((cat) => cat._id === parentId);
                return parent ? parent.name : '—';
            },
            align: 'center'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (val, record) => (
                <Switch
                    checked={val}
                    onChange={(checked) => handleToggle(record._id, 'status', checked)}
                />
            )
        },
        {
            title: 'Trang chủ',
            dataIndex: 'home',
            key: 'home',
            align: 'center',
            render: (val, record) => (
                <Switch
                    checked={val}
                    onChange={(checked) => handleToggle(record._id, 'home', checked)}
                />
            )
        },
        {
            title: 'Danh mục chính',
            dataIndex: 'main',
            key: 'main',
            align: 'center',
            render: (val, record) => (
                <Switch
                    checked={val}
                    onChange={(checked) => handleToggle(record._id, 'main', checked)}
                />
            )
        },
        {
            title: 'Danh mục gốc',
            dataIndex: 'root',
            key: 'root',
            align: 'center',
            render: (val, record) => (
                <Switch
                    checked={val}
                    onChange={(checked) => handleToggle(record._id, 'root', checked)}
                />
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (date) =>
                date ? new Date(date).toLocaleDateString('vi-VN') : 'Không rõ',
            sorter: (a, b) => new Date(a.created_date) - new Date(b.created_date),
            align: 'center',
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
                    <Button danger icon={<DeleteOutlined />} onClick={() => {
                        setCategoryToDelete(record);
                        setDeleteModalVisible(true);
                    }} />
                </div>
            )
        }
    ];

    return (
        <div className="categories-manage">
            <SideBar />
            <div className="body-content">
                <HeaderInfo />
                <div className="main-content">
                    <div className="main-header">
                        <nav className="breadcrumb">
                            <ol className="breadcrumb-list">
                                <li className="breadcrumb-item">
                                    <Link href="/"><i className="bx bx-home-alt-2" />Trang chủ</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    <i className="bx bx-chevron-right" />Quản lý danh mục
                                </li>
                            </ol>
                        </nav>
                        <div style={{ display: 'flex', marginBottom: 20, justifyContent: 'space-between' }}>
                            <div style={{display: 'flex', gap: 20}}>
                                <Input
                                    placeholder="Tìm kiếm danh mục"
                                    value={filters.search}
                                    onChange={handleSearchInput}
                                    onKeyDown={handleSearchSubmit}
                                    allowClear
                                    style={{ width: 300 }}
                                />
                                <Select placeholder="Trạng thái" allowClear onChange={val => setFilters({ ...filters, status: val })} style={{ width: 150 }}>
                                    <Option value={true}>Hiển thị</Option>
                                    <Option value={false}>Ẩn</Option>
                                </Select>
                                <Select placeholder="Trang chủ" allowClear onChange={val => setFilters({ ...filters, home: val })} style={{ width: 150 }}>
                                    <Option value={true}>Có</Option>
                                    <Option value={false}>Không</Option>
                                </Select>
                                <Select placeholder="Danh mục chính" allowClear onChange={val => setFilters({ ...filters, main: val })} style={{ width: 150 }}>
                                    <Option value={true}>Có</Option>
                                    <Option value={false}>Không</Option>
                                </Select>
                                <Select placeholder="Danh mục gốc" allowClear onChange={val => setFilters({ ...filters, root: val })} style={{ width: 150 }}>
                                    <Option value={true}>Có</Option>
                                    <Option value={false}>Không</Option>
                                </Select>
                            </div>
                            <Button type="primary" onClick={() => handleOpenModal()}>
                                <i className="fa-solid fa-plus" style={{ marginRight: 4 }}></i> Thêm danh mục
                            </Button>
                        </div>
                    </div>

                    <div className="table-section">
                        {loading ? (
                            <div className="spinner-container"><Spin size="large" /></div>
                        ) : (
                            <Table
                                rowKey="_id"
                                dataSource={categories}
                                columns={columns}
                                pagination={{ pageSize: 10 }}
                                bordered
                            />
                        )}
                    </div>

                    <Modal
                        title={editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục'}
                        open={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        footer={null}
                        destroyOnHidden
                    >
                        <Form form={form} layout="vertical" onFinish={handleSubmitCategory}>
                            <Form.Item name="name" label="Tên danh mục" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="category_id" label="Mã danh mục" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="status" label="Trạng thái" initialValue={true}>
                                <Select>
                                    <Option value={true}>Hiển thị</Option>
                                    <Option value={false}>Ẩn</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="home" label="Trang chủ" initialValue={false}>
                                <Select>
                                    <Option value={true}>Có</Option>
                                    <Option value={false}>Không</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="main" label="Danh mục chính" initialValue={false}>
                                <Select>
                                    <Option value={true}>Có</Option>
                                    <Option value={false}>Không</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="parent_id" label="Danh mục cha">
                                <Select allowClear>
                                    {categories.map((cat) => (
                                        <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">{editingCategory ? 'Cập nhật' : 'Lưu'}</Button>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Xác nhận xóa danh mục"
                        open={deleteModalVisible}
                        onCancel={() => setDeleteModalVisible(false)}
                        onOk={async () => {
                            if (categoryToDelete) {
                                await handleDelete(categoryToDelete._id);
                                setDeleteModalVisible(false);
                            }
                        }}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <p>Bạn có chắc chắn muốn xóa danh mục "<strong>{categoryToDelete?.name}</strong>" không?</p>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default CategoriesV;
