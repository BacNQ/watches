'use client'
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
// import Auth from '../../../storage/auth'
// import { auth } from '../../../config'
// import { FacebookProvider, LoginButton } from 'react-facebook';
// import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { login, loginSocial } from '../../services/auth'
import { FieldInput, FieldPassword } from '../../components/fields/index';
import { Button } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
// import { useUser } from '@/lib/auth-service';
// import { useQuery } from '@/hook/query';
// import { checkSession } from '@/services/auth.service';
import './auth.scss'

const LoginV = () => {
    const { watch, setValue, control, handleSubmit } = useForm({});

    const loginLocal = (values) => {
        login(values)
          .then((res) => {
            const accessToken = res.data?.accessToken;
            if (accessToken) {
              localStorage.setItem('token', accessToken);
              toast.success('Đăng nhập thành công!');
              window.location.href = '/';
            } else {
              toast.error('Đăng nhập thất bại!');
            }
          })
          .catch((err) => {
            const msg = err.response?.data?.message || 'Lỗi hệ thống!';
            toast.error(msg);
          });
      };

    return (
        <div className='page-auth'>
            <div className='container'>
                <div className='auth-body'>
                    <div className="form-login">
                        <div className="group-auth w-100">
                            <article id="content" className="box-login">
                                <div className="tab-login">
                                    <h3 className="text-center label-auth bold">ĐĂNG NHẬP</h3>
                                    <p className="text-center label-redirect">Bạn chưa có tài khoản? <Link href="/auth/register" className='link-auth'>Đăng ký ngay</Link></p>
                                    <br />
                                    <form onSubmit={handleSubmit(loginLocal)}>
                                        <div className='input-form'>
                                            <FieldInput
                                                control={control}
                                                name="username"
                                                rules={{
                                                    required: { value: true, message: 'Trường không được để trống' },
                                                    maxLength: { value: 255, message: 'Vượt quá ký tự cho phép' }
                                                }}
                                                type="text"
                                                size="lg"
                                                fullWidth
                                                variant="bordered"
                                                placeholder='Số điện thoại/email'
                                                labelPlacement='outside'
                                            />
                                        </div>

                                        <div className='input-form'>
                                            <FieldPassword
                                                control={control}
                                                name="password"
                                                rules={{
                                                    required: { value: true, message: 'Trường không được để trống' },
                                                    minLength: { value: 3, message: 'Vui lòng nhập đúng mật khẩu' },
                                                    maxLength: { value: 255, message: 'Vượt quá ký tự cho phép' }
                                                }}
                                                size="lg"
                                                type="password"
                                                variant="bordered"
                                                placeholder="Mật khẩu"
                                                labelPlacement="outside"
                                            />
                                        </div>
                                        <div className='my-2 px-3'>
                                            <Button type='submit' color='primary' className='button-login'/*isDisabled={!!socialing} isLoading={socialing === 'local'}*/ fullWidth>Đăng nhập</Button>
                                            {/* <p className="text-center text-sm text-danger py-3">{error}</p> */}
                                            <p className="text-forget py-2"><Link href="/auth/forgot">Quên mật khẩu?</Link></p>
                                        </div>
                                    </form>
                                </div>
                                <div id="recaptcha-container"></div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginV