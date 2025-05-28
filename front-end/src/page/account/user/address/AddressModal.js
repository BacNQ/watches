import React from 'react';
import { Modal } from 'antd';
import AddressForm from './AddressForm';

const AddressModal = (props) => {
  const { close, open, address } = props;

  return (
    <Modal
      title={address ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
      open={open}
      onCancel={() => close(false)}
      onOk={() => close(false)}
      footer={null}
      width={800}
    >
      {open && <AddressForm {...props} />}
    </Modal>
  );
};

export default AddressModal;
