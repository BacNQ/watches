import "cropperjs/dist/cropper.css";
import React, { useState } from "react";
import Cropper from "react-cropper";
import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";

export const CropperImage = (props) => {
  const { src, close, open, ratio, uploading, title, width, onCrop } = props
  const [cropper, setCropper] = useState();
  
  const cropImage = () => {
    if (typeof cropper !== "undefined") {
      const canvas = cropper.getCroppedCanvas();
      onCrop(canvas)
    }
  };

  return (
    <Modal
      size='sm'
      isOpen={open}
      isDismissable={false}
      scrollBehavior="outside"
      onOpenChange={() => close(false)}
    >
      <ModalContent>
      {() => (
          <>
              <ModalBody className='p-4'>
                <div className="w-100">
                  <Cropper
                    src={src}
                    style={{height: 200, width: '100%'}}
                    aspectRatio={ratio}
                    preview=".img-preview"
                    viewMode={1}
                    guides={true}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false}
                    onInitialized={(instance) => setCropper(instance)}
                    ready={() => cropper?.zoomTo?.(0)}
                  />
                  <br/>
                  <div className="flex justify-end gap-2">
                    <Button color='default' onPress={close} isDisabled={uploading}>
                        <span>Hủy bỏ</span>
                    </Button>
                    <Button color='primary' onPress={() => cropImage()} isLoading={uploading}>
                        <span>Tải lên</span>
                    </Button>
                  </div>
                </div>
              </ModalBody>
          </>
      )}
      </ModalContent>
    </Modal>
  );
};

export default CropperImage;
