'use client'
import dynamic from 'next/dynamic';
import Link from 'next/link';
import pickBy from 'lodash/pickBy'
import ProductItem from "../../../components/product/item";
import EmptySearch from "../../../components/empty/search";
import { useState, useEffect } from "react";
import { Spin } from 'antd';
import { useSearchProducts } from '../../../query/product';
import { useQuery } from '../../../hook/query';
import { Pagination } from 'antd';
import "./search.scss"

const Filter = dynamic(() => import('./Filter'), {
    ssr: false,
    loading: () => <Spin/>,
})

const SearchV = ({ keyword }) => {
    const { push, query, asPathname } = useQuery();
    const [params, setParams] = useState({ ...query })

    const changeSearch = (param) => {
        let _params = pickBy({ ...query, ...param });
        push({ query: _params });
    }

    useEffect(() => {
        setParams({ ...params, ...query })
    }, [asPathname])

    const { data, isLoading } = useSearchProducts(keyword, query);
    const hasResults = data?.response?.results?.length > 0;
    const currentPage = parseInt(query.page, 10) || 1;
    const maxPage = data?.response?.maxPage || 1;
    const total = data?.response?.total || 50;

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
                            <span>Tìm kiếm sản phẩm</span>
                        </li>
                    </ol>
                </nav>

                <div className="content-search">
                    <div className="content-card">
                        <div className="card-main">
                            <div className="content-header">
                                <div className='total-results'>
                                    <span>Tìm thấy <strong>{total}</strong> kết quả cho từ khóa: <strong>{keyword}</strong></span>
                                </div>
                                <div>
                                    {/* <div className="col-md-3">
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button variant="light" radius="full" className='bg-white w-full'>{sortValue ? sortValue : 'Sản phẩm phổ biến'} </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu 
                                                variant="flat"
                                                disallowEmptySelection
                                                selectionMode="single"
                                            >
                                                { data?.sorts?.length > 0 && data.sorts.map((sort, i) => {
                                                    return (<DropdownItem key={i}><Link href={{pathname: '/ebay-us/search', query: sort.query}} >{sort.name}</Link></DropdownItem>)
                                                })}
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div> */}
                                </div>
                            </div>
                            {/* <div className="flex w-full flex-col">
                                <Tabs className='seach-tabs' selectedKey={data?.tabs?.findIndex(i => !i.query)} color='primary' variant="light" size="sm" radius="lg">
                                    {data?.tabs?.length > 0 && data.tabs.map((item, key) => {
                                        return ( <Tab key={key} title={<Link href={{pathname: '/ebay-us/search', query: item.query}}><span className='item-tab bold'>{item.name}</span></Link>}/>)
                                    })}
                                </Tabs>
                            </div> */}
                            {/*isLoading ? (
                                <div
                                    style={{
                                        minHeight: '60vh',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Spin size="large" fullscreen={true} />
                                </div>
                            ) : */hasResults ? (
                                <div className="content-main">
                                    <Filter params={params} changeSearch={changeSearch}/>
                                    <div className="product-results">
                                        {data.response.results.map((product, key) => (
                                            <div key={key} className="">
                                                <div className="">
                                                    <ProductItem product={product} />
                                                </div>
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
                                    total={total}
                                    pageSize={total / maxPage}
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

export default SearchV;
