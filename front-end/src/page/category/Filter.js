'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Segmented } from 'antd';

const SearchHeader = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { label: "Nổi bật", value: "" },
    { label: "Sale lớn", value: "khuyen-mai" },
    { label: "Giá giảm dần", value: "gia-cao-nhat" },
    { label: "Giá tăng dần", value: "gia-thap-nhat" },
  ];

  const priceOptions = [
    { label: "Từ 1 - 3 triệu", value: "tu-1-3-trieu" },
    { label: "Từ 3 - 6 triệu", value: "tu-3-6-trieu" },
    { label: "Từ 6 - 9 triệu", value: "tu-6-9-trieu" },
    { label: "Trên 9 triệu", value: "tren-9-trieu" },
  ];

  const handlePriceChange = (val) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('filter', val);
    router.push(`/category/${params.category_id}?${newParams.toString()}`);
  };

  const handleSortChange = (val) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('sort', val);
    router.push(`/category/${params.category_id}?${newParams.toString()}`);
  };

  return (
      <div>
          <div className="mb-4">
            <span style={{marginRight: 8}}>Phổ biến: </span>
              <Segmented
                  options={priceOptions}
                  value={params.filter || ""}
                  onChange={handlePriceChange}
              />
          </div>

          <div className="mb-4">
              <Segmented
                  options={sortOptions}
                  value={params.sort || ""}
                  onChange={handleSortChange}
              />
          </div>

      </div>
  );
};

export default SearchHeader;
