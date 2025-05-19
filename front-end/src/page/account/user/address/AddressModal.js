
import React from 'react';
import AddressForm from './AddressForm';
import {Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";

const AddressModal = (props) => {
    const { close, open, address } = props;
    return (
        <Modal isOpen={open} onOpenChange={() => close(false)} size='2xl'>
            <ModalContent>
            {() => (
                <>
                    <ModalHeader className="flex flex-col gap-1"><span className='bold'>{ address ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</span></ModalHeader>
                    <ModalBody>
                        <div className='popup-body'>
                            { open && <AddressForm {...props} />}
                        </div>
                    </ModalBody>
                </>
            )}
            </ModalContent>
        </Modal>
    )
}
  
export default AddressModal;
