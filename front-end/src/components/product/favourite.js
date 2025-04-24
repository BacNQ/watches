'use client'
import toast from "react-hot-toast";
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useFavProducts } from '../../query/product';
import { postAddFavorite } from '../../services/common';
import { getInfoUser } from '../../services/auth';

const AddFavorite = ({ product }) => {
  const [posting, setPosting] = useState(null)
  const { data, refetch } = useFavProducts();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    getInfoUser(token)
      .then(data => {
        setUser(data?.data);
      })
      .catch(err => {
        console.error('Không thể lấy thông tin user:', err.message);
      });
  }, []);
  const onSuccess = (res) => {
    toast.success(res?.data?.message ? res?.data?.message : 'Đã thêm vào danh sách yêu thích!');
    refetch();
  }

  const onError = (error) => {
    toast.error(error?.message || 'Thêm vào danh sách yêu thích thất bại!');

  }
  const { mutate, isPending } = useMutation({
    mutationFn: (body) => postAddFavorite(body),
    onSuccess: onSuccess,
    onError: onError
  })

  useEffect(() => {
    setPosting(isPending ? product.slug : null)
  }, [isPending])

  let favorite = data?.res?.find(i => i.slug === product.slug);

  const onFavorite = () => {
    if (user) {
      const body = {
        slug: product.slug,
        url: `http://localhost:3000/product/detail/${product.slug}`,
        name: product.name,
        description: product.description,
        price: product.price_current,
        images: product?.thumbnails?.length > 0 ? product.thumbnails : (product.image ? [product.image] : null),
      }
      mutate(body)
    } else {
      window.location.href = "/auth/login";
    }
  }

  return (
    <button onClick={() => onFavorite()} className={`btn btn-sm btn-circle ${favorite ? "btn-heart active" : "btn-heart "}`}>
      {product.slug === posting ? <span className="loading loading-spinner" /> : <i className="fa-solid fa-heart"></i>}
    </button>
  )
};

export default AddFavorite
