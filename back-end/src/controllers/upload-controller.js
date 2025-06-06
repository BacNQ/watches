const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Cấu hình lưu trữ Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `image-${uniqueSuffix}${ext}`);
    }
});

// Middleware upload ảnh đơn lẻ với field name là 'image'
const upload = multer({ storage }).single('image');

// Controller xử lý upload
module.exports.uploadImages = async (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            console.error('Lỗi upload:', err);
            return res.status(500).json({ code: 0, message: 'Lỗi khi tải ảnh' });
        }

        if (!req.file) {
            return res.status(400).json({ code: 0, message: 'Không có file được tải lên' });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        return res.status(200).json({
            code: 1,
            message: 'Tải ảnh thành công',
            url: imageUrl
        });
    });
};
