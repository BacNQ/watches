// 'use client'
// import './style.scss';
// import React, { useState } from 'react';
// import dynamic from 'next/dynamic';
// import toast from 'react-hot-toast';
// import { useDialog } from "../../../provider/ConfirmProvider";
// import { useCarts } from '../../../query/product';
// import { getInfoUser } from '../../../services/auth'
// import { removeAllCarts, removeCarts } from '../../../services/common';
// // import { usePrices } from '../../../query/profile';
// // import { useUser } from '../../../provider/UserProvider';
// // import { useExchanges, useExtras } from '../../../query/common';

// const PendingV = dynamic(() => import('./pending'))
// // const PaymentV = dynamic(() => import('./payment'))

// const CartV = (props) => {
//     // const { user } = useUser();
//     const { confirm } = useDialog();
//     // const { data: exchanges } = useExchanges();
//     // const { data: prices } = usePrices();
//     // const { data: extras } = useExtras({ route: 'JP', mode: 'D' });
//     const { data: cartData, isLoading: loading, refetch } = useCarts();
//     const [carts, setCarts] = useState([]);
//     const [unavailableCarts, setUnavailableCarts] = useState([]);
//     const [user, setUser] = useState(null);
//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (!token) return;

//         getInfoUser(token)
//             .then(res => {
//                 setUser(res?.data);
//             })
//             .catch(err => {
//                 console.error('Không thể lấy thông tin user:', err.message);
//             });
//     }, []);
//     // const [payments, setPayments] = useState([]);

//     React.useEffect(() => {
//         if (cartData) {
//             setCarts(cartData.availables);
//             setUnavailableCarts(cartData.unavailables);
//         }
//     }, [cartData])

//     const loadSuccess = () => {
//         refetch();
//         setPayments([])
//     }

//     const removeCart = (ids) => {
//         if (ids && ids.length) {
//             confirm({
//                 title: 'Bạn có chắc chắn muốn xoá sản phẩm này?',
//                 cancelText: 'Quay lại',
//                 okText: 'Xác nhận',
//                 onOk: () => {
//                     removeCarts({ ids: ids })
//                         .then(({ code }) => {
//                             if (code) {
//                                 refetch();
//                                 toast.success('Xóa giỏ hàng thành công!')
//                             } else {
//                                 toast.error('Xóa giỏ hàng thất bại!')
//                             }
//                         })
//                         .catch((error) => {
//                             toast.error('Xóa giỏ hàng thất bại!')
//                         })
//                 }
//             })
//         }
//     }

//     const removeAllAvailableCart = () => {
//         confirm({
//             title: 'Bạn chắc chắn muốn bỏ tất cả sản phẩm này?',
//             cancelText: 'Quay lại',
//             okText: 'Xác nhận',
//             onOk: () => {
//                 removeAllCarts({ unavailable: false })
//                     .then(({ code }) => {
//                         if (code) {
//                             refetch();
//                             toast.success('Xóa thành công!')
//                         } else {
//                             toast.error('Xóa thất bại!')
//                         }
//                     })
//                     .catch((error) => {
//                         toast.error('Xóa thất bại!')
//                     })
//             }
//         })
//     }

//     const removeAllUnavailableCart = () => {
//         confirm({
//             title: 'Bạn chắc chắn muốn bỏ tất cả sản phẩm không hoạt động này?',
//             cancelText: 'Không',
//             okText: 'Có',
//             onOk: () => {
//                 removeAllCarts({ unavailable: true })
//                     .then(({ code }) => {
//                         if (code) {
//                             refetch();
//                             toast.success('Xóa thành công!')
//                         } else {
//                             toast.error('Xóa thất bại!')
//                         }
//                     })
//                     .catch((error) => {
//                         toast.error('Xóa thất bại!')
//                     })
//             }
//         })
//     }

//     const pageProps = {
//         ...props,
//         carts,
//         unavailableCarts,
//         loading,
//         user,
//         // prices,
//         refetch,
//         // setPayments,
//         removeCart,
//         removeAllAvailableCart,
//         removeAllUnavailableCart
//     }

//     // let payment = payments.length > 0;

//     return (
//         <div className='page-carts'>
//             <div className="">
//                 {payment
//                     ? <PaymentV {...pageProps} payments={payments} extras={extras} loadSuccess={loadSuccess} onBack={() => setPayments([])} />
//                     : <PendingV {...pageProps} />
//                 }
//             </div>
//         </div>
//     );
// }

// export default CartV

