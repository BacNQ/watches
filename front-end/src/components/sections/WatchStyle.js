import React from 'react'

const WatchStyle = () => {
  return (
    <section className="group-styles">
      <div className="header-styles">
        <h1>CHỌN ĐỒNG HỒ PHÙ HỢP</h1>
        <p>B&Q Watches cung cấp đa dạng mẫu đồng hồ theo nhiều phong cách khác nhau</p>
      </div>
      <div className="content-styles">
        <div className="grid grid-cols-4 gap-4 pt-4 px-16">
          <div className="overflow-hidden text-center">
            <img src="/static/category_home/xu-huong-2025.webp" alt="Xu Hướng 2025" className="w-full h-36 object-cover rounded-lg" />
            <div className="py-2 text-sm font-medium">Xu Hướng 2025</div>
          </div>

          <div className="overflow-hidden text-center">
            <img src="/static/category_home/baby-g.webp" alt="Baby-G cá tính" className="w-full h-36 object-cover rounded-lg" />
            <div className="py-2 text-sm font-medium">Baby-G cá tính</div>
          </div>

          <div className="overflow-hidden text-center">
            <img src="/static/category_home/g-shock.webp" alt="G-Shock thể thao" className="w-full h-36 object-cover rounded-lg" />
            <div className="py-2 text-sm font-medium">G-Shock thể thao</div>
          </div>

          <div className="overflow-hidden text-center">
            <img src="/static/category_home/quan-doi.webp" alt="Quân đội mạnh mẽ" className="w-full h-36 object-cover rounded-lg" />
            <div className="py-2 text-sm font-medium">Quân đội mạnh mẽ</div>
          </div>

          <div className="overflow-hidden text-center">
            <img src="/static/category_home/tissot.webp" alt="Tissot sang trọng" className="w-full h-36 object-cover rounded-lg" />
            <div className="py-2 text-sm font-medium">Tissot sang trọng</div>
          </div>

          <div className="overflow-hidden text-center">
            <img src="/static/category_home/casio-ltp.webp" alt="Casio LTP nữ tính" className="w-full h-36 object-cover rounded-lg" />
            <div className="py-2 text-sm font-medium">Casio LTP nữ tính</div>
          </div>

          <div className="overflow-hidden text-center">
            <img src="/static/category_home/casio-mtp.webp" alt="Casio MTP thanh lịch" className="w-full h-36 object-cover rounded-lg" />
            <div className="py-2 text-sm font-medium">Casio MTP thanh lịch</div>
          </div>

          <div className="overflow-hidden text-center">
            <img src="/static/category_home/giong-rolex.webp" alt="Giống Rolex" className="w-full h-36 object-cover rounded-lg" />
            <div className="py-2 text-sm font-medium">Giống Rolex</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WatchStyle