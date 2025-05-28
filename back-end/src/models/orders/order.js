const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  app_trans_id: { type: String, required: true, unique: true },
  zp_trans_id: { type: String },
  amount: { type: Number, required: true },
  description: { type: String },
  items: [
    {
      slug: String,
      name: String,
      qty: Number,
      price: Number,
      url: String,
      images: [String]
    }
  ],
  status: { type: String, default: 'pending' }, // pending | paid | cancelled
  paid: { type: Boolean, default: false },
  paid_at: { type: Date },
}, {
  timestamps: true // tự tạo createdAt, updatedAt
});

module.exports = mongoose.model('orders', OrderSchema);
