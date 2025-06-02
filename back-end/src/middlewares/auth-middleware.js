const jwt = require('jsonwebtoken');
require("dotenv").config();
const SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Chưa đăng nhập hoặc token không hợp lệ' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // Gán user ID và info từ token vào request
        req.userId = decoded.id;
        next(); // Cho phép đi tiếp sang controller
    } catch (error) {
        return res.status(401).json({ message: 'Token hết hạn hoặc không hợp lệ' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập (admin only)' });
    }
    next();
};

module.exports = {
    authMiddleware,
    isAdmin
};
