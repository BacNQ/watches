'use client'
import React from 'react'
import Link from 'next/link';
import { Button, Input } from "@nextui-org/react";
import './style.scss'

const HeaderTop = () => {
  return (
    <div className="header-top">
      <div className='header-nav-top w-full bg-[#070e35] flex items-center justify-end h-[40px] pr-[80px] gap-[50px] text-white text-[13px] font-semibold'>
        <div className='flex items-center gap-2'>
          <i className="fa-solid fa-phone-volume"></i>
          <span>035 382 7279</span>
        </div>
        <div className='flex items-center gap-2'>
          <i className="fa-solid fa-envelope text-[15px]"></i>
          <span>bnq.watches@gmail.com</span>
        </div>
        <div className='flex items-center gap-2'>
          <i className="fa-solid fa-location-dot"></i>
          <span>58 Trần Đăng Ninh, Cầu Giấy, Hà Nội</span>
        </div>
      </div>
      <div className="header-main grid grid-cols-3 items-center gap-4 max-w-[1280px] mx-auto w-full h-[100px]">
        <div className="flex justify-start h-[100px] items-center ml-[-60px]">
          <Link href="/">
            <img src="static/logo/logo.png" alt="Logo" className="h-[160px]" />
          </Link>
        </div>
        <div className="flex justify-center ml-[-220px] relative">
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm tại đây"
            className="header-input"
            radius="full"
            variant="bordered"
          />
          <i className="fa-solid fa-magnifying-glass text-[20px] absolute left-[33px] top-[11px]"></i>
        </div>
        <div className="flex items-center justify-end gap-[54px] text-gray-600 text-xl">
          <div className='mr-8'>
            <div className='flex items-center gap-2'>
              <i className="fa-solid fa-user bg-[#d8d8d8] p-[10px] px-[12px] rounded-lg shadow-md"></i>
              <div className='flex flex-col'>
                <span className='text-[12px] text-[#939393]'>Xin chào</span>
                <span className='text-[14px] font-semibold mt-[-6px]'>Nguyễn Quí Bắc <i className="fa-solid fa-caret-down ml-[6px]"></i></span>
              </div>
            </div>
          </div>
          <div>
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
          <div>
            <i className="fa-solid fa-heart"></i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderTop