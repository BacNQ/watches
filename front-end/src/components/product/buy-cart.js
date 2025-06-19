'use client'
import toast from "react-hot-toast";
import { useMutation } from '@tanstack/react-query';
import { Button } from "@nextui-org/react";
import { useCarts } from '../../query/product';
import { postAddCart } from '../../services/common';
import { useUser } from '../../provider/UserProvider';
import { useRouter } from 'next/navigation';

const AddCart = ({ product, quantity }) => {
  const { user } = useUser();
  const { refetch } = useCarts();
  const router = useRouter();

  const onSuccess = () => {
    refetch();
    toast.success('Đang chuyển hướng...');
    router.push(`/account/cart?selected=${product.slug}`);
  }

  const onError = () => {
    toast.error('Có lỗi đã xảy ra!');
  }
  const { mutate, isLoading } = useMutation({
    mutationFn: (body) => postAddCart(body),
    onSuccess: onSuccess,
    onError: onError,
  })

  const onAddCart = () => {
    if (user) {
      const body = {
        name: product.name,
        price: product.price_current,
        slug: product.slug,
        url: `http://localhost:3000/product/detail/${product.slug}`,
        description: product.description,
        qty: quantity || 1,
        sold_out: product.stock_status,
        stock: product.stock || null,
        images: product?.thumbnails?.length > 0 ? product.thumbnails : (product.image ? [product.image] : product?.images?.length > 0 ? product.images : null),
      }
      localStorage.setItem("isNewProduct", product.slug);
      mutate(body)
    } else {
      window.location.href = "/auth/login";
    }
  }

  return (
    <Button
    size='lg'
    color={'primary'}
    className="w-1/2 bg-[#070e35] font-semibold rounded-md text-white"
    onPress={() => onAddCart()}
    fullWidth
  >
    <span className='bold'>Mua hàng ngay</span>
  </Button>
  )
};

export default AddCart
