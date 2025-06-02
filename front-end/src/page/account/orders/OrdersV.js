'use client';
import React, { useEffect, useState, useMemo } from 'react';
import pickBy from 'lodash/pickBy';
import { useSearch } from '../../../query/orders';
import { useUser } from '../../../provider/UserProvider';
import { useQuery } from '../../../hook/query';
import EmptyV from '../../../components/commons/empty';
import { Tabs, Badge, Select, Input, Button, Space, Pagination } from 'antd';
import Link from 'next/link';
import ProductItem from './components/ProductItem'
import './style.scss';

const { TabPane } = Tabs;
const { Option } = Select;

const optionSorts = [
  { value: 'created_date:desc', label: 'Đơn mới tạo' },
  { value: 'created_date:asc', label: 'Đơn cũ đến mới' },
  { value: 'total:desc', label: 'Giá trị từ cao đến thấp' },
  { value: 'total:asc', label: 'Giá trị từ thấp đến cao' },
];

const optionTimes = [
  { value: '7_days', label: '7 ngày gần đây' },
  { value: '15_days', label: '15 ngày gần đây' },
  { value: '30_days', label: '30 ngày gần đây' },
  { value: '60_days', label: '60 ngày gần đây' },
  { value: '3_months', label: '3 tháng gần đây' },
  { value: '6_months', label: '6 tháng gần đây' },
  { value: '1_years', label: '1 năm gần đây' },
];

const OrdersV = () => {
  const { user } = useUser();
  const { query, push } = useQuery();
  const [keyword, setKeyword] = useState(query.search || '');
  const [params, setParams] = useState(() => ({
    page: 1,
    size: 20,
    sort: 'created_date:desc',
    time: '60_days',
    ...query,
  }));
  const { data, refetch, isLoading } = useSearch(params);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  useEffect(() => {
    if (data?.data?.data?.results) {
      setProducts(data?.data?.data?.results);
      setPagination(data.data.data.pagination);
    }
  }, [data]);

  const changeSearch = (param) => {
    const _params = pickBy({ ...params, ...param });
    setParams(_params);
    push({ query: _params });
  };

  const countOrders = products.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {}) || {};

  const size = data?.data?.data?.pagination?.size && Number(data?.data?.data?.pagination?.size) > 0 ? Number(data?.data?.data?.pagination?.size) : 20;
  const page = data?.data?.data?.pagination?.page && Number(data?.data?.data?.pagination?.page) > 0 ? Number(data?.data?.data?.pagination?.page) : 1;
  const total = data?.data?.data?.pagination?.total && Number(data?.data?.data?.pagination?.total) > 0 ? Number(data?.data?.data?.pagination?.total) : 0;
  const totalCount = pagination?.total || 0;
  const selectedStatus = useMemo(() => params.status || '', [params.status]);

  return (
    <div className="page-orders">
      <div className="max-w-[1320px] mx-auto">
        <nav aria-label="breadcrumb" className="breadcrumb">
          <ol className="breadcrumb-list">
            <li className="breadcrumb-item">
              <Link href="/">
                <i className="bx bx-home-alt-2" />
                Trang chủ
              </Link>
            </li>
            <li className="breadcrumb-item active">
              <i className="bx bx-chevron-right" />
              <span>Quản lý đơn hàng</span>
            </li>
          </ol>
        </nav>

        <div className='box-panel'>
          <div className="panel-header">
            <Tabs
              activeKey={selectedStatus}
              onChange={(status) => changeSearch({ status })}
              className="tab-main"
            >
              <TabPane tab={<Badge count={selectedStatus === '' ? totalCount : 0} offset={[10, 0]}><span>Tất cả</span></Badge>} key="" />
              <TabPane tab={<Badge count={selectedStatus === 'pending' ? countOrders.pending || 0 : 0} offset={[10, 0]}><span>Đang xử lý</span></Badge>} key="pending" />
              <TabPane tab={<Badge count={selectedStatus === 'approved' ? countOrders.approved || 0 : 0} offset={[10, 0]}><span>Đã duyệt mua</span></Badge>} key="approved" />
              <TabPane tab={<Badge count={selectedStatus === 'shipping' ? countOrders.shipping || 0 : 0} offset={[10, 0]}><span>Đang vận chuyển</span></Badge>} key="shipping" />
              <TabPane tab={<Badge count={selectedStatus === 'success' ? countOrders.success || 0 : 0} offset={[10, 0]}><span>Mua hàng thành công</span></Badge>} key="success" />
              <TabPane tab={<Badge count={selectedStatus === 'cancelled' ? countOrders.cancelled || 0 : 0} offset={[10, 0]}><span>Đơn bị hủy</span></Badge>} key="cancelled" />
            </Tabs>
          </div>

          <div className='panel-body'>
            <div className='bid-head'>
              <div className="flex flex-wrap -mx-2 gap-4">
                <Select
                  value={params.time || '60_days'}
                  onChange={(value) => changeSearch({ time: value, page: 1 })}
                  style={{ width: 200 }}
                  placeholder="Thời gian"
                >
                  {optionTimes.map(item => (
                    <Option key={item.value} value={item.value}>{item.label}</Option>
                  ))}
                </Select>
                <Select
                  value={params.sort || 'created_date:desc'}
                  onChange={(value) => changeSearch({ sort: value })}
                  style={{ width: 200 }}
                  placeholder="Sắp xếp"
                >
                  {optionSorts.map(sort => (
                    <Option key={sort.value} value={sort.value}>{sort.label}</Option>
                  ))}
                </Select>
                <Input.Search
                  allowClear
                  placeholder="Nhập từ tìm kiếm"
                  value={keyword || ''}
                  onChange={(e) => setKeyword(e.target.value)}
                  onSearch={(value) => changeSearch({ search: value })}
                  style={{ width: 300 }}
                />
              </div>
            </div>

            <div className="bid-body">
              <div className="list-bids rounded-lg h-min-[50vh]">
                {products.length > 0
                  ? products.map((item, index) => {
                    return (
                      <ProductItem
                        key={index}
                        item={item}
                        refetch={refetch}
                      />
                    )
                  })
                  : (!isLoading && <EmptyV title="Chưa có đơn hàng" description="Bạn chưa có đơn hàng nào!" />)
                }
              </div>
              <div className="list-footer flex justify-between items-center flex-wrap gap-4" style={{marginTop: 30}}>
                <div className="footer-item">
                  <div className="flex items-center">
                    <span style={{fontSize: 14, marginRight: 16}} className="text-gray-700">Hiển thị</span>
                    <Select
                      size="small"
                      value={`${params.size || 20}`}
                      style={{ width: 120 }}
                      onChange={(value) => changeSearch({ size: value })}
                    >
                      <Option value="20">20</Option>
                      <Option value="50">50</Option>
                      <Option value="100">100</Option>
                      <Option value="200">200</Option>
                    </Select>
                  </div>
                </div>

                <div className="footer-item">
                  {Math.ceil(total / size) > 1 && (
                    <Pagination
                      size="small"
                      current={page || 1}
                      total={total}
                      pageSize={size}
                      showSizeChanger={false}
                      onChange={(page) => changeSearch({ page })}
                    />
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersV;