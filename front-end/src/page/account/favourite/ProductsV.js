"use client"
import './style.scss';
import React, { useState } from "react";
import toast from 'react-hot-toast';
import dayjs from "dayjs";
import pickBy from 'lodash/pickBy'
import Image from "next/image";
import EmptyV from '../../../components/commons/empty';
import { formatCurrency } from '../../../helpers/format_price'
import { Button, Pagination, Checkbox, Select, Modal } from "antd";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { deleteFavorites } from '../../../services/common';
import { useFavProductsSearch } from '../../../query/product';
import { useQuery } from "../../../hook/query";

const initialValues = (products) => {
    return products.map((item) => {
        item.image_root = item?.images?.length > 0 ? item.images[0] : null;
        return item;
    })
}

const formatParams = (params) => {
    let from, to;

    if (params.time) {
        let times = params.time.split('_')
        if (times.length === 2) {
            from = dayjs().subtract(times[0], times[1]).startOf('days').format();
        }
    }

    return { ...params, to, from };
}

const ProductsV = (props) => {
    const { query, push } = useQuery();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteBody, setDeleteBody] = useState(null);
    const [params, setParams] = useState({ page: 1, size: 10, sort: 'created_date:desc', ...query })
    const [keys, setKeys] = useState([])

    const { data, refetch, isLoading: loading } = useFavProductsSearch(formatParams({ ...params }));
    const changeSearch = (param) => {
        let _params = pickBy({ ...params, ...param });
        setParams(_params)
        push({ query: { ..._params } });
    }

    const deleteFavoriteProducts = (body) => {
        if (body && (body.ids?.length > 0 || body.all)) {
            setDeleteBody(body);
            setIsModalOpen(true);
        }
    };

    const handleOk = () => {
        deleteFavorites(deleteBody)
            .then((res) => {
                if (res?.data?.code === 1) {
                    setKeys([]);
                    setTimeout(() => {
                        window.location.reload();
                    }, 300);
                    toast.success('Xóa thành công!');
                } else {
                    toast.error('Xóa thất bại!');
                }
            })
            .catch(() => {
                toast.error('Xóa thất bại!');
            })
            .finally(() => {
                setIsModalOpen(false);
                setDeleteBody(null);
            });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setDeleteBody(null);
    };

    const size = params.size && Number(params.size) > 0 ? Number(params.size) : 10;
    const page = params.page && Number(params.page) > 0 ? Number(params.page) : 1;
    const total = data?.res?.pagination?.total && Number(data?.res?.pagination?.total) > 0 ? Number(data?.res?.pagination?.total) : 0;
    const products = data?.res?.results?.length > 0 ? initialValues(data?.res?.results) : [];

    return (
        <>
            <div className="page-product">
                <div className="container">
                    <nav aria-label="breadcrumb" className='breadcrumb'>
                        <ol className="breadcrumb-list">
                            <li className="breadcrumb-item">
                                <a href="/"><i className='bx bx-home-alt-2' />Trang chủ</a>
                            </li>
                            <li className="breadcrumb-item active">
                                <i className='bx bx-chevron-right' />
                                <span>Sản phẩm yêu thích</span>
                            </li>
                        </ol>
                    </nav>
                    <div className="content-favorite">
                        <div className="panel-body">
                            <div className='favorite-action'>
                                <div className="label-filter">
                                    <label className="leading-10 bold">Sản phẩm yêu thích</label>
                                </div>
                                <div className="list-action">
                                    <Button
                                        onClick={() => deleteFavoriteProducts({ ids: keys })}
                                        disabled={!(keys.length > 0)}
                                        icon={<DeleteOutlined />}
                                        className='bg-white text-black text-[13px] px-3 py-2 rounded-md mb-2'
                                    >
                                        Xóa ({keys.length})
                                    </Button>
                                    <Button
                                        onClick={() => deleteFavoriteProducts({ all: true })}
                                        icon={<DeleteOutlined />}
                                        className='bg-white text-black text-[13px] px-3 py-2 rounded-md mb-2 outline-none'
                                    >
                                        Xóa tất cả
                                    </Button>
                                    <Button
                                        onClick={() => changeSearch({ order: 'created_date:desc' })}
                                        icon={<ReloadOutlined />}
                                        className='btn-refetch'
                                    />
                                </div>
                            </div>
                            <div className="favorite-body">
                                <div className="box-favorite">
                                    {products && products.length > 0
                                        ? products.map((quote, key) => {
                                            let checked = keys.includes(quote._id);
                                            return (
                                                <div className="item-favorite" key={key}>
                                                    <div className="item-header">
                                                        <div className="checkbox-active">
                                                            <Checkbox checked={checked} onChange={() => checked ? setKeys(keys.filter(i => i !== quote._id)) : setKeys([...keys, quote._id])} />
                                                        </div>
                                                    </div>
                                                    <div className="item-product">
                                                        <div className='item-cart'>
                                                            <div className="cart-img">
                                                                <div className="image-quote">
                                                                    <div className="item-image">
                                                                        <div className='image'>
                                                                            <a href={quote?.url}>
                                                                                <Image src={quote?.image_root} width={80} height={80} alt="" />
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="quote-info">
                                                                <a href={quote?.url}>
                                                                    <span className="product-name bold">{quote.name}</span>
                                                                </a>
                                                                <div className="group-prd">
                                                                    <div className="line-price">
                                                                        <p className="product-created-date">Thời gian thêm:&emsp;<span>{dayjs(quote.created_date).format('DD-MM-YYYY HH:mm')}</span></p>
                                                                    </div>
                                                                    <label className="label-price flex justify-end items-center gap-2">
                                                                        <span>Giá:</span>
                                                                        <span className="product-price bold">{formatCurrency(quote.price)} đ</span>
                                                                    </label>
                                                                </div>
                                                                <div className='product-ship'>
                                                                    <p>Miễn phí ship trên toàn quốc</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        : (!loading && <EmptyV title="Bạn chưa có bất kỳ sản phẩm nào!" label="Tiếp tục đặt giá">
                                            <a href='/'><Button className='btn-empty' type="primary">Tiếp tục mua sắm</Button></a>
                                        </EmptyV>)
                                    }
                                </div>
                                <div className='box-footer'>
                                    <div className="footer-item">
                                        <Select
                                            className="select-item"
                                            style={{ width: 120 }}
                                            value={String(params.size || 10)}
                                            onChange={value => changeSearch({ size: value })}
                                            options={[
                                                { label: '10', value: '10' },
                                                { label: '30', value: '30' },
                                                { label: '50', value: '50' },
                                                { label: '100', value: '100' },
                                            ]}
                                        />
                                    </div>
                                    <div className="footer-item">
                                        <Pagination
                                            key={page}
                                            className='pagination-item'
                                            total={total}
                                            pageSize={size}
                                            current={page}
                                            showSizeChanger={false}
                                            onChange={page => changeSearch({ page })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="Bạn muốn xóa sản phẩm này?"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Xóa"
                cancelText="Đóng"
                className='modal-confirm'
            >
                <p>Xác nhận xóa sản phẩm khỏi danh sách yêu thích của bạn.</p>
            </Modal>
        </>
    );
};

export default ProductsV;
