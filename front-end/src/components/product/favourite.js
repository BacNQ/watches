// 'use client'
// import toast from "react-hot-toast";
// import { useEffect, useState } from 'react';
// import { usePathname } from 'next/navigation';
// import { useMutation } from '@tanstack/react-query';
// import { useFavProducts } from '../../query/product';
// import { useUser } from '../../lib/auth-service';
// import { postAddFavorite } from '../../services/favourite';

// const AddFavorite = ({ site, product, router }) => {
//   const pathname = usePathname()
//   const [posting, setPosting] = useState(null)
//   const { user } = useUser();
//   const { data, refetch } = useFavProducts();

//   const onSuccess = (res) => {
//     toast.success(res?.message ? res.message : 'Đã thêm vào danh sách yêu thích!');
//     refetch();
//   }

//   const onError = (error) => {
//     toast.error(error?.message || 'Thêm vào danh sách yêu thích thất bại!');
    
//   }
//   const { mutate, isPending } = useMutation({
//     mutationFn: (body) => postAddFavorite(body),
//     onSuccess: onSuccess,
//     onError: onError
//   })

//   useEffect(() => {
//     setPosting(isPending ? product.code : null)
//   }, [isPending])

//   let favorite = data?.find(i =>i.code === product.code);

//   const onFavorite = () => {
//     // if(user) {
//       const body = {
//         code: product.code,
//         name: product.name,
//         url: product.url,
//         description: product.description,
//         price: product.price,
//         images:  product?.thumbnails?.length > 0 ? product.thumbnails : ( product.image ? [product.image]: null),
//       }
//       mutate(body)
//     // } else {
//     //   window.location.href = "/account/login?next="+pathname;
//     // }
//   }

//   return (
//     <button onClick={() => onFavorite()} className={`btn btn-sm btn-circle ${ favorite ? "btn-heart active" : "btn-heart "}`}>
//       {product.code === posting ? <span className="loading loading-spinner"/> : <i className="fa-solid fa-heart"></i>}
//     </button>
// )
// };

// export default AddFavorite
