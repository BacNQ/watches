// import './styles.scss';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import AddressForm from './AddressForm';
import { Popup, NavBar, Modal, Tag, ErrorBlock, Button } from 'antd-mobile';
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa'
import { useAddress } from '../../../../query/profile';

const ViewAddress = (props) => {
    const { open, close, address, onChange } = props;
    
    const [show, setShow] = useState(false)
    const [item, setItem] = useState(null)
    const { data: addresses, refetch } = useAddress();

    const removeAddress = (record) => {
      if(record && record._id) {
          Modal.confirm({
              className: "modal-confirm",
              title: 'Bạn có chắn muốn xóa địa chỉ này?',
              cancelText: 'Không',
              confirmText: 'Có',
              onConfirm: () => {
                  cancelBids({id: record._id})
                  .then(({code}) => {
                      if(code) {
                          refetch();
                          toast.success('Hủy thành công!')
                      } else {
                        toast.error('Hủy thất bại!')
                      }
                  })
                  .catch((error) => {
                    toast.error('Hủy thất bại!')
                  })
              }
          })
      }
    }

    const editAddress = (item) => {
      setItem(item)
      setShow(true)
    }

    return (
        <Popup
            position='bottom'
            visible={open}
            className='popup-full'
            onClose={() => close(false)}
        > 
          {show
          ?<NavBar onBack={() => setShow(false)} className="navbar-popup bold">{ item ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới" }</NavBar>
          :<NavBar onBack={() => close(false)} className="navbar-popup bold">Danh sách địa chỉ</NavBar>}
            <div className='popup-body modal-address'>
                <div className='pannel-address'>
                  <div className={show ? 'group-pannel display' : 'group-pannel'}>
                    {addresses && addresses.length > 0
                    ?
                      <div className="box-item">
                        <ul className='list-address' value={address?._id || address?.address_id || ''}>
                            {addresses.map((item, key) => {
                              let selected = (address?._id || address?.address_id) === item._id
                              return (<li className={`item-address ${selected ? 'seleted': ''}`} value={item._id} onClick={() => onChange(item, true)} key={key}>
                                        <div>
                                          <label className='add-name'><i className="fa fa-user-circle-o"/>&ensp;<span className="bold">{item.name}</span></label>
                                          <label className='add-contact'><i className="fa fa-phone-square"/>&ensp;<span>{item.phone}</span></label>
                                          <label className='add-contact'><i className="fa fa-map-marker"/>&ensp;{item.address}, {item.ward}, {item.district}, {item.province}</label>
                                          <div onClick={(e) => e.preventDefault()} className='address-action' >
                                            {item.type === 'home' ? <Tag color="#f50">Nhà riêng</Tag>: <Tag color="#108ee9">Văn phòng</Tag>}
                                            <span onClick={() => editAddress(item)} className='icon-action'><FaRegEdit/></span>
                                            <span onClick={() => removeAddress(item)} className='icon-action'><FaRegTrashAlt/></span>
                                          </div>
                                        </div>
                                      </li>)
                            })}
                        </ul>
                        <div className='mr-t-10 text-right'>
                          <span className='add-address' onClick={() => editAddress(null)}><i className="fa fa-plus" />&ensp;Thêm địa chỉ mới</span>
                        </div>
                      </div>
                      :
                      <ErrorBlock
                        status='empty'
                        style={{'--image-height': '100px'}}
                        title="Chưa có địa chỉ nhận hàng!"
                        description=""
                      >
                        <Button color='primary' onClick={() => editAddress(null)}>Thêm địa chỉ mới</Button>
                      </ErrorBlock>
                    }
                    <div className="box-item">
                      {show && <AddressForm refresh={refetch} address={item} close={setShow} />}
                    </div>
                  </div>
                </div>
            </div>
        </Popup>
    )
}

export default ViewAddress;
