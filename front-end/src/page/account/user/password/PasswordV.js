'use client'
import './style.scss';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { useUser } from '../../../../provider/UserProvider';
import { changePassword } from '../../../../services/auth';
import { FieldPassword } from '../../../../components/fields';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useQuery } from '@/hook/query';

const ChangePassV = () => {
    const { router } = useQuery();
    const { user } = useUser();
    const { watch, reset, control, handleSubmit } = useForm({});
    const [error, setError] = useState('')

    const onSuccess = () => {
        reset();
        toast.success('Thay đổi thành công!')
        router.push('/account/user')
    }

    const onError = (error) => {
        setError(error?.message || 'Thay đổi mật khẩu thất bại!')
        toast.error('Thay đổi mật khẩu thất bại!')
    }

    const { mutate, isPending } = useMutation({
        onError: onError,
        onSuccess: onSuccess,
        mutationFn: (body) => changePassword(body)
    })

    const onSubmit = (values) => {
        if (values && values.password && values.confirmpassword) {
            mutate(values)
        }
    }

    return (
        <div className="page-password">
            <div className='panel-body'>
                <nav aria-label="breadcrumb" className='breadcrumb'>
                    <ol className="breadcrumb-list">
                        <li className="breadcrumb-item">
                            <Link href="/"><i className='bx bx-home-alt-2' />Trang chủ</Link>
                        </li>
                        <li className="breadcrumb-item active">
                            <i className='bx bx-chevron-right' />
                            <Link href="/account/user">Thông tin tài khoản</Link>
                        </li>
                        <li className="breadcrumb-item active">
                            <i className='bx bx-chevron-right' />
                            <span>Đổi mật khẩu</span>
                        </li>
                    </ol>
                </nav>
                <div className='content-body'>
                    <div className="content-title">
                        <label className="label bold">Thay đổi mật khẩu</label>
                    </div>
                    <form onSubmit={handleSubmit((data) => onSubmit(data))} className='form-password'>
                        <div className='input-form'>
                            <FieldPassword
                                control={control}
                                name="oldPassword"
                                rules={{
                                    required: { value: true, message: 'Trường không được để trống' },
                                    minLength: { value: 6, message: 'Độ dài tối thiểu 6 ký tự' },
                                    maxLength: { value: 255, message: 'Vượt quá ký tự cho phép' }
                                }}
                                type="password"
                                label="Mật khẩu cũ"
                                variant="bordered"
                                placeholder="Nhập lại mật khẩu hiện tại"
                                labelPlacement="outside"
                                className="testtt"
                            />
                        </div>
                        <div className='input-form'>
                            <FieldPassword
                                control={control}
                                name="password"
                                rules={{
                                    required: { value: true, message: 'Trường không được để trống' },
                                    minLength: { value: 6, message: 'Độ dài tối thiểu 6 ký tự' },
                                    maxLength: { value: 255, message: 'Vượt quá ký tự cho phép' }
                                }}
                                type="password"
                                label="Mật khẩu mới"
                                variant="bordered"
                                placeholder="Nhập lại mật khẩu mới"
                                labelPlacement="outside"
                            />
                        </div>
                        <div className='input-form'>
                            <FieldPassword
                                control={control}
                                name="confirmpassword"
                                rules={{
                                    required: { value: true, message: 'Trường không được để trống' },
                                    validate: checkPassword(watch)
                                }}
                                type="password"
                                label="Nhập lại mật khẩu"
                                variant="bordered"
                                placeholder="Nhập lại mật khẩu mới"
                                labelPlacement="outside"
                            />
                        </div>
                        <br />
                        <div className='text-center'>
                            <Button type='submit' className='btn-change' isLoading={isPending} color='primary'>Thay đổi</Button>
                            <p className='text-danger mr-0 text-center'>{error}</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

const checkPassword = (watch) => (value) => {
    const password = watch('password')
    if (value) {
        if (password === value) return true;
        return 'Mật khẩu chưa trùng nhau'
    }
    return 'Trường không được để trống'
}

export default ChangePassV