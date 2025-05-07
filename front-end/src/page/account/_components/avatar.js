
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CropperImage from './CropperImage';
import { Avatar } from '@nextui-org/react';
import { uploadImage } from '../../../services/media';

const AvatarV = ({ user, refetch }) => {
  const [file, setFile] = useState()
  const [uploading, setUploading] = useState()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState(null)

  const uploadAvatar = (bold) => {
    if (file && (file.type.includes("image/jpg") || file.type.includes("image/jpeg") || file.type.includes("image/png"))) {
      const config = {
        'Content-Type': 'multipart/form-data',
        onUploadProgress: function (progress) {
          var percent = Math.round((progress.loaded * 100) / progress.total)
        }
      }

      const foromData = new FormData()
      foromData.append('file', bold, file.name || 'avatar.jpg')
      foromData.append('type', 'avatar')
      setUploading(true)
      uploadImage(foromData, config)
        .then(() => {
          refetch();
          setData(null);
          setOpen(false);
          setUploading(false)
          toast.success("Tải ảnh lên thành công!")
        })
        .catch((error) => {
          setUploading(false)
          console.error('Error:', error)
        })
    } else {
      toast.error("Ảnh sai định dạng")
    }
  }

  const onChangeFile = (e) => {
    e.preventDefault()
    let files
    if (e.dataTransfer) {
      files = e.dataTransfer.files
    } else if (e.target) {
      files = e.target.files
    }
    if (files && files[0]) {
      let file = files[0]
      if (file.size > 5242880) {
        toast.error("Kích ảnh phải nhỏ 5MB")
      } else {
        setFile(file)
        const reader = new FileReader();
        reader.onload = () => setData(reader.result)
        reader.readAsDataURL(file)
      }
    }
    e.target.value = "";
  }

  const onCropImage = (canvas) => {
    canvas.toBlob(function (bold) {
      uploadAvatar(bold);
    })
  }

  useEffect(() => {
    if (data) setOpen(true);
  }, [data])

  return (
    <figure className='avatar'>
      <Avatar src={user?.avatar || undefined} className='w-[104px] h-[104px]' showFallback />
      <input type="file" id="img" className="file-upload" name="img" accept="image/*" onChange={onChangeFile} />
      <CropperImage ratio={1} open={open} close={() => setOpen(false)} src={data} uploading={uploading} onCrop={onCropImage} />
    </figure>
  )
}

export default AvatarV;

