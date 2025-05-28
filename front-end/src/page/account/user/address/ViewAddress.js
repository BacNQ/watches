// // import './styles.scss';
// import React, { useState } from 'react';
// import toast from 'react-hot-toast';
// import AddressForm from './AddressForm';
// import EmptyV from '../../../../components/commons/empty/index';
// import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa'
// import { useAddress } from '../../../../query/profile';
// import { useDialog } from "@/provider/ConfirmProvider";
// import { Button, Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";

// const ViewAddress = (props) => {
//   const { open, close, address, onChange } = props;
//   const { confirm } = useDialog();
//   const [show, setShow] = useState(false)
//   const [item, setItem] = useState(null)
//   const { data: addresses, refetch } = useAddress();

//   const removeAddress = (record) => {
//     if (record && record._id) {
//       confirm({
//         className: "modal-confirm",
//         title: 'Bạn có chắn muốn xóa địa chỉ này?',
//         cancelText: 'Không',
//         confirmText: 'Có',
//         onConfirm: () => {
//           cancelBids({ id: record._id })
//             .then(({ code }) => {
//               if (code) {
//                 refetch();
//                 toast.success('Hủy thành công!')
//               } else {
//                 toast.error('Hủy thất bại!')
//               }
//             })
//             .catch((error) => {
//               toast.error('Hủy thất bại!')
//             })
//         }
//       })
//     }
//   }

//   const editAddress = (item) => {
//     setItem(item)
//     setShow(true)
//   }

//   return (
//     <Modal
//       size={'xl'}
//       isOpen={open}
//       onOpenChange={() => close(false)}
//     >
//       <ModalContent className='modal-address'>
//         {() => (
//           <>
//             <ModalHeader className="flex flex-col gap-1 pb-0">
//               {show
//                 ? <div className='modal-back'>
//                   <span className='icon-back' onClick={() => setShow(false)}><i className="fa fa-chevron-left" /></span>
//                   <span className='bold'>{item ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</span>
//                 </div>
//                 : <span className='bold'>Danh sách địa chỉ</span>
//               }
//             </ModalHeader>
//             <ModalBody>
//               <div className='popup-body'>
//                 <div className='pannel-address'>
//                   <div className={show ? 'group-pannel display' : 'group-pannel'}>
//                     {addresses && addresses.length > 0
//                       ?
//                       <div className="box-item">
//                         <ul className='list-address' value={address?._id || address?.address_id || ''}>
//                           {addresses.map((item, key) => {
//                             let selected = (address?._id || address?.address_id) === item._id
//                             return (<li className={`item-address ${selected ? 'seleted' : ''}`} value={item._id} onClick={() => onChange(item, false)} key={key}>
//                               <div>
//                                 <label className='add-name bold'>{item.name}</label>
//                                 <label>
//                                   {item.phone}
//                                 </label>
//                                 <label className='add-contact'>
//                                   {item.address}, {item.ward}, {item.district}, {item.province}
//                                 </label>
//                                 <div onClick={(e) => e.preventDefault()} className='address-action' >
//                                   {item.type === 'home' ? <span className="tag">Nhà riêng</span> : <span className="tag">Văn phòng</span>}
//                                   <span onClick={() => editAddress(item)} className='icon-action'><FaRegEdit /></span>
//                                   <span onClick={() => removeAddress(item)} className='icon-action'><FaRegTrashAlt /></span>
//                                 </div>
//                               </div>
//                             </li>)
//                           })}
//                         </ul>
//                         <div className='mr-t-10 text-right'>
//                           <span className='add-address' onClick={() => editAddress(null)}><i className="fa fa-plus" />&ensp;Thêm địa chỉ mới</span>
//                         </div>
//                       </div>
//                       :
//                       <EmptyV
//                         status='empty'
//                         title="Chưa có địa chỉ nhận hàng!"
//                       >
//                         <Button color='primary' onClick={() => editAddress(null)}>Thêm địa chỉ mới</Button>
//                       </EmptyV>
//                     }
//                     <div className="box-item">
//                       {show && <AddressForm refresh={refetch} address={item} close={setShow} />}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </ModalBody>
//           </>
//         )}
//       </ModalContent>
//     </Modal>
//   )
// }

// export default ViewAddress;
