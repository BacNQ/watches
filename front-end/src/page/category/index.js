'use client'
import dynamic from 'next/dynamic';
import Link from 'next/link';
import pickBy from 'lodash/pickBy'
import ProductItem from "../../components/product/item";
import EmptySearch from "../../components/empty/search";
import { useState, useEffect } from "react";
import { useDetailCategory } from '../../query/product';
import { useQuery } from '../../hook/query';
import { Pagination, Spin } from 'antd';
import './category.scss'

const Filter = dynamic(() => import('./Filter'), { ssr: false })

const CategoryV = ({ category_id }) => {
    const { push, query, asPathname } = useQuery();
    const [params, setParams] = useState({ ...query })

    const changeSearch = (param) => {
        let _params = pickBy({ ...query, ...param });
        push({ query: _params });
    }

    useEffect(() => {
        setParams({ ...params, ...query })
    }, [asPathname])

    const { data, isLoading } = useDetailCategory(category_id, query);
    const hasResults = data?.response?.results?.length > 0;
    const currentPage = parseInt(query.page, 10) || 1;
    const maxPage = data?.response?.maxPage || 1;

    const onChangePage = (page) => {
        changeSearch({ page });
    };

    return (
        <div className="page-search">
            <div className="container">
                <nav aria-label="breadcrumb" className='breadcrumb'>
                    <ol className="breadcrumb-list">
                        <li className="breadcrumb-item">
                            <Link href="/"><i className='bx bx-home-alt-2' />Trang chủ</Link>
                        </li>
                        <li className="breadcrumb-item active">
                            <i className='bx bx-chevron-right' />
                            <span>Danh mục sản phẩm</span>
                        </li>
                        <li className="breadcrumb-item active">
                            <i className='bx bx-chevron-right' />
                            <span>{category_id}</span>
                        </li>
                    </ol>
                </nav>

                <div className="content-search">
                    <div className="content-card">
                        <div className="card-main">
                            {hasResults ? (
                                <div className="content-main">
                                    <Filter params={params} changeSearch={changeSearch} />
                                    <div className="product-results">
                                        {data.response.results.map((product, key) => (
                                            <div key={key}>
                                                <ProductItem product={product} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="content-main">
                                    <EmptySearch />
                                </div>
                            )}

                            <div className='pagination'>
                                <Pagination
                                    current={currentPage}
                                    total={32 * maxPage}
                                    pageSize={32}
                                    onChange={onChangePage}
                                    showSizeChanger={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryV;
