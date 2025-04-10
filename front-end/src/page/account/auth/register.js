'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import phoneValidate from '../../../helpers/phone-validator';
import { FieldInput, FieldPassword } from '../../../components/fields/index';
import { register } from '../../../services/auth'
import { useForm } from 'react-hook-form';
import { Button } from '@nextui-org/react';
import { Checkbox } from 'antd'
import './auth.scss'

const RegisterV = () => {
    const { control, handleSubmit } = useForm({ defaultValues: { short_name: '', phone: '', email: '', password: '', confirmPassword: '' } });
    const [checked, setChecked] = useState(false);

    const registerLocal = (values) => {
        register(values)
            .then((res) => {
                const { token, user } = res.data;

                localStorage.setItem('token', token);
                toast.success('Đăng ký thành công');
                window.location.href = '/';
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || 'Đăng ký thất bại');
            });
    };

    return (
        <div className='container'>
            <div className='auth-body'>
                <div className='form-register'>
                    <div className='group-auth'>
                        <div className='box-register'>
                            <h3 className="label-auth text-center bold">ĐĂNG KÝ TÀI KHOẢN</h3>
                            <p className="text-center label-redirect">Bạn đã có tài khoản? <Link href="/auth/login" className='link-auth'>Đăng nhập</Link></p>
                            <br />
                            <form onSubmit={handleSubmit((data) => registerLocal(data))}>
                                <div className='input-form py-2'>
                                    <FieldInput
                                        fullWidth
                                        control={control}
                                        name="short_name"
                                        rules={{
                                            required: { value: true, message: 'Trường không được để trống' },
                                            minLength: { value: 4, message: 'Vui lòng nhập đủ họ và tên' },
                                            maxLength: { value: 255, message: 'Vượt quá ký tự cho phép' }
                                        }}
                                        type="text"
                                        label={<span>Họ tên: <span className="text-required">*</span></span>}
                                        variant="bordered"
                                        placeholder='Họ và tên của bạn'
                                        classNames={{ label: 'w-[80px]', mainWrapper: 'w-[calc(100%-80px)]' }}
                                        labelPlacement={'outside-left'}
                                    />
                                </div>
                                <div className='input-form py-2'>
                                    <FieldInput
                                        fullWidth
                                        control={control}
                                        name="phone"
                                        rules={{
                                            required: { value: true, message: 'Trường không được để trống' },
                                            validate: checkMobile
                                        }}
                                        type="phone"
                                        label={<span>Số ĐT: <span className="text-required">*</span></span>}
                                        variant="bordered"
                                        placeholder='Số điện thoại'
                                        classNames={{ label: 'w-[80px]', mainWrapper: 'w-[calc(100%-80px)]' }}
                                        labelPlacement={'outside-left'}
                                    />
                                </div>
                                <div className='input-form py-2'>
                                    <FieldInput
                                        fullWidth
                                        control={control}
                                        name="email"
                                        rules={{
                                            required: { value: true, message: 'Trường không được để trống' },
                                            pattern: { value: /^\S+@\S+$/i, message: 'Không phải địa chỉ email' },
                                            maxLength: { value: 255, message: 'Độ dài email quá lớn' }
                                        }}
                                        type="email"
                                        label={<span>Email: <span className="text-required">*</span></span>}
                                        variant="bordered"
                                        placeholder='Nhập địa chỉ email'
                                        classNames={{ label: 'w-[80px]', mainWrapper: 'w-[calc(100%-80px)]' }}
                                        labelPlacement={'outside-left'}
                                    />
                                </div>
                                <div className='input-form py-2'>
                                    <FieldPassword
                                        control={control}
                                        name="password"
                                        rules={{
                                            required: { value: true, message: 'Trường không được để trống' },
                                            minLength: { value: 6, message: 'Độ dài tối thiểu 6 ký tự' },
                                            maxLength: { value: 255, message: 'Vượt quá ký tự cho phép' }
                                        }}
                                        type="password"
                                        label={<span>Mật khẩu: <span className="text-required">*</span></span>}
                                        variant="bordered"
                                        placeholder="Nhập mật khẩu"
                                        classNames={{ label: 'w-[80px]', mainWrapper: 'w-[calc(100%-80px)]' }}
                                        labelPlacement="outside-left"
                                    />
                                </div>
                                <div className='input-form py-2'>
                                    <FieldPassword
                                        control={control}
                                        name="confirmPassword"
                                        rules={{
                                            required: { value: true, message: 'Trường không được để trống' },
                                        }}
                                        type="password"
                                        label={<span>Nhập lại: <span className="text-required">*</span></span>}
                                        variant="bordered"
                                        placeholder="Nhập lại mật khẩu"
                                        classNames={{ label: 'w-[80px]', mainWrapper: 'w-[calc(100%-80px)]' }}
                                        labelPlacement="outside-left"
                                    />
                                </div>
                                <div className='input-form mb-5 mt-3'>
                                    <Checkbox
                                        checked={checked}
                                        onChange={(e) => setChecked(e.target.checked)}
                                    >
                                        <span className='text-[14px]'>
                                            Tôi đồng ý <a href="/" target="_blank" className='font-bold'>chính sách & điều khoản</a> của B&Q Watches
                                        </span>
                                    </Checkbox>
                                </div>
                                <Button className='button-register' type='submit' disabled={!checked} color='primary' fullWidth>Đăng ký</Button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}

const checkMobile = (value) => {
    if (value) {
        if (value && phoneValidate(value).validate()) return true;
        return 'Không phải điện thoại'
    }
    return 'Trường không được để trống'
}

export default RegisterV