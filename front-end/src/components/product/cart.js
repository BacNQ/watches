'use client'
import toast from "react-hot-toast";
import { useMutation } from '@tanstack/react-query';
import { Button } from "@nextui-org/react";
import { useCarts } from '../../query/product';
import { postAddCart } from '../../services/common';
import { useUser } from '../../provider/UserProvider';

const AddCart = ({ product, isIcon  }) => {
  const { user } = useUser();
  const { refetch } = useCarts();

  const onSuccess = () => {
    refetch();
    toast.success('Đã thêm vào giỏ hàng!');
  }

  const onError = () => {
    toast.error('Thêm giỏ hàng thất bại!');
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
        description: product.description || null,
        qty: 1,
        sold_out: product.stock_status || null,
        images: product?.thumbnails?.length > 0 ? product.thumbnails : (product.image ? [product.image] : product?.images?.length > 0 ? product.images : null),
      }
      mutate(body)
    } else {
      window.location.href = "/auth/login";
    }
  }

  return (
    <Button
      isIconOnly={isIcon}
      size={isIcon ? 'sm' : 'lg'}
      color="primary"
      className={`rounded-md ${isIcon ? 'bg-transparent hover:text-[#fa2323]' : 'w-1/2 bg-[#070e35] text-white font-semibold'}`}
      onPress={onAddCart}
      isLoading={isLoading}
    >
      {isIcon ? (
        <i className="fa-solid fa-cart-shopping text-[14px]" />
      ) : (
        <span className="bold">Thêm vào giỏ hàng</span>
      )}
    </Button>
  )
};

export default AddCart
