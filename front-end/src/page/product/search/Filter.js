'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Segmented } from 'antd';

const SearchHeader = ({ params, changeSearch }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { label: "Liên quan nhất", value: "" },
    { label: "Bán chạy nhất", value: "ban-chay-nhat" },
    { label: "Xem nhiều nhất", value: "xem-nhieu-nhat" },
    { label: "Đánh giá nhiều", value: "danh-gia-nhieu" },
  ];

  const handleSortChange = (val) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('sort', val);
    router.push(`/product/search/${params.keyword}?${newParams.toString()}`);
  };

  return (
    <div className="mb-4">
      <Segmented
        options={sortOptions}
        value={params.sort || ""}
        onChange={handleSortChange}
      />
    </div>
  );
};

export default SearchHeader;
