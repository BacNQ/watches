'use client';
import React, { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar';
import './style.scss';
import HeaderInfo from '../../components/header/HeaderInfo';
import { getAllProducts, createProduct, updateProduct, deleteProduct, hideProduct, unhideProduct } from '../../services/product';
import { uploadImage } from '../../services/upload';
import { Table, Image, Spin, Tooltip, Button, Modal, Form, Input, InputNumber, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import Link from 'next/link';

const ProductV = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [slug, setSlug] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [searchQuery]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await getAllProducts({
                search: searchQuery
            });
            setProducts(res.data || []);
        } catch (error) {
            setProducts([]);
            toast.error('Lỗi khi tải sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (text) => {
        return text
            .replace(/Đ/g, 'D')
            .replace(/đ/g, 'd')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleAddProduct = () => {
        setIsModalOpen(true);
        setEditingProduct(null);
        form.resetFields();
        setSlug('');
    };

    const handleEditProduct = (record) => {
        setEditingProduct(record);
        setSlug(record.slug);
        form.setFieldsValue({
            ...record,
            images: (record.images || []).map((url, index) => ({
                uid: `${index}`,
                name: `image-${index}`,
                status: 'done',
                url,
            })),
            specifics: (record.specifics || []).map(obj => {
                const key = Object.keys(obj)[0];
                return { key, value: obj[key] };
            })
        });

        setIsModalOpen(true);
    };

    const handleDeleteClick = (record) => {
        setDeletingProduct(record);
        setIsDeleteModalOpen(true);
    };

    const handleToggleVisibility = async (record) => {
        try {
            if (record.deleted) {
                await unhideProduct(record._id);
                toast.success('Đã hiện lại sản phẩm!');
            } else {
                await hideProduct(record._id);
                toast.success('Đã ẩn sản phẩm!');
            }
            fetchProducts();
        } catch (error) {
            toast.error('Lỗi khi cập nhật trạng thái hiển thị!');
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingProduct) return;
        try {
            await deleteProduct(deletingProduct._id);
            toast.success('Xóa sản phẩm thành công!');
            setIsDeleteModalOpen(false);
            setDeletingProduct(null);
            fetchProducts();
        } catch (error) {
            toast.error('Lỗi khi xóa sản phẩm!');
        }
    };

    const handleSubmit = async (values) => {
        try {
            const images = (values.images?.map(file => file.url || file.thumbUrl)) || [];

            // Convert specifics from [{key: 'Thương hiệu', value: 'Seiko'}]
            // to [{ 'Thương hiệu': 'Seiko' }]
            const specifics = (values.specifics || []).map(item => ({
                [item.key]: item.value
            }));

            const body = {
                ...values,
                slug,
                url: `http://localhost:3000/product/detail/${slug}`,
                images,
                specifics
            };

            if (editingProduct) {
                await updateProduct(editingProduct._id, body);
                toast.success('Cập nhật sản phẩm thành công!');
            } else {
                await createProduct(body);
                toast.success('Thêm sản phẩm thành công!');
            }

            setIsModalOpen(false);
            form.resetFields();
            setSlug('');
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            toast.error('Lỗi khi lưu sản phẩm!');
        }
    };


    const handleFormChange = (changedValues, allValues) => {
        if (changedValues.name !== undefined) {
            const newSlug = generateSlug(changedValues.name || '');
            setSlug(newSlug);
        }

        const { price_old, discount } = allValues;

        if (price_old && discount >= 0) {
            const discountAmount = (price_old * discount) / 100;
            const finalPrice = price_old - discountAmount;
            form.setFieldsValue({ price_current: Math.round(finalPrice) });
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setSearchQuery(e.target.value);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'code',
            key: 'code',
            ellipsis: true,
            width: 80
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'images',
            key: 'images',
            render: (images) =>
                images && images.length > 0 ? <Image width={70} src={images[0]} /> : <span>Không có ảnh</span>,
            align: 'center'
        },
        {
            title: 'Giá hiện tại',
            dataIndex: 'price_current',
            key: 'price_current',
            render: (price) => price ? price.toLocaleString() : '',
            width: 120,
            align: 'center',
            sorter: (a, b) => a.price_current - b.price_current,
        },
        {
            title: 'Giá sản phẩm',
            dataIndex: 'price_old',
            key: 'price_old',
            render: (price) => price ? price.toLocaleString() : '',
            width: 140,
            align: 'center',
            sorter: (a, b) => a.price_old - b.price_old,
        },
        {
            title: 'Khuyến mãi',
            dataIndex: 'discount',
            key: 'discount',
            render: (discount) => discount ? discount + (typeof discount === 'number' ? '%' : '') : '',
            width: 130,
            align: 'center',
            sorter: (a, b) => a.discount - b.discount,
        },
        {
            title: 'Số lượng',
            dataIndex: 'stock',
            key: 'stock',
            width: 120,
            align: 'center',
            sorter: (a, b) => a.stock - b.stock,
        },
        {
            title: 'Đã bán',
            dataIndex: 'sold',
            key: 'sold',
            width: 100,
            align: 'center',
            sorter: (a, b) => a.sold - b.sold,
        },
        {
            title: 'Đường dẫn',
            dataIndex: 'url',
            key: 'url',
            ellipsis: true,
            render: (url) => (
                <Tooltip title={url}>
                    <a
                        href={url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className="url-ellipsis"
                        style={{
                            display: 'inline-block',
                            maxWidth: '150px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {url}
                    </a>
                </Tooltip>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Tooltip title={record.deleted ? 'Hiện sản phẩm' : 'Ẩn sản phẩm'}>
                        <Button
                            type="default"
                            icon={record.deleted ? <i className="fa-solid fa-eye-slash" /> : <i className="fa-solid fa-eye" />}
                            onClick={() => handleToggleVisibility(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            icon={<i className="fa-solid fa-pen-to-square"></i>}
                            onClick={() => handleEditProduct(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa sản phẩm">
                        <Button
                            type="default"
                            danger
                            icon={<i className="fa-solid fa-trash"></i>}
                            onClick={() => handleDeleteClick(record)}
                        />
                    </Tooltip>
                </div>
            ),
        }
    ];

    return (
        <div className='product-manage'>
            <SideBar />
            <div className='body-content'>
                <HeaderInfo />
                <div className='main-content'>
                    <div className='flex justify-between items-center'>
                        <nav aria-label="breadcrumb" className='breadcrumb'>
                            <ol className="breadcrumb-list">
                                <li className="breadcrumb-item">
                                    <Link href="/"><i className='bx bx-home-alt-2' />Trang chủ</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    <i className='bx bx-chevron-right' />
                                    <span>Quản lý sản phẩm</span>
                                </li>
                            </ol>
                        </nav>
                        <div className='flex items-center gap-4'>
                            <div className='input-search'>
                                <Input
                                    placeholder="Tìm kiếm theo tên sản phẩm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    style={{ width: 300 }}
                                />
                            </div>
                            <div className='btn-add'>
                                <Button type="primary" onClick={handleAddProduct}>
                                    <i className="fa-solid fa-plus" style={{ marginRight: 2 }}></i>
                                    Thêm sản phẩm
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Spin spinning={loading}>
                        <Table
                            dataSource={products}
                            columns={columns}
                            rowKey={record => record._id}
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: true }}
                        />
                    </Spin>

                    <Modal
                        title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
                        open={isModalOpen}
                        onCancel={() => {
                            setIsModalOpen(false);
                            form.resetFields();
                            setSlug('');
                            setEditingProduct(null);
                        }}
                        onOk={() => form.submit()}
                        okText="Lưu"
                        cancelText="Hủy"
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            onValuesChange={handleFormChange}
                        >
                            <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Slug">
                                <Input value={slug} readOnly />
                            </Form.Item>

                            <div className='flex justify-between items-center'>
                                <Form.Item label="Giá sản phẩm" name="price_old">
                                    <InputNumber style={{ width: '120%' }} />
                                </Form.Item>

                                <Form.Item label="Khuyến mãi (%)" name="discount">
                                    <InputNumber style={{ width: '100%' }} min={0} max={100} />
                                </Form.Item>
                            </div>

                            <div className='flex justify-between items-center'>
                                <Form.Item label="Giá hiện tại" name="price_current">
                                    <InputNumber style={{ width: '120%' }} readOnly />
                                </Form.Item>

                                <Form.Item label="Số lượng" name="stock">
                                    <InputNumber style={{ width: '100%' }} min={0} />
                                </Form.Item>
                            </div>

                            <Form.Item label="Mô tả" name="description">
                                <Input.TextArea rows={3} />
                            </Form.Item>

                            <Form.Item label="Thương hiệu" name="brand">
                                <Input />
                            </Form.Item>

                            <Form.List name="specifics">
                                {(fields, { add, remove }) => (
                                    <>
                                        <label style={{ display: 'block', marginBottom: 8 }}>Thuộc tính sản phẩm</label>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <div key={key} style={{ display: 'flex', marginBottom: 8, gap: '10px' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'key']}
                                                    rules={[{ required: true, message: 'Nhập tên thuộc tính' }]}
                                                >
                                                    <Input placeholder="Tên thuộc tính (VD: Độ dày)" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'value']}
                                                    rules={[{ required: true, message: 'Nhập giá trị thuộc tính' }]}
                                                >
                                                    <Input placeholder="Giá trị (VD: 13mm)" />
                                                </Form.Item>
                                                <Button onClick={() => remove(name)} danger>Xóa</Button>
                                            </div>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Thêm thuộc tính
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <Form.Item
                                label="Hình ảnh"
                                name="images"
                                valuePropName="fileList"
                                getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
                            >
                                <Upload
                                    listType="picture-card"
                                    customRequest={async ({ file, onSuccess, onError }) => {
                                        try {
                                            const res = await uploadImage(file);
                                            onSuccess(res);
                                        } catch (err) {
                                            onError(err);
                                            toast.error('Tải ảnh thất bại');
                                        }
                                    }}
                                    onChange={({ fileList }) => {
                                        const formattedList = fileList.map(file => {
                                            if (file.response) {
                                                return {
                                                    ...file,
                                                    url: file.response.url,
                                                };
                                            }
                                            return file;
                                        });
                                        form.setFieldsValue({ images: formattedList });
                                    }}
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Tải lên</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Xác nhận xóa sản phẩm"
                        open={isDeleteModalOpen}
                        onCancel={() => {
                            setIsDeleteModalOpen(false);
                            setDeletingProduct(null);
                        }}
                        onOk={handleConfirmDelete}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>{deletingProduct?.name}</strong> không?</p>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default ProductV;
