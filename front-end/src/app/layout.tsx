import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import "antd/dist/reset.css";
import HeaderTop from '../components/headers/HeaderTop';
import BackToTop from '../components/commons/BackToTop';
import ChatsProvider from '../chat/provider'
import FooterMain from '../components/footers/index'
import { QueryProvider } from '../provider/QueryProvider';
import { UserProvider } from '../provider/UserProvider';
// import { NextProvider } from '../provider/NextProvider';
import { Toaster as ToastProvider } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Đồng Hồ Chính Hãng, Thời Trang & Đẳng Cấp",
  description: "B&Q Watches – Khẳng Định Phong Cách, Giữ Trọn Thời Gian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"></link>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet"></link>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/line-awesome/1.3.0/line-awesome/css/line-awesome.min.css"></link>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
        <link href="https://cdn.jsdelivr.net/npm/pace-js@latest/themes/blue/pace-theme-minimal.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.paceOptions = {
                  ajax: true,
                  document: false,
                  eventLag: true,
                  restartOnPushState: true,
                };
              `,
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <UserProvider>
            <main className='light'>
              <HeaderTop />
              <div id="root">
                {children}
              </div>
              <BackToTop />
              <ChatsProvider />
              <ToastProvider />
              <FooterMain />
            </main>
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
