'use client'
import React from 'react';
import SideBar from './SideBar'
import './news.scss'
import Link from 'next/link';
import News from '../../components/sections/News'

const NewsPage = ({ news }) => {
  if (!news) {
    return <div>Không tìm thấy bài viết</div>;
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className='container'>
      <nav aria-label="breadcrumb" className='breadcrumb'>
        <ol className="breadcrumb-list">
          <li className="breadcrumb-item">
            <Link href="/"><i className='bx bx-home-alt-2' />Trang chủ</Link>
          </li>
          <li className="breadcrumb-item active">
            <i className='bx bx-chevron-right' />
            <span>Chi tiết bài viết</span>
          </li>
        </ol>
      </nav>
      <div className="news-detail-container">
        <div className='main-content'>
          <h1 className='news-title'>{news.title}</h1>
          <div className='news-create'>
            Đăng bởi <b>{news.author?.username || "Admin"}</b>
            {news.createdAt && <> • {formatDate(news.createdAt)}</>}
          </div>
          {news.thumbnail && (
            <img src={news.thumbnail} alt={news.title} className='news-image' />
          )}

          <div className="news-content" style={{ lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: news.content }} />
        </div>

        <SideBar />
      </div>
      <News />
    </div>

  );
};

export default NewsPage;
