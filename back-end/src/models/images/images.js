const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = Schema({
  type: String,
  path: String,
  url: String,
  name: String,
  description: String,
  size: Number,
  status: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
  createdDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('images', imageSchema);
