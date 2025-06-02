'use client'
import React, {useEffect, useState} from 'react'
import dynamic from "next/dynamic";
import Link from 'next/link';
import { Badge } from "@nextui-org/react";
import './style.scss'
import { useUser } from '../../provider/UserProvider'
import { useFavProducts, useCarts } from '../../query/product';
import HeaderInfo from './HeaderInfo'
const SearchInput = dynamic(() => import("./SearchInput"), { ssr: false });

const HeaderTop = () => {
  const { user } = useUser();
  const { data } = useFavProducts();
  const { data: cartData, refetch } = useCarts();

  return (
    <div className="header-top">
      <div className='header-nav-top w-full bg-[#070e35] flex items-center justify-end h-[40px] pr-[80px] gap-[50px] text-white/80 text-[13px] font-semibold'>
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
            <img src="/static/logo/logo.png" alt="Logo" className="h-[160px]" />
          </Link>
        </div>
        <div className="flex justify-center ml-[-220px] relative">
          <SearchInput/>
        </div>
        <div className="flex items-center justify-end gap-[54px] text-gray-600 text-xl">
          <div className='mr-8'>
            <div className='flex items-center gap-2'>
              <i className="fa-solid fa-user bg-[#d8d8d8] p-[10px] px-[12px] rounded-lg shadow-md"></i>
              <HeaderInfo user={user} />
            </div>
          </div>
          <div className='item-action'>
            <a href='/account/cart'>
              <Badge
                content={cartData?.availables?.data?.length}
                isInvisible={!(cartData?.availables?.data?.length > 0)}
                color="primary"
                size="sm"
                className="btn-badge"
              >
                <i className="fa-solid fa-cart-shopping text-[20px]"></i>
              </Badge>
            </a>
          </div>
          <div className='item-action'>
            <a href='/account/favourite/product'>
              <Badge
                content={data?.res?.length}
                isInvisible={!(data?.res?.length > 0)}
                color="primary"
                size="sm"
                className="btn-badge"
              >
                <i className="fa-regular fa-heart text-[23px]"></i>
              </Badge>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderTop