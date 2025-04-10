const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

module.exports = async (to, otp) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: to,
    subject: 'Mã xác thực khôi phục mật khẩu',
    html: `
      <p>Xin chào,</p>
      <p>Bạn vừa yêu cầu khôi phục mật khẩu trên hệ thống bán đồng hồ B&Q Watches.</p>
      <p>Mã xác thực của bạn là: <strong style="font-size: 18px;">${otp}</strong></p>
      <p>Mã có hiệu lực trong vòng 15 phút.</p>
      <p>Trân trọng,<br />Đồng hồ B&Q Watches</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
