'use client'
import React, { useEffect, useState } from 'react'
import { getNews } from '../../services/common'
import dayjs from 'dayjs'
import Link from 'next/link'
import './section.scss'

const News = () => {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getNews({ limit: 4, sort: '-createdAt' })
            .then(res => {
                setNews(res.data || [])
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="news-section">
            <h1 className="news-section__title">Bài viết nổi bật</h1>
            <div className="news-list">
                {loading
                    ? <div>Loading...</div>
                    : news.length === 0
                        ? <div>Chưa có bài viết nào.</div>
                        : news.map(item => (
                            <div key={item._id} className="news-item">
                                <div className="news-item__thumb">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                    />
                                </div>
                                <div className="news-item__body">
                                    <Link href={`/news/${item.slug}`}>
                                        <h3 className="news-item__title">{item.title}</h3>
                                    </Link>
                                    <div className="news-item__date">
                                        <i className="fa-solid fa-calendar"></i> {dayjs(item.createdAt).format('DD-MM-YYYY | HH:mm')}
                                    </div>
                                    <div className="news-item__desc">
                                        {item.content.length > 110
                                            ? item.content.substring(0, 110) + '...'
                                            : item.content
                                        }
                                    </div>
                                    <div className="news-item__more">
                                        <Link href={`/news/${item.slug}`} className="news-item__readmore">
                                            Đọc thêm
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                }
            </div>
        </div>
    )
}

export default News
