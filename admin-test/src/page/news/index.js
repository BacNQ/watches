'use client';
import React, { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar';
import './style.scss';
import HeaderInfo from '../../components/header/HeaderInfo';
import { Table, Spin, Tooltip, Image, Tag, Modal, Form, Input, Button, Select, Upload, Switch } from 'antd';
import { getAllNews, createNews, updateNews, deleteNews } from '../../services/news';
import { uploadImage } from '../../services/upload';
import toast from 'react-hot-toast';
import Link from 'next/link';
import moment from 'moment';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import slugify from 'slugify';

const { Option } = Select;

const maxCellStyle = {
    maxWidth: 150,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    verticalAlign: 'middle'
};

const NewsV = () => {
    const [loading, setLoading] = useState(false);
    const [news, setNews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();
    const [deleteId, setDeleteId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [searchText, setSearchText] = useState('');

    const fetchNews = async (searchValue = '') => {
        setLoading(true);
        const res = await getAllNews({ title: searchValue });
        if (res?.success) {
            setNews(res.data || []);
        } else {
            toast.error('Không lấy được danh sách bài viết!');
        }
        setLoading(false);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        fetchNews(value);
    };


    useEffect(() => {
        fetchNews();
    }, []);

    const openAddModal = () => {
        setShowModal(true);
        setEditing(false);
        setEditingId(null);
        form.resetFields();
    };

    const openEditModal = (record) => {
        setShowModal(true);
        setEditing(true);
        setEditingId(record._id);

        let images = Array.isArray(record.images)
            ? record.images.map((img, idx) => ({
                uid: idx + '',
                name: `image_${idx}`,
                status: 'done',
                url: img,
            }))
            : [];
        form.setFieldsValue({
            ...record,
            images,
        });
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        const slug = slugify(title, {
            lower: true,
            strict: true,
            locale: 'vi'
        });
        form.setFieldsValue({ slug });
    };

    const handleFinish = async (values) => {
        try {
            setLoading(true);
            let images = (values.images || []).map(file => file?.response?.url || file?.url).filter(Boolean);
            let thumbnail = images.length > 0 ? images[0] : "";

            const body = {
                title: values.title,
                slug: values.slug,
                content: values.content,
                thumbnail,
                images,
                category: values.category,
                status: values.status,
            };

            let res;
            if (editing && editingId) {
                res = await updateNews(editingId, body);
            } else {
                res = await createNews(body);
            }
            if (res?.success) {
                toast.success(editing ? 'Cập nhật bài viết thành công!' : 'Thêm bài viết thành công!');
                setShowModal(false);
                form.resetFields();
                fetchNews();
            } else {
                toast.error(res?.message || (editing ? 'Lỗi khi cập nhật' : 'Lỗi khi tạo bài viết'));
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setLoading(true);
        try {
            const res = await deleteNews(deleteId);
            if (res?.success) {
                toast.success('Xóa bài viết thành công!');
                setDeleteModal(false);
                setDeleteId(null);
                fetchNews();
            } else {
                toast.error(res?.message || 'Xóa bài viết thất bại!');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi xóa!');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Tên bài viết',
            dataIndex: 'title',
            key: 'title',
            width: 150,
            align: 'center',
            render: (text) => (
                <Tooltip title={text}>
                    <span style={maxCellStyle}>{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            width: 150,
            align: 'center',
            render: (text) => (
                <Tooltip title={text}>
                    <span style={maxCellStyle}>{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Ảnh bài viết',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (thumbnail) =>
                thumbnail ? (
                    <Image width={80} height={50} src={thumbnail} alt="Ảnh bài viết" style={{ objectFit: 'cover' }} />
                ) : (
                    <span>Không có</span>
                ),
            align: 'center'
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
            render: (author) => author?.name || author?.username || author?._id || <i>Admin</i>,
            align: 'center'
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (cat) => {
                const map = {
                    review: 'Review',
                    huongdan: 'Hướng dẫn',
                    tintuc: 'Tin tức',
                    khac: 'Khác'
                };
                return <Tag color="blue">{map[cat] || cat}</Tag>;
            },
            align: 'center'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Switch
                    checked={status}
                    checkedChildren="Bật"
                    unCheckedChildren="Tắt"
                    onChange={async (checked) => {
                        try {
                            const res = await updateNews(record._id, { status: checked });
                            if (res?.success) {
                                toast.success('Cập nhật trạng thái thành công!');
                                fetchNews();
                            } else {
                                toast.error(res?.message || 'Cập nhật trạng thái thất bại!');
                            }
                        } catch (err) {
                            toast.error('Lỗi khi cập nhật trạng thái!');
                        }
                    }}
                />
            ),
            align: 'center'
        },
        {
            title: 'Số lượt xem',
            dataIndex: 'views',
            key: 'views',
            align: 'center',
            sorter: (a, b) => a.views - b.views,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            align: 'center'
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                    <Tooltip title="Sửa">
                        <Button icon={<EditOutlined />} size="small" onClick={() => openEditModal(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => {
                                setDeleteId(record._id);
                                setDeleteModal(true);
                            }}
                        />
                    </Tooltip>
                </div>
            ),
        }
    ];

    return (
        <div className='blog-manage'>
            <SideBar />
            <div className='body-content'>
                <HeaderInfo />
                <div className='main-content'>
                    <nav aria-label="breadcrumb" className='breadcrumb'>
                        <ol className="breadcrumb-list">
                            <li className="breadcrumb-item">
                                <Link href="/"><i className='bx bx-home-alt-2' />Trang chủ</Link>
                            </li>
                            <li className="breadcrumb-item active">
                                <i className='bx bx-chevron-right' />
                                <span>Quản lý bài viết</span>
                            </li>
                        </ol>
                    </nav>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <Input.Search
                                placeholder="Tìm kiếm bài viết"
                                allowClear
                                enterButton="Tìm"
                                onSearch={handleSearch}
                                style={{ width: 350 }}
                            />
                            <Button type="primary" onClick={openAddModal}>
                                <i className="fa-solid fa-plus" style={{ marginRight: 2 }}></i>
                                Thêm bài viết
                            </Button>
                        </div>
                    </div>
                    <div className='table-wrapper'>
                        <Spin spinning={loading}>
                            <Table
                                dataSource={news}
                                columns={columns}
                                rowKey="_id"
                                pagination={{ pageSize: 10, showSizeChanger: true }}
                                bordered
                                scroll={{ x: 'max-content' }}
                            />
                        </Spin>
                    </div>
                </div>
                <Modal
                    title={editing ? 'Sửa bài viết' : 'Thêm bài viết mới'}
                    open={showModal}
                    onCancel={() => setShowModal(false)}
                    footer={null}
                    width={700}
                    destroyOnHidden
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        initialValues={{
                            category: 'tintuc',
                            status: 'draft',
                        }}
                    >
                        <Form.Item
                            label="Tên bài viết"
                            name="title"
                            rules={[{ required: true, message: 'Vui lòng nhập tên bài viết' }]}
                        >
                            <Input placeholder="Tên bài viết" onChange={handleTitleChange} />
                        </Form.Item>
                        <Form.Item
                            label="Slug"
                            name="slug"
                            rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
                        >
                            <Input placeholder="slug-bai-viet" />
                        </Form.Item>
                        <Form.Item
                            label="Nội dung"
                            name="content"
                            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nội dung bài viết" />
                        </Form.Item>
                        <Form.Item
                            label="Danh mục"
                            name="category"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                        >
                            <Select>
                                <Option value="review">Review</Option>
                                <Option value="huongdan">Hướng dẫn</Option>
                                <Option value="tintuc">Tin tức</Option>
                                <Option value="khac">Khác</Option>
                            </Select>
                        </Form.Item>
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
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
                                {editing ? 'Cập nhật bài viết' : 'Lưu bài viết'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    open={deleteModal}
                    onCancel={() => setDeleteModal(false)}
                    onOk={confirmDelete}
                    okText="Xóa"
                    okButtonProps={{ danger: true }}
                    cancelText="Hủy"
                    title="Xác nhận xóa"
                    confirmLoading={loading}
                >
                    <div>Bạn có chắc chắn muốn xóa bài viết này không?</div>
                </Modal>
            </div>
        </div>
    );
};

export default NewsV;
