const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');
const OrderModel = require('../models/orders/order');
const { validObjectId } = require('../helpers/mongo-helper');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

module.exports.getOrderUser = async (req, res) => {
    try {
        const {
            page = 1,
            size = 20,
            sort = 'createdAt',
            order = 'desc',
            status,
            search,
        } = req.query;

        const limit = Math.max(Number(size), 1);
        const skip = (Math.max(Number(page), 1) - 1) * limit;

        const sortBy = { [sort]: order === 'asc' ? 1 : -1 };

        const filter = {
            deleted: false,
            'address.user': req.userId,
        };

        if (status) {
            filter.status = status;
        }

        if (search && search.trim() !== '') {
            const keyword = new RegExp(search.trim(), 'i');
            filter.$or = [
                { app_trans_id: keyword },
                { 'items.name': keyword },
            ];
        }

        const [orders, total] = await Promise.all([
            OrderModel.find(filter)
                .sort(sortBy)
                .skip(skip)
                .limit(limit)
                .select('-__v'),
            OrderModel.countDocuments(filter),
        ]);

        return res.send({
            code: 1,
            message: 'success',
            data: {
                results: orders,
                pagination: {
                    page: Number(page),
                    size: limit,
                    total,
                },
            },
        });
    } catch (err) {
        console.error('getOrderUser error:', err);
        return res.status(400).send({ code: 0, message: 'Bad request' });
    }
};

module.exports.getAllOrders = async (req, res) => {
    try {
        const {
            page = 1,
            size = 20,
            sort = 'createdAt',
            order = 'desc',
            status,
            search,
        } = req.query;

        const limit = Math.max(Number(size), 1);
        const skip = (Math.max(Number(page), 1) - 1) * limit;

        const sortBy = { [sort]: order === 'asc' ? 1 : -1 };

        const filter = {
            deleted: false,
        };

        if (status) {
            filter.status = status;
        }

        if (search && search.trim() !== '') {
            const keyword = new RegExp(search.trim(), 'i');
            filter.$or = [
                { app_trans_id: keyword },
                { 'address.name': keyword },
                { 'address.phone': keyword },
            ];
        }

        const [orders, total] = await Promise.all([
            OrderModel.find(filter)
                .sort(sortBy)
                .skip(skip)
                .limit(limit)
                .select('-__v'),
            OrderModel.countDocuments(filter),
        ]);

        return res.send({
            code: 1,
            message: 'success',
            data: {
                results: orders,
                pagination: {
                    page: Number(page),
                    size: limit,
                    total,
                },
            },
        });
    } catch (err) {
        console.error('getAllOrders error:', err);
        return res.status(400).send({ code: 0, message: 'Bad request' });
    }
};

module.exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!ObjectId.isValid(orderId)) {
            return res.status(400).send({ code: 0, message: 'Invalid order ID' });
        }

        if (!['pending', 'approved', 'success', 'cancelled', 'shipping'].includes(status)) {
            return res.status(400).send({ code: 0, message: 'Invalid status' });
        }

        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            { status: status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).send({ code: 0, message: 'Order not found' });
        }

        return res.send({
            code: 1,
            message: 'Cập nhật trạng thái thành công!',
            data: {
                order,
            },
        });
    } catch (err) {
        console.error('updateOrderStatus error:', err);
        return res.status(400).send({ code: 0, message: 'Bad request' });
    }
};

module.exports.cancelOrder = async (req, res) => {
    try {
        const { orderId, note } = req.body;

        if (!ObjectId.isValid(orderId)) {
            return res.status(400).send({ code: 0, message: 'Invalid order ID' });
        }

        if (!note || note.trim() === '') {
            return res.status(400).send({ code: 0, message: 'Lý do hủy đơn không được để trống' });
        }

        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            { status: 'cancelled', note: note },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).send({ code: 0, message: 'Order not found' });
        }

        return res.send({
            code: 1,
            message: 'Đơn hàng đã được hủy thành công',
            data: {
                order,
            },
        });
    } catch (err) {
        console.error('cancelOrder error:', err);
        return res.status(400).send({ code: 0, message: 'Bad request' });
    }
};

module.exports.generateInvoice = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!ObjectId.isValid(orderId)) {
            return res.status(400).send({ code: 0, message: 'Invalid order ID' });
        }

        const order = await OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).send({ code: 0, message: 'Order not found' });
        }

        const invoiceDirectory = path.join(__dirname, '../public/invoices');
        if (!fs.existsSync(invoiceDirectory)) {
            fs.mkdirSync(invoiceDirectory, { recursive: true });
        }

        const fontPath = path.join(__dirname, '../fonts', 'roboto-font.ttf');
        const doc = new PDFDocument();
        const invoicePath = path.join(invoiceDirectory, `invoice_${orderId}.pdf`);
        const writeStream = fs.createWriteStream(invoicePath);

        let statusText;
        switch (order.status) {
            case 'pending':
                statusText = 'Đang xử lý';
                break;
            case 'approved':
                statusText = 'Đã duyệt mua';
                break;
            case 'shipping':
                statusText = 'Đang vận chuyển';
                break;
            case 'success':
                statusText = 'Mua thành công';
                break;
            case 'cancelled':
                statusText = 'Đơn bị hủy';
                break;
            default:
                statusText = 'Trạng thái không xác định';
        }

        doc.pipe(writeStream);

        doc.registerFont('Roboto', fontPath);
        doc.font('Roboto').fontSize(16).text('CỬA HÀNG THỜI TRANG VÀ ĐỒNG HỒ B&Q WATCHES', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(13).text('Số điện thoại: 0353827279', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(13).text('Email: bnq.watches@gmail.com', { align: 'center' });
        doc.moveDown(1);

        doc.fontSize(18).text('HÓA ĐƠN ĐƠN HÀNG', { align: 'center' });
        doc.moveDown(1);

        doc.fontSize(12).text(`Mã giao dịch: ${order.app_trans_id}`);
        doc.moveDown(0.5);
        doc.text(`Ngày tạo: ${new Date(order.createdAt).toLocaleString()}`);
        doc.moveDown(0.5);
        doc.text(`Tổng tiền: ${order.amount} VND`);
        doc.moveDown(0.5);
        doc.text(`Trạng thái: ${statusText}`);
        doc.moveDown(1);

        doc.text('Thông tin giao hàng:');
        doc.moveDown(0.5);
        doc.text(`- Địa chỉ: ${order.address.name}, ${order.address.address}`);
        doc.moveDown(0.5);
        doc.text(`- Điện thoại: ${order.address.phone}`);
        doc.moveDown(0.5);
        doc.text(`- Email: ${order.address.email}`);
        doc.moveDown(1);
        doc.text('Danh sách sản phẩm:');
        doc.moveDown(0.5);
        order.items.forEach((item, index) => {
            doc.text(`${index + 1}. ${item.name}`);
            doc.moveDown(0.5);
            doc.text(`   Số lượng: ${item.qty}`);
            doc.moveDown(0.5);
            doc.text(`   Giá sản phẩm: ${item.price} VND`);
            doc.moveDown(0.5);
        });


        doc.moveDown(1);
        doc.text(`Lý do hủy (nếu có): ${order.note ? order.note : 'Không có'}`);
        doc.end();

        writeStream.on('finish', () => {
            res.download(invoicePath, `invoice_${orderId}.pdf`, (err) => {
                if (err) {
                    console.error('Error downloading the file:', err);
                    return res.status(500).send({ code: 0, message: 'Error downloading the file' });
                }
            });
        });

    } catch (err) {
        console.error('generateInvoice error:', err);
        return res.status(500).send({ code: 0, message: 'Internal Server Error' });
    }
};

module.exports.requestCancelOrder = async (req, res) => {
    try {
        const { orderId, note } = req.body;

        if (!ObjectId.isValid(orderId)) {
            return res.status(400).send({ code: 0, message: 'Invalid order ID' });
        }

        if (!note || note.trim() === '') {
            return res.status(400).send({ code: 0, message: 'Lý do hủy đơn không được để trống' });
        }

        const order = await OrderModel.findOne({ _id: orderId, status: 'pending' });
        if (!order) {
            return res.status(400).send({ code: 0, message: 'Không thể gửi yêu cầu hủy đơn này!' });
        }

        order.status = 'cancel_requested';
        order.note = note;
        await order.save();

        return res.send({
            code: 1,
            message: 'Yêu cầu hủy đơn đã được gửi thành công!',
            data: { order }
        });
    } catch (err) {
        console.error('requestCancelOrder error:', err);
        return res.status(400).send({ code: 0, message: 'Bad request' });
    }
};

module.exports.approveCancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!ObjectId.isValid(orderId)) {
            return res.status(400).send({ code: 0, message: 'Invalid order ID' });
        }

        const order = await OrderModel.findOne({ _id: orderId, status: 'cancel_requested' });
        if (!order) {
            return res.status(400).send({ code: 0, message: 'Không thể duyệt đơn này!' });
        }

        order.status = 'cancelled';
        await order.save();

        return res.send({
            code: 1,
            message: 'Đơn hàng đã được hủy thành công!',
            data: { order }
        });
    } catch (err) {
        console.error('approveCancelOrder error:', err);
        return res.status(400).send({ code: 0, message: 'Bad request' });
    }
};

