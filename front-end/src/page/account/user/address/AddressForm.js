
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import phoneValidate from '../../../../helpers/phone-validator';
import { Button } from '@nextui-org/react';
import { FieldRadio, FieldCheckbox, FieldSelect, FieldInput, FieldTextarea } from '../../../../components/fields';
import { saveAddress } from '../../../../services/auth';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import './form.scss';

const initialValues = {
  name: '',
  phone: '',
  email: '',
  type: 'home',
  address: '',
  remark: '',
  primary: false,
}

const AddressForm = ({ address, user, close, refresh }) => {
  const [error, setError] = useState()

  const { watch, control, handleSubmit } = useForm({ values: address?._id ? { ...address } : initialValues });

  const onSuccess = () => {
    if (refresh) refresh();
    toast.success('Lưu địa chỉ thành công!')
    close(false)
  }

  const onError = (error) => {
    toast.error('Lưu địa chỉ thất bại!')
  }

  const { mutate, isPending } = useMutation({
    onError: onError,
    onSuccess: onSuccess,
    mutationFn: (body) => saveAddress(body)
  })

  const onSubmit = (values) => {
    if (values.name && values.phone) {
      if (values.address) {
        const body = {
          name: values.name,
          phone: values.phone,
          email: values.email || '',
          address: values.address,
          remark: values.remark || '',
          type: values.type || 'home',
          user: user?.id,
          primary: values.primary || false,
        }
        if (address) {
          body.id = address._id;
        }

        mutate(body)
      } else {
        setError('Thiếu thông tin địa chỉ')
      }
    } else {
      setError('Thiếu thông tin địa chỉ')
    }

  }

  return (
    <div className="address-form">
      <form onSubmit={handleSubmit((data) => onSubmit(data))} className="address-form__form">
        <div className="address-form__grid">

          {/* Row: Họ và tên */}
          <div className="address-form__row">
            <div className="address-form__col">
              <FieldInput
                control={control}
                name="name"
                rules={{
                  required: { value: true, message: 'Trường không được để trống' },
                  maxLength: { value: 255, message: 'Vượt quá ký tự cho phép' }
                }}
                type="text"
                label="Họ và Tên"
                fullWidth
                variant="bordered"
                classNames={{ label: 'w-[80px]', mainWrapper: 'w-[calc(100%-80px)]' }}
                labelPlacement="outside-left"
              />
            </div>
          </div>

          {/* Row: Số điện thoại & Email */}
          <div className="address-form__row">
            <div className="address-form__col">
              <FieldInput
                control={control}
                name="phone"
                rules={{
                  required: { value: true, message: 'Trường không được để trống' },
                  validate: checkMobile
                }}
                type="phone"
                label="Số ĐT"
                fullWidth
                variant="bordered"
                classNames={{ label: 'w-[80px]', mainWrapper: 'w-[calc(100%-80px)]' }}
                labelPlacement="outside-left"
              />
            </div>
            <div className="address-form__col">
              <FieldInput
                control={control}
                name="email"
                rules={{
                  pattern: { value: /^\S+@\S+$/i, message: 'Không phải địa chỉ email' },
                  maxLength: { value: 255, message: 'Độ dài email quá lớn' }
                }}
                type="email"
                label="Email"
                fullWidth
                variant="bordered"
                classNames={{ label: 'w-[80px]', mainWrapper: 'w-[calc(100%-80px)]' }}
                labelPlacement="outside-left"
              />
            </div>
          </div>

          <div className="address-form__row">
            <div className="address-form__col">
              <FieldRadio
                control={control}
                rules={{ required: true }}
                label="Loại địa chỉ"
                name="type"
                options={[
                  { value: 'home', label: 'Nhà riêng' },
                  { value: 'office', label: 'Văn phòng' }
                ]}
              />
            </div>
          </div>

          <div className="address-form__row">
            <div className="address-form__col">
              <FieldTextarea
                control={control}
                name="address"
                minRows={2}
                maxLength={255}
                variant="bordered"
                label="Địa chỉ"
                labelPlacement="outside"
                rules={{
                  required: { value: true, message: 'Trường không được để trống' },
                  maxLength: { value: 255, message: 'Vượt quá ký tự cho phép' }
                }}
                placeholder="VD. Ngõ 193 đường Phạm Văn Đồng"
                className="w-full"
              />
            </div>

            <div className="address-form__col">
              <FieldTextarea
                control={control}
                name="remark"
                minRows={2}
                maxLength={255}
                variant="bordered"
                label="Ghi chú"
                labelPlacement="outside"
                rules={{ maxLength: { value: 255, message: 'Vượt quá ký tự cho phép' } }}
                placeholder="Ghi chú"
                className="w-full"
              />
            </div>
          </div>

          <div className="address-form__row">
            <div className="address-form__col">
              <FieldCheckbox
                control={control}
                name="primary"
                text="Đặt làm địa chỉ mặc định"
              />
            </div>
          </div>
        </div>

        <div className="address-form__footer">
          <Button color="primary" type="submit" loading={isPending} block>
            {address ? 'Cập nhật' : 'Lưu lại'}
          </Button>
          {error && <p className="address-form__error">{error}</p>}
        </div>
      </form>
    </div>
  );
}

const checkMobile = (value) => {
  if (value) {
    if (value && phoneValidate(value).validate()) return true;
    return 'Không phải điện thoại'
  }
  return 'Trường không được để trống'
}

export default AddressForm;
