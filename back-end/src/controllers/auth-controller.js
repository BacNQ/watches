const ObjectId = require('mongodb').ObjectId;
const User = require('../models/users/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require("moment");
const crypto = require('crypto');
const UserModel = require('../models/users/user')
require("dotenv").config();
const sendOTP = require('../utils/send_otp')

module.exports.UserLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [{ email: username }, { phone: username }],
        });

        if (!user) return res.status(400).json({ message: 'Tài khoản không tồn tại' });

        // So sánh password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

        // Tạo JWT
        const accessToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}

module.exports.AdminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [{ email: username }, { phone: username }],
            role: 'admin'
        });

        if (!user) return res.status(400).json({ message: 'Tài khoản không tồn tại' });

        // So sánh password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

        // Tạo JWT
        const accessToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}

module.exports.createAdmin = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        const newAdmin = await UserModel.create({
            name,
            email,
            phone,
            password,
            role: 'admin'
        });
        res.status(200).json({ message: 'Tạo admin thành công', admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

module.exports.UserRegister = async (req, res) => {
    const { short_name, email, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Mật khẩu không khớp' });
    }

    try {
        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được đăng ký' });
        }

        // Lưu người dùng vào database
        const newUser = new User({
            username: short_name,
            email,
            phone,
            password,
        });

        await newUser.save();

        // Tạo JWT
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Trả về JWT trong response
        res.status(201).json({ token, user: { username: newUser.short_name, email: newUser.email, phone: newUser.phone } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đăng ký thất bại' });
    }
}

module.exports.UserVerify = async (req, res) => {
    const { email, phone } = req.body;

    try {
        // 1. Tìm user theo email hoặc phone
        const user = await User.findOne({ $or: [{ email }, { phone }] });
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        // 2. Tạo mã xác minh (OTP)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Tạo token tạm (có thể dùng JWT hoặc mã ngẫu nhiên)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // 4. Cập nhật user với mã và hạn dùng
        user.resetPasswordOTP = otp;
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 phút
        await user.save();

        // 5. Gửi OTP (email hoặc SMS)
        await sendOTP(user.email || user.phone, otp);

        // 6. Trả về token cho frontend
        res.json({ message: 'OTP đã được gửi', res: { token } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
}

module.exports.UserForgot = async (req, res) => {
    const { token, code, password } = req.body;

    if (!token || !code || !password) {
        return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
    }

    try {
        // 1. Giải mã token để lấy user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

        // 2. Kiểm tra OTP và hạn sử dụng
        const now = Date.now();
        if (
            user.resetPasswordOTP !== code ||
            !user.resetPasswordExpires ||
            user.resetPasswordExpires < now
        ) {
            return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
        }

        // 3. Cập nhật mật khẩu và xoá thông tin khôi phục
        user.password = password;
        user.resetPasswordOTP = undefined;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.json({ message: 'Mật khẩu đã được cập nhật thành công' });

    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
}

module.exports.getInfoUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean();

        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

        delete user.password;
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}

module.exports.updateProfile = async (req, res) => {
    try {
        const body = req.body;
        const query = {
            _id: { $ne: req.userId }
        }
        let filter = [];
        if (body.email) filter.push({ email: lowerCase(body.email) })
        if (body.phone) filter.push({ phone: lowerCase(body.phone) })
        let userExsit = null;
        if (filter.length > 0) {
            query['$or'] = filter;
            userExsit = await UserModel.findOne(query);
        }
        if (userExsit) {
            res.status(404).send({ message: (body.phone && item.phone == body.phone) ? ("Số " + item.phone + " đã tồn tại") : ("Email " + item.email + " đã tồn tại.") });
        } else {
            UserModel.findOne({ _id: req.userId })
                .then(async (user) => {
                    if (user) {
                        const payload = {
                            updated_date: new Date()
                        }
                        if (body.username !== undefined) payload.username = body.username;
                        if (!user.email && body.email !== undefined) payload.email = body.email;
                        if (!user.phone && body.phone !== undefined) payload.phone = body.phone;
                        if (body.birthdate !== undefined && body.birthdate !== null && moment(body.birthdate).isValid()) payload.birthdate = new Date(body.birthdate);
                        if (body.gender !== undefined) payload.gender = body.gender;
                        if (body.avatar !== undefined) payload.avatar = body.avatar;
                        await UserModel.updateOne({ _id: user._id }, { $set: payload });
                        res.status(200).send({ code: 1, message: 'Cập nhập thông tin thành công' })
                    } else {
                        res.status(400).send({ code: 0, message: 'Không tìm tài khoản cập nhập' })
                    }
                }).catch((error) => {
                    res.status(400).send({ code: 0, message: 'Không cập nhập được thông tin. Vui lòng liên hệ cho chúng tôi.' })
                })
        }
    } catch (error) {
        res.status(500).send({ code: 0, message: 'Không cập nhập được thông tin. Vui lòng liên hệ cho chúng tôi.' })
    }
};

module.exports.updatePassword = async (req, res) => {
    const { oldPassword, password, confirmpassword } = req.body;

    if (!oldPassword || !password || !confirmpassword) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
        }

        user.password = password; // Không hash ở đây nữa
        await user.save();

        res.status(200).json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};


