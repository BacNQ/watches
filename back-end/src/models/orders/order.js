const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const AddressSchema = new Mongoose.Schema({
    user: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    province_id: { type: Number },
    province_name: { type: String },
    district_id: { type: Number },
    district_name: { type: String },
    ward_id: { type: String },
    ward_name: { type: String },
    remark: { type: String},
    type: { type: String, enum: ['home', 'office'], default: 'home' },
    primary: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
}, { _id: false });

const OrderSchema = new Mongoose.Schema({
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
      images: { type: [String] },
      fee_shipping: {type: Number}
    }
  ],
  address: AddressSchema,
  status: {
    type: String,
    enum: ['pending', 'approved', 'success', 'cancelled', 'shipping'],
    default: 'pending'
  },
  paid: { type: Boolean, default: false },
  paid_at: { type: Date },
  deleted: { type: Boolean, default: false },
}, {
  timestamps: true
});

module.exports = Mongoose.model('orders', OrderSchema);
