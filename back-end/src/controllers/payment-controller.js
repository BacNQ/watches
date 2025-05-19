const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');
const crypto = require('crypto');
const axios = require('axios');
const { validObjectId } = require('../helpers/mongo-helper');

const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  endpoint: 'https://sandbox.zalopay.com.vn/v001/tpe/createorder',
  callback_url: 'http://localhost:3000/zalopay-callback'
};

/**Zalo Pay */
module.exports.createZaloPay = async (req, res) => {
    try {
    const { amount, items } = req.body;

    const app_trans_id = `${new Date().toISOString().slice(2, 10).replace(/-/g, '')}_${Date.now()}`;
    const order = {
      app_id: config.app_id,
      app_trans_id,
      app_user: 'demo',
      app_time: Date.now(),
      item: JSON.stringify(items),
      amount: amount || 50000,
      description: `Demo - Thanh toan don hang #${app_trans_id}`,
      bank_code: 'zalopayapp',
      callback_url: config.callback_url,
    };

    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex');

    const response = await axios.post(config.endpoint, null, { params: order });
    res.json({
      order_url: response.data.order_url,
      transaction_token: response.data.zp_trans_token,
    });
  } catch (error) {
    console.error('ZaloPay Create Order Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create ZaloPay order.' });
  }
}