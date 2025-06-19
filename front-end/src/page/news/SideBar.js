"use client";
import './news.scss'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getNews } from "../../services/common";

const SideBar = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await getNews({ limit: 10 });
                setNewsList(res?.data || []);
            } catch (err) {
                setNewsList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <div className='news-sidebar'>
            <div className='sidebar-header'>Bài viết tương tự</div>
            <div style={{ height: 2, width: 100, background: "#e53935", borderRadius: 10, margin: "6px 0 16px 0"}}></div>
            {loading ? (
                <div>Đang tải...</div>
            ) : (
                <div>
                    {newsList.length === 0 ? (
                        <div>Không có bài viết nào!</div>
                    ) : (
                        newsList.map((news, idx) => (
                            <div
                                key={news.slug}
                                style={{
                                    borderBottom: idx === newsList.length - 1 ? "none" : "1px solid #eee",
                                    padding: "10px 0",
                                }}
                            >
                                <Link className='title_sidebar' href={`/news/${news.slug}`}>{news.title}</Link>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SideBar;
