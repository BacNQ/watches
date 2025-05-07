'use client';
import React, { useState } from 'react';
import { Input } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import {
  getHistoryKeywords,
  setHistoryKeywords,
  deleteHistoryKeywords
} from '../../helpers/history';

const SearchInput = () => {
  const [keyword, setKeyword] = useState('');
  const [history, setHistory] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);

  const router = useRouter();

  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setHistoryKeywords(trimmed);
    setShowSuggest(false);
    router.push(`/product/search/${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFocus = () => {
    const data = getHistoryKeywords();
    setHistory(data);
    setShowSuggest(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggest(false), 200);
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Tìm kiếm sản phẩm tại đây"
        className="header-input"
        radius="full"
        variant="bordered"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <i
        className="fa-solid fa-magnifying-glass text-[20px] absolute left-[33px] top-[11px] cursor-pointer"
        onClick={handleSearch}
      />

      {showSuggest && history.length > 0 && (
        <div className="absolute top-full mt-1 left-4 w-[608px] bg-white border rounded-lg shadow z-50 max-h-[200px] overflow-auto">
          {history.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setKeyword(item);
                setShowSuggest(false);
                router.push(`/product/search/${encodeURIComponent(item)}`);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition duration-200 ease-in-out"
            >
              <i className="fa-solid fa-clock mr-2 text-gray-400" />
              {item}
            </div>
          ))}
          <div
            onClick={() => {
              deleteHistoryKeywords();
              setHistory([]);
            }}
            className="text-center text-sm text-red-500 py-2 border-t cursor-pointer hover:bg-red-50"
          >
            Xóa lịch sử
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
