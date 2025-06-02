import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Radio, Checkbox, Button, message } from 'antd';
import toast from 'react-hot-toast';
import phoneValidate from '../../../../helpers/phone-validator';
import { saveAddress } from '../../../../services/auth';
import { getProvinces, getDistrict, getWard } from '../../../../services/common';
import './form.scss'

const { TextArea } = Input;

const initialState = {
  name: '',
  phone: '',
  email: '',
  type: 'home',
  address: '',
  remark: '',
  primary: false,
  province_id: null,
  district_id: null,
  ward_id: null,
};

const AddressForm = ({ address, user, close, refresh }) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getProvinces().then(setProvinces).catch(() => setProvinces([]));
  }, []);

  useEffect(() => {
    if (address) {
      form.setFieldsValue(address);
      if (address.province_id) getDistrict(address.province_id).then(setDistricts);
      if (address.district_id) getWard(address.district_id).then(setWards);
    }
  }, [address, form]);

  const handleProvinceChange = async (provinceId) => {
    form.setFieldsValue({ district_id: null, ward_id: null });
    setDistricts([]);
    setWards([]);
    const data = await getDistrict(provinceId);
    setDistricts(data);
  };

  const handleDistrictChange = async (districtId) => {
    form.setFieldsValue({ ward_id: null });
    const data = await getWard(districtId);
    setWards(data);
  };

  const onFinish = async (values) => {
    if (!phoneValidate(values.phone).validate()) {
      form.setFields([
        {
          name: 'phone',
          errors: ['Số điện thoại không hợp lệ'],
        },
      ]);
      return;
    }

    const province = provinces?.data?.find((p) => p.ProvinceID === values.province_id);
    const district = districts?.data?.find((d) => d.DistrictID === values.district_id);
    const ward = wards?.data?.find((w) => w.WardCode === values.ward_id);

    const body = {
      id: address?._id,
      name: values.name,
      phone: values.phone,
      email: values.email || '',
      type: values.type,
      address: values.address,
      remark: values.remark,
      primary: values.primary,
      user: user?.id,
      province_id: values.province_id,
      province_name: province?.ProvinceName || '',
      district_id: values.district_id,
      district_name: district?.DistrictName || '',
      ward_id: values.ward_id,
      ward_name: ward?.WardName || '',
    };

    try {
      setLoading(true);
      await saveAddress(body);
      toast.success('Lưu địa chỉ thành công!');
      if (refresh) refresh();
      if (close) close(false);
    } catch {
      toast.error('Lưu địa chỉ thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialState}
      onFinish={onFinish}
      className="p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Form.Item
          label="Họ và Tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input type="tel" />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input type="email" />
        </Form.Item>

        <Form.Item label="Loại địa chỉ" name="type">
          <Radio.Group>
            <Radio value="home">Nhà riêng</Radio>
            <Radio value="office">Văn phòng</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Tỉnh/Thành"
          name="province_id"
          rules={[{ required: true, message: 'Chọn Tỉnh/Thành' }]}
        >
          <Select placeholder="Chọn Tỉnh/Thành" onChange={handleProvinceChange}>
            {provinces?.data?.map((p) => (
              <Select.Option key={p.ProvinceID} value={p.ProvinceID}>
                {p.ProvinceName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Quận/Huyện"
          name="district_id"
          rules={[{ required: true, message: 'Chọn Quận/Huyện' }]}
        >
          <Select
            placeholder="Chọn Quận/Huyện"
            disabled={!form.getFieldValue('province_id')}
            onChange={handleDistrictChange}
          >
            {districts?.data?.map((d) => (
              <Select.Option key={d.DistrictID} value={d.DistrictID}>
                {d.DistrictName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Phường/Xã"
          name="ward_id"
          rules={[{ required: true, message: 'Chọn Phường/Xã' }]}
        >
          <Select
            placeholder="Chọn Phường/Xã"
            disabled={!form.getFieldValue('district_id')}
          >
            {wards?.data?.map((w) => (
              <Select.Option key={w.WardCode} value={w.WardCode}>
                {w.WardName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Địa chỉ cụ thể"
          name="address"
          rules={[{ required: true, message: 'Nhập địa chỉ cụ thể' }]}
        >
          <TextArea rows={2} placeholder="VD: Ngõ 193 Phạm Văn Đồng" />
        </Form.Item>

        <Form.Item label="Ghi chú" name="remark">
          <TextArea rows={2} placeholder="Ghi chú cho người giao hàng..." />
        </Form.Item>
      </div>

      <Form.Item name="primary" valuePropName="checked">
        <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
      </Form.Item>

      <Form.Item className="text-right">
        <Button type="primary" htmlType="submit" loading={loading}>
          {address ? 'Cập nhật' : 'Lưu lại'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddressForm;
