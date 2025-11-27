'use client';
import React, { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar';
import HeaderInfo from '../../components/header/HeaderInfo';
import { getDashboardStats, getRevenueByDay, getRevenueByMonth, getOrderByStatus, getTopSoldProducts, getLowStockProducts, getRecentOrders } from '../../services/common';
import { Row, Col, Card, Select, Table, Tooltip as Tooltips } from 'antd';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { ShoppingCartOutlined, UserOutlined, AppstoreOutlined, DollarOutlined, InboxOutlined, GiftOutlined } from '@ant-design/icons';
import './style.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Title);

const { Option } = Select;

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        totalRevenue: 0,
        totalStock: 0,
        totalSold: 0,
        totalRefund: 0
    });

    const [chartMode, setChartMode] = useState('day');
    const [revenueData, setRevenueData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [selectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        getDashboardStats().then(setStats).catch(console.error);
        getOrderByStatus().then(setStatusData).catch(console.error);
        getTopSoldProducts().then(setTopProducts).catch(console.error);
        getLowStockProducts().then(setLowStockProducts).catch(console.error);
        getRecentOrders().then(setRecentOrders).catch(console.error);
    }, []);

    useEffect(() => {
        if (chartMode === 'day') {
            getRevenueByDay({ month: selectedMonth, year: selectedYear }).then(setRevenueData);
        } else {
            getRevenueByMonth({ year: selectedYear }).then(setRevenueData);
        }
    }, [chartMode]);

    const chartLabels = revenueData?.map(item => item._id);
    const chartValues = revenueData?.map(item => item.totalRevenue);

    const lineChartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Doanh thu (VND)',
                data: chartValues,
                fill: false,
                borderColor: '#fa8c16',
                backgroundColor: '#fa8c16',
                tension: 0.3,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: chartMode === 'day'
                    ? `Doanh thu theo ngày trong tháng ${selectedMonth}/${selectedYear}`
                    : `Doanh thu theo tháng trong năm ${selectedYear}`,
            },
        },
    };

    const mapStatusToVietnamese = (status) => {
        switch (status) {
            case 'pending': return 'Đang xử lý';
            case 'approved': return 'Đã duyệt mua';
            case 'shipping': return 'Đang vận chuyển';
            case 'success': return 'Mua thành công';
            case 'cancelled': return 'Đơn bị hủy';
            case 'cancel_requested': return 'Đơn yêu cầu hủy';
            default: return status;
        }
    };

    const pieChartData = {
        labels: statusData?.map(item => mapStatusToVietnamese(item._id)),
        datasets: [{
            data: statusData?.map(item => item.count),
            backgroundColor: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#8c8c8c'],
        }],
    };

    const formatCurrency = (value) => value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const cardStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
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
            render: (value) => formatCurrency(value),
            align: 'center'
        },
        {
            title: 'Người nhận',
            dataIndex: ['address', 'name'],
            key: 'name',
            align: 'center'
        },
        {
            title: 'Số điện thoại',
            dataIndex: ['address', 'phone'],
            key: 'phone',
            align: 'center'
        },
        {
            title: 'Địa chỉ giao',
            key: 'fullAddress',
            render: (_, record) => {
                const { address, ward_name, district_name, province_name } = record.address;
                const fullAddress = `${address}, ${ward_name}, ${district_name}, ${province_name}`;
                return (
                    <Tooltips title={fullAddress}>
                        <div
                            style={{
                                maxWidth: 120,
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {fullAddress}
                        </div>
                    </Tooltips>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (value) => mapStatusToVietnamese(value),
            align: 'center'
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => new Date(value).toLocaleString('vi-VN'),
            align: 'center'
        },
    ];

    return (
        <div className="dashboard-content">
            <SideBar />
            <div className="body-content">
                <HeaderInfo />
                <div className="main-content">
                    <div style={{ marginBottom: 20 }}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={8}>
                                <Card>
                                    <div style={cardStyle}>
                                        <ShoppingCartOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                                        <div>
                                            <div>Tổng đơn hàng</div>
                                            <strong>{stats?.totalOrders}</strong>
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                            <Col xs={24} sm={12} md={8}>
                                <Card>
                                    <div style={cardStyle}>
                                        <UserOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                                        <div>
                                            <div>Tổng khách hàng</div>
                                            <strong>{stats?.totalCustomers}</strong>
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                            <Col xs={24} sm={12} md={8}>
                                <Card>
                                    <div style={cardStyle}>
                                        <AppstoreOutlined style={{ fontSize: 32, color: '#faad14' }} />
                                        <div>
                                            <div>Tổng sản phẩm</div>
                                            <strong>{stats?.totalProducts}</strong>
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                            <Col xs={24} sm={12} md={8}>
                                <Card>
                                    <div style={cardStyle}>
                                        <InboxOutlined style={{ fontSize: 32, color: '#722ed1' }} />
                                        <div>
                                            <div>Sản phẩm tồn kho</div>
                                            <strong>{stats?.totalStock}</strong>
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                            <Col xs={24} sm={12} md={8}>
                                <Card>
                                    <div style={cardStyle}>
                                        <GiftOutlined  style={{ fontSize: 32, color: '#f5222d' }} />
                                        <div>
                                            <div>Sản phẩm đã bán</div>
                                            <strong>{stats?.totalSold}</strong>
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                            <Col xs={24} sm={12} md={8}>
                                <Card>
                                    <div style={cardStyle}>
                                        <DollarOutlined style={{ fontSize: 32, color: '#f5222d' }} />
                                        <div>
                                            <Tooltips
                                                title={
                                                    <div>
                                                        <div style={{marginBottom: 8}}><b>Doanh thu:</b> {formatCurrency(stats?.totalRevenue)}</div>
                                                        <div><b>Hoàn đơn:</b> {formatCurrency(stats?.totalRefund)}</div>
                                                    </div>
                                                }
                                                placement="top"
                                            >
                                                <div>
                                                    <div>Tổng doanh thu</div>
                                                    <strong>{formatCurrency(stats?.totalRevenue)}</strong>
                                                </div>
                                            </Tooltips>
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                        </Row>
                    </div>

                    <Row justify="start" style={{ marginBottom: 16 }}>
                        <Col>
                            <Select value={chartMode} onChange={setChartMode} style={{ width: 250 }}>
                                <Option value="day">Doanh thu theo ngày trong tháng</Option>
                                <Option value="month">Doanh thu theo tháng trong năm</Option>
                            </Select>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={16}>
                            <Card><Line data={lineChartData} options={lineOptions} /></Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card title="Trạng thái đơn hàng"><Pie data={pieChartData} /></Card>
                        </Col>
                    </Row>

                    <div className='order-recent'>
                        <Row style={{ marginTop: 32 }}>
                            <Col span={24}>
                                <Card title="Danh sách đơn hàng mới">
                                    <Table
                                        dataSource={recentOrders}
                                        columns={columns}
                                        rowKey="_id"
                                        pagination={{ pageSize: 5 }}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <div className='list-product'>
                        <Row style={{ marginTop: 32 }}>
                            <Col span={24}>
                                <Card title="Top sản phẩm bán chạy">
                                    <div className="top-products-list">
                                        {topProducts?.map(product => (
                                            <div key={product._id} className="product-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    <img src={product?.images[0]} alt={product.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                                                    <div>
                                                        <div><strong>{product.name}</strong></div>
                                                        <div style={{ fontSize: 13, color: '#888' }}>Đã bán: {product.sold}</div>
                                                    </div>
                                                </div>
                                                <div style={{ alignSelf: 'center', fontWeight: 'bold', color: 'red' }}>
                                                    {formatCurrency(product?.price_current)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: 32 }}>
                            <Col span={24}>
                                <Card title="Sản phẩm sắp hết hàng">
                                    <div className="low-stock-products">
                                        {lowStockProducts?.data?.map(product => (
                                            <div key={product._id} className="product-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    <img src={product?.images[0]} alt={product.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                                                    <div>
                                                        <div><strong>{product.name}</strong></div>
                                                        <div style={{ fontSize: 13, color: '#888' }}>Tồn kho: {product.stock}</div>
                                                    </div>
                                                </div>
                                                <div style={{ alignSelf: 'center', fontWeight: 'bold', color: 'red' }}>
                                                    {formatCurrency(product?.price_current)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
