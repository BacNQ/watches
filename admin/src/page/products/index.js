'use client'
import React from 'react'
import SideBar from '../../components/sidebar/index'
import './style.scss'
import HeaderInfo from '../../components/header/HeaderInfo';
const ProductV = () => {
    return (
        <div className='product-manage'>
            <SideBar />
            <div className='body-content'>
                <HeaderInfo />
                <div className='main-content'>
                    
                </div>
            </div>
        </div>
    )
}

export default ProductV
