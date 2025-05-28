const crypto = require('crypto');
const axios = require('axios');
const moment = require('moment');
const OrderModel = require('../models/orders/order');

const config = {
  app_id: '2554',
  key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
  key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create'
};

const generateAppTransId = async () => {
  while (true) {
    const datePart = moment().format('YYMMDD');
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    const app_trans_id = `${datePart}_${randomPart}`;

    const existing = await OrderModel.findOne({ app_trans_id });
    if (!existing) return app_trans_id;
  }
};

module.exports.paymentByZaloPay = async (req, res) => {
  try {
    const { amount, items } = req.body;
    const app_trans_id = await generateAppTransId();

    const embed_data = {};
    const order = {
      app_id: config.app_id,
      app_user: 'demo_user',
      app_time: Date.now(),
      app_trans_id,
      item: JSON.stringify(items || []),
      embed_data: JSON.stringify(embed_data),
      amount,
      description: `ZaloPay Demo - Thanh toán đơn hàng #${app_trans_id}`,
      bank_code: '',
      callback_url: 'https://3055-14-162-145-93.ngrok-free.app/api/zalopay/callback',
      // redirecturl : 'https://1095-14-162-145-93.ngrok-free.app',
      mac: ''
    };

    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex');

    const response = await axios.post(config.endpoint, null, {
      params: order
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create ZaloPay order failed' });
  }
};

module.exports.zaloPayCallback = async (req, res) => {
  try {
    const { data, mac } = req.body;

    const calculatedMac = crypto
      .createHmac('sha256', config.key2)
      .update(data)
      .digest('hex');

    if (mac !== calculatedMac) {
      return res.status(400).json({
        return_code: -1,
        return_message: 'Invalid MAC - Request bị giả mạo hoặc sai key2'
      });
    }

    const parsedData = JSON.parse(data);
    const {
      app_trans_id,
      zp_trans_id,
      amount,
      item
    } = parsedData;

    if (!parsedData.zp_trans_id) {
      return res.status(200).json({
        return_code: 1,
        return_message: 'Không có mã giao dịch ZaloPay - Bỏ qua'
      });
    }

    let order = await OrderModel.findOne({ app_trans_id });

    if (order) {
      if (!order.paid) {
        order.status = 'paid';
        order.paid = true;
        order.paid_at = new Date();
        order.zp_trans_id = zp_trans_id;
        await order.save();
      }

      return res.status(200).json({
        return_code: 1,
        return_message: 'Đơn hàng đã tồn tại và đã được cập nhật'
      });
    }

    const items = JSON.parse(item || '[]');

    await OrderModel.create({
      app_trans_id,
      zp_trans_id,
      amount,
      items,
      description: `Đơn hàng thanh toán ZaloPay ${app_trans_id}`,
      status: 'paid',
      paid: true,
      paid_at: new Date()
    });

    return res.status(200).json({
      return_code: 1,
      return_message: 'Tạo đơn hàng mới thành công'
    });

  } catch (err) {
    console.error('ZaloPay Callback Error:', err);
    return res.status(500).json({
      return_code: -1,
      return_message: 'Lỗi server khi xử lý callback'
    });
  }
};
