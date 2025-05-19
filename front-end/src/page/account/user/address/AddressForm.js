
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import phoneValidate from '../../../../helpers/phone-validator';
import { Button } from '@nextui-org/react';
import { FieldRadio, FieldCheckbox, FieldSelect, FieldInput, FieldTextarea } from '../../../../components/fields';
import { useProvinces, useDistricts, useWards } from '../../../../query/common';
import { saveAddress } from '../../../../services/auth';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";

const locationMap = (options) => {
  if(options && options.length) {
    return [...options].map((option) => {
      return {
        value: option.id,
        search: option.name,
        label: option.name,
      }
    })
  } else {
    return [];
  }
}

const initialValues = {
  name: '',
  phone: '',
  email: '',
  province_id: null,
  district_id: null,
  ward_id: null,
  type: 'home',
  address: '',
  remark: '',
  primary: false,
}

const AddressForm = ({address, user, close, refresh}) => {
    const [error, setError] = useState()

    const { watch, control, handleSubmit } = useForm({ values: address?._id ? {...address }: initialValues });
    const province = watch('province_id')
    const district = watch('district_id')
    const { data: provinces } = useProvinces();
    const { data: districts } = useDistricts(province, {enabled: !!province});
    const { data: wards } = useWards(district, {enabled: !!district});

    const onSuccess = () => {
      if(refresh) refresh();
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
      if(values.name && values.phone && values.province_id && values.district_id && values.ward_id) {
        const province = provinces?.find((item) => item.id === Number(values.province_id));
        const district = districts?.find((item) => item.id === Number(values.district_id)); 
        const ward = wards?.find((item) => item.id === Number(values.ward_id));
        if(values.address && province && district && ward) {
          const body = {
            name: values.name,
            phone: values.phone,
            email: values.email || '',
            address: values.address,
            province_id: values.province_id,
            province: province.name,
            district_id: values.district_id,
            district: district.name,
            ward_id: values.ward_id,
            ward: ward.name,
            remark: values.remark || '',
            type: values.type || 'home',
            user: user?.id,
            primary: values.primary || false,
          }
          if(address) {
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
            <div className="box-form">
                  <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                    <div className="row">
                        <div className="col-md-12 info">
                            <div className="row mb-2">
                              <div className="col-md-12">
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
                                  classNames={{label: 'w-[80px]', mainWrapper: 'w-[calc(100%-80px)]'}}
                                  labelPlacement={'outside-left'}
                                />
                              </div>
                            </div>
                            <div className="row mb-2">
                              <div className="col-md-6">
                                <FieldInput
                                  control={control}
                                  name="phone"
                                  rules={{ required: {value: true, message: 'Trường không được để trống'},  validate: checkMobile }}
                                  type="phone"
                                  label="Số ĐT"
                                  fullWidth
                                  variant="bordered"
                                  classNames={{label: 'w-[80px]', mainWrapper: 'w-[calc(100%-80px)]'}}
                                  labelPlacement={'outside-left'}
                                />
                              </div>
                              <div className="col-md-6">
                                <FieldInput
                                  control={control}
                                  name="email"
                                  rules={{ pattern: {value: /^\S+@\S+$/i, message: 'Không phải địa chỉ email'} , maxLength: {value: 255, message: 'Độ dài email quá lớn'}  }}
                                  type="email"
                                  label="Email"
                                  fullWidth
                                  variant="bordered"
                                  classNames={{label: 'w-[80px]', mainWrapper: 'w-[calc(100%-80px)]'}}
                                  labelPlacement={'outside-left'}
                                />
                              </div>
                            </div>
                            <div className="row mb-2">
                              <div className="col-md-6">
                                <FieldSelect
                                  control={control}
                                  name="province_id"
                                  variant='bordered'
                                  labelPlacement={'outside'}
                                  label="Tỉnh thành"
                                  placeholder="Chọn tỉnh thành"
                                  rules={{required: {value: true, message: 'Trường không được để trống'}}}
                                  options={locationMap(provinces)}
                                />
                              </div>
                              <div className="col-md-6">
                                <FieldSelect
                                  control={control}
                                  name="district_id"
                                  variant='bordered'
                                  labelPlacement={'outside'}
                                  label="Quận huyện"
                                  placeholder="Chọn quận huyện"
                                  rules={{required: {value: true, message: 'Trường không được để trống'}}}
                                  options={locationMap(districts)}
                                />
                              </div>
                            </div>
                            <div className="row mb-2">
                              <div className="col-md-6">
                                <FieldSelect
                                  control={control}
                                  name="ward_id"
                                  variant='bordered'
                                  labelPlacement={'outside'}
                                  label="Xã phường"
                                  placeholder="Chọn xã phường"
                                  rules={{required: {value: true, message: 'Trường không được để trống'}}}
                                  options={locationMap(wards)}
                                />
                              </div>
                              <div className="col-md-6">
                                <FieldRadio
                                  control={control}
                                  rules={{ required: true }}
                                  label="Loại địa chỉ"
                                  name="type"
                                  options={[
                                    {value: 'home', label: 'Nhà riêng'},
                                    {value: 'office', label: 'Văn phòng'},
                                  ]}
                                />
                              </div>
                            </div>
                            <div className="row mb-2">
                              <div className="col-md-12">
                                <FieldTextarea
                                    control={control}
                                    name="address"
                                    minRows={2}
                                    maxLength={255}
                                    variant="bordered"
                                    label="Địa chỉ"
                                    labelPlacement="outside"
                                    rules={{
                                      required: {value: true, message: 'Trường không được để trống'},
                                      maxLength: {value: 255, message: 'Vượt quá ký tự cho phép'}
                                    }}
                                    placeholder="VD. Ngõ 193 đường Phạm Văn Đồng"
                                    className="w-full"
                                />
                              </div>
                              <div className="col-md-12">
                                <FieldTextarea
                                    control={control}
                                    name="remark"
                                    minRows={1}
                                    maxLength={255}
                                    variant="bordered"
                                    label="Ghi chú"
                                    labelPlacement="outside"
                                    rules={{
                                      maxLength: {value: 255, message: 'Vượt quá ký tự cho phép'}
                                    }}
                                    placeholder="Ghi chú"
                                    className="w-full"
                                />
                              </div>
                              <div className="col-md-12 check-primary">
                                <FieldCheckbox
                                  control={control}
                                  name="primary"
                                  text="Đặt làm địa chỉ mặc định"
                                />
                              </div>
                            </div>
                        </div>
                    </div>
                    <div className="row record-info">
                        <div className="col-md-12 text-center">
                            <Button color="primary" type='submit' loading={isPending} block>{address ? 'Cập nhật' : 'Lưu lại'}</Button>
                            <p className="text-danger">{error}</p>
                        </div>
                    </div>
                    <br/>
                </form>
            </div>
          )
}

const checkMobile = (value) => {
  if (value) {
    if(value && phoneValidate(value).validate()) return true;
    return 'Không phải điện thoại'
  }
  return 'Trường không được để trống'
}

export default AddressForm;
