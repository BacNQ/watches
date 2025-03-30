'use client'
import { Suspense } from 'react';
import ContactCenter from './contactcenter';

const ChatProvider = () => {
    return (
        <div className='chat-widget'>
            <Suspense>
                <ContactCenter />
            </Suspense>
        </div>
    )
}

export default ChatProvider;