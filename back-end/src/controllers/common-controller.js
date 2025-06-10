const OrderModel = require('../models/orders/order');
const UserModel = require('../models/users/user');
const ProductModel = require('../models/product/item');

module.exports.getDashboardStats = async (req, res) => {
  try {
    const [totalOrders, totalCustomers, totalProducts] = await Promise.all([
      OrderModel.countDocuments(),
      UserModel.countDocuments({ role: 'user' }),
      ProductModel.countDocuments(),
    ]);

    //Sản phẩm trong kho
    const totalStockResult = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: '$stock' }
        }
      }
    ]);

    //Sản phẩm đã bán
    const totalSoldResult = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          totalSold: { $sum: '$sold' }
        }
      }
    ]);

    // Tính tổng doanh thu
    const revenueResult = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' }
        }
      }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const totalStock = totalStockResult[0]?.totalStock || 0;
    const totalSold = totalSoldResult[0]?.totalSold || 0;

    res.json({
      totalOrders,
      totalCustomers,
      totalProducts,
      totalRevenue,
      totalStock,
      totalSold
    });
  } catch (err) {
    console.error('Lỗi lấy thống kê:', err);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy thống kê' });
  }
};

module.exports.getRevenueByDay = async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ month và year' });
  }

  try {
    const startDate = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
    const endDate = new Date(Date.UTC(Number(year), Number(month), 1));

    const revenueByDay = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
          deleted: false
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: '$createdAt' },
          totalRevenue: { $sum: '$amount' },
        },
      },
      {
        $sort: { '_id': 1 },
      },
    ]);

    res.status(200).json(revenueByDay);
  } catch (err) {
    console.error('Lỗi lấy doanh thu theo ngày:', err);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy doanh thu theo ngày' });
  }
};


module.exports.getRevenueByMonth = async (req, res) => {
  const { year } = req.query;

  if (!year) {
    return res.status(400).json({ message: 'Vui lòng cung cấp năm' });
  }

  try {
    const startDate = new Date(Date.UTC(Number(year), 0, 1));
    const endDate = new Date(Date.UTC(Number(year) + 1, 0, 1));

    const revenueByMonth = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
          deleted: false
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalRevenue: { $sum: '$amount' },
        },
      },
      {
        $sort: { '_id': 1 },
      },
    ]);

    res.status(200).json(revenueByMonth);
  } catch (err) {
    console.error('Lỗi lấy doanh thu theo tháng:', err);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy doanh thu theo tháng' });
  }
};

module.exports.getOrderByStatus = async (req, res) => {
  try {
    const result = await OrderModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error('Lỗi lấy thống kê trạng thái đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi máy chủ khi thống kê trạng thái đơn hàng' });
  }
};

module.exports.getTopSoldProducts = async (req, res) => {
  try {
    const topProducts = await ProductModel.find({ sold: { $gt: 0 } })
      .sort({ sold: -1 })
      .limit(5)
      .select('name images sold price_current');

    res.status(200).json(topProducts);
  } catch (err) {
    console.error('Lỗi khi lấy top sản phẩm:', err);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy top sản phẩm bán chạy' });
  }
};

module.exports.getLowStockProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;

  try {
    const query = { stock: { $lte: 5 } };

    const [products, total] = await Promise.all([
      ProductModel.find(query)
        .select('name images stock price_current')
        .sort({ stock: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ProductModel.countDocuments(query),
    ]);

    res.status(200).json({
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm sắp hết hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy sản phẩm sắp hết hàng' });
  }
};

module.exports.getRecentOrders = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = await OrderModel.find({
      createdAt: { $gte: sevenDaysAgo }
    })
    .sort({ createdAt: -1 })
    .select('app_trans_id amount address status createdAt');

    res.status(200).json(recentOrders);
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng mới:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy đơn hàng mới' });
  }
};











