import React from 'react'
import Link from 'next/link'
import './footers.scss'

const Footer = () => {
  return (
    <div className='footer-page'>
        <footer className='footer-main'>
            <div className='container'>
                <div className='footer-content'>
                    <div className='footer-item logo'>
                        <div className='footer-image'>
                            <Link href="/">
                                <img src="/static/logo/logo.png" alt="Logo" className='h-[200px]'/>
                            </Link>
                        </div>
                        <div className='footer-text'>
                            <p className='mb-0 text-[13px] font-bold text-gray-800'>THỜI TRANG & ĐẲNG CẤP</p>
                            <hr className='my-2 mx-0'/>
                            <p className='text-[12px] leading-[20px] text-justify pb-4'><strong>B&Q Watches</strong> - Nền tảng mua sắm đồng hồ chính hãng từ các thương hiệu hàng đầu thế giới. Chúng tôi kết nối trực tiếp với các nhà phân phối uy tín, mang đến bộ sưu tập đa dạng từ Rolex, Omega, Seiko, Casio, Tissot, Citizen và nhiều thương hiệu danh tiếng khác.</p>
                        </div>
                    </div>
                    <div className='footer-item'>
                        <h3 className='text-[#222] text-[14px] font-[550] mb-2'>VỀ CHÚNG TÔI</h3>
                        <ul>
                            <li className='leading-[24px]'><a className='list-none text-[#333] text-[13px]' href="#">Giới thiệu</a></li>
                            <li className='leading-[24px]'><a className='list-none text-[#333] text-[13px]' href="#">Thông tin liên hệ</a></li>
                            <li className='leading-[24px]'><a className='list-none text-[#333] text-[13px]' href="#">Tin tức</a></li>
                            <li className='leading-[24px]'><a className='list-none text-[#333] text-[13px]' href="#">FAQ</a></li>
                            <li className='leading-[24px]'><a className='list-none text-[#333] text-[13px]' href="#">Kiến thức đồng hồ</a></li>
                        </ul>
                    </div>
                    <div className='footer-item'>
                        <h3 className='text-[#222] text-[14px] font-[550] mb-2'>CHÍNH SÁCH CHUNG</h3>
                        <ul>
                            <li className='leading-[24px]'><a className='list-none text-[#333] text-[13px]' href="#">Điều khoản thanh toán</a></li>
                            <li className='leading-[24px]'><a className='list-none text-[#333] text-[13px]' href="#">Chính sách bảo hành</a></li>
                            <li className='leading-[24px]'><a className='list-none text-[#333] text-[13px]' href="#">Chính sách bảo mật</a></li>
                            <li className='leading-[24px]'><a className='list-none text-[#333] text-[13px]' href="#">Chính sách vận chuyển</a></li>
                            <li className='leading-[24px]'><a className='list-none text-[#333] text-[13px]' href="#">Chính sách đổi trả</a></li>
                        </ul>
                    </div>
                    <div className='footer-item'>
                        <div>
                            <h3 className='text-[#222] text-[14px] font-[550] mb-2'>THEO DÕI CHÚNG TÔI TẠI</h3>
                            <ul className='flex gap-5 mt-3 ml-1'>
                                <li><a className='list-none text-[#333] text-[18px]' href="#"><i className="fa-brands fa-facebook"></i></a></li>
                                <li><a className='list-none text-[#333] text-[18px]' href="#"><i className="fa-brands fa-facebook-messenger"></i></a></li>
                                <li><a className='list-none text-[#333] text-[18px]' href="#"><i className="fa-brands fa-instagram"></i></a></li>
                                <li><a className='list-none text-[#333] text-[18px]' href="#"><i className="fa-brands fa-youtube"></i></a></li>
                                <li><a className='list-none text-[#333] text-[18px]' href="#"><i className="fa-brands fa-twitter"></i></a></li>
                            </ul>
                        </div>
                        <div className='pt-6'>
                            <h3 className='text-[#222] text-[14px] font-[550] mb-2'>LIÊN HỆ</h3>
                            <div className='flex flex-col gap-3 pt-2'>
                                <span className='text-[#333] text-[13px]'><i className="fa-solid fa-location-dot mr-[6px]"></i>58 Trần Đăng Ninh, Cầu Giấy, Hà Nội</span>
                                <span className='text-[#333] text-[13px]'><i className="fa-solid fa-envelope mr-[6px]"></i>bnq.watches@gmail.com</span>
                                <span className='text-[#333] text-[13px]'><i className="fa-solid fa-phone mr-[6px]"></i>035 382 7279</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        <div className="footer-bottom"></div>
    </div>
  )
}

export default Footer