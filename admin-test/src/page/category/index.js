'use client';
import React, { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar';
import './style.scss';
import HeaderInfo from '../../components/header/HeaderInfo';
import { Table, Spin, Tooltip, Image, Select, Modal, Input, Button, Space } from 'antd';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FilePdfOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const CategoriesV = () => {

    return (
        <div className='categories-manage'>
            <SideBar />
            <div className='body-content'>
                <HeaderInfo />
                <div className='main-content'>
                    <div className='main-header'>
                        <nav aria-label="breadcrumb" className='breadcrumb'>
                            <ol className="breadcrumb-list">
                                <li className="breadcrumb-item">
                                    <Link href="/"><i className='bx bx-home-alt-2' />Trang chủ</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    <i className='bx bx-chevron-right' />
                                    <span>Quản lý danh mục</span>
                                </li>
                            </ol>
                        </nav>
                
                    </div>

                
                </div>
            </div>
        </div>
    );
};

export default CategoriesV;
