const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');
const OrderModel = require('../models/orders/order');
const { validObjectId } = require('../helpers/mongo-helper');

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

