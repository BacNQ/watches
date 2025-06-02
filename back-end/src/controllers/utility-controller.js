const _ = require('lodash');
const ObjectId = require('mongodb').ObjectId;
const axios = require('axios');

const GHN_TOKEN = process.env.GHN_TOKEN;
const GHN_SHOP_ID = process.env.GHN_SHOP_ID

module.exports.getProvinces = async (req, res) => {
  try {
    const response = await axios.get(
      'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
      {
        headers: {
          Token: GHN_TOKEN
        }
      }
    );

    const provinces = response.data.data;

    return res.status(200).json({
      success: true,
      data: provinces
    });
  } catch (error) {
    console.error('Error fetching provinces from GHN:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch provinces',
      error: error.message
    });
  }
};

module.exports.getDistrict = async (req, res) => {
  try {
    const province_id = req.query.province_id || req.body.province_id;
    if (!province_id) {
      return res.status(400).json({ success: false, message: 'province_id is required' });
    }

    const response = await axios.post(
      'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
      { province_id: Number(province_id) },
      {
        headers: {
          Token: GHN_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    const districts = response.data.data;

    return res.status(200).json({
      success: true,
      data: districts
    });
  } catch (error) {
    console.error('Error fetching districts from GHN:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch districts',
      error: error.message
    });
  }
};

module.exports.getWard = async (req, res) => {
  try {
    const district_id = req.query.district_id || req.body.district_id;
    if (!district_id) {
      return res.status(400).json({ success: false, message: 'district_id is required' });
    }

    const response = await axios.post(
      'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
      { district_id: Number(district_id) },
      {
        headers: {
          Token: GHN_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    const wards = response.data.data;

    return res.status(200).json({
      success: true,
      data: wards
    });
  } catch (error) {
    console.error('Error fetching wards from GHN:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch wards',
      error: error.message
    });
  }
};

module.exports.getShop = async (req, res) => {
  try {
    const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/v2/shop/all', {
      headers: {
        Token: GHN_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.data) {
      return res.status(200).json({
        success: true,
        shops: response.data.data
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Không nhận được dữ liệu từ GHN.'
      });
    }
  } catch (error) {
    console.error('Lỗi lấy danh sách shop từ GHN:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi gọi API GHN',
      error: error.response?.data || error.message
    });
  }
};

module.exports.getService = async (req, res) => {
  try {
    const {
      from_district,
      to_district,
      height,
      length,
      weight,
      width
    } = req.body;

    if (!from_district || !to_district || !weight) {
      return res.status(400).json({ message: 'Thiếu tham số bắt buộc (from_district, to_district, weight)' });
    }

    const response = await axios.post(
      'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services',
      {
        shop_id: parseInt(GHN_SHOP_ID),
        from_district: parseInt(from_district),
        to_district: parseInt(to_district),
        height: parseInt(height) || 15,
        length: parseInt(length) || 15,
        weight: parseInt(weight) || 500,
        width: parseInt(width) || 15
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Token': GHN_TOKEN
        }
      }
    );

    const data = response.data;

    if (data.code !== 200) {
      return res.status(500).json({ message: 'Lỗi từ GHN', detail: data });
    }

    return res.json({ services: data.data });
  } catch (error) {
    console.error('Lỗi getService:', error.message);
    return res.status(500).json({ message: 'Lỗi server khi lấy dịch vụ từ GHN', error: error.message });
  }
};

module.exports.calculateFee = async (req, res) => {
  try {
    const {
      from_district_id,
      to_district_id,
      from_ward_code,
      to_ward_code,
      service_id,
      weight,
      height,
      length,
      width,
      coupon = null,
      insurance_value,
    } = req.body;

    if (!from_district_id || !to_district_id || !service_id || !weight || !from_ward_code || !to_ward_code) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await axios.post(
      'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
      {
        from_district_id,
        to_district_id,
        from_ward_code,
        to_ward_code,
        service_id,
        weight,
        height,
        length,
        width,
        insurance_value,
        coupon
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Token': GHN_TOKEN,
          'ShopId': GHN_SHOP_ID
        }
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.error("GHN Fee Error:", error?.response?.data || error.message);
    return res.status(500).json({
      message: "Failed to calculate shipping fee",
      error: error?.response?.data || error.message
    });
  }
};