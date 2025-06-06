"use client"
import React, { useEffect, useState } from 'react';
import './top.scss'

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);
    const GoTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        isVisible && (
            <div
                className={`back-to-top fade-in animate__animated animate__fadeInUpBig`}
                onClick={GoTop}
            >
                <i className='bx bx-chevron-up text-[36px]'></i>
            </div>
        )
    );
}

export default BackToTop