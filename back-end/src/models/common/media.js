const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mediaSchema = Schema({
  file_id: { type: String, required: true, trim: true, unique: true },
  path: { type: String, required: true, trim: true },
  type: { type: String },
  url: { type: String },
  name: { type: String },
  size: { type: Number },
  description: { type: String },
  product_code: { type: String },
  file_token: { type: String },
  status: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  draft: { type: Boolean, default: false },
  item_id: { type: Schema.Types.ObjectId },
  created_by: { type: Schema.Types.ObjectId },
  created_date: { type: Date, default: Date.now },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

mediaSchema.virtual('image_url').get(function() {
  return 'http://localhost:3000' + '/' + this.path
});

mediaSchema.statics.findPagination = function(query, option) {
  const size = Number(option.size) > 0 && Number(option.size) < 100 ? Number(option.size) : 20;
  const page = Number(option.page) > 0 && Number(option.size) < 100 ? Number(option.page) : 1;
  const sortBy = option.sortBy || {};
  return this.find(query)
  .sort(sortBy)
  .skip(size * page - size)
  .limit(size)
  .then(images => {
      return this.countDocuments(query).then(count => ({
          results: images || [],
          pagination: {
              size: size ,
              page: page ,
              total: count,
          }
      }));
  });
};

module.exports = mongoose.model('medias', mediaSchema);
