'use client'
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
// import Auth from '../../../storage/auth'
// import { auth } from '../../../config'
// import { FacebookProvider, LoginButton } from 'react-facebook';
// import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { login, loginSocial } from '../../../services/auth'
import { FieldInput, FieldPassword } from '../../../components/fields/index';
import { Button } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
// import { useUser } from '@/lib/auth-service';
// import { useQuery } from '@/hook/query';
// import { checkSession } from '@/services/auth.service';
import './auth.scss'

const LoginV = () => {
    //   const { query, pathname, router } = useQuery()
      const { watch, setValue, control, handleSubmit } = useForm({});
    //   const [socialing, setSocialing] = useState(null)
    //   const [error, setError] = useState('')
    //   const { setAuthorized } = useUser();

    //   const callbackResult = (result) => {
    //     setSocialing(null)
    //     if (result) {
    //       setAuthorized(true);
    //       const next = query?.next;
    //       toast.success('Đăng nhập thành công!')
    //       if (next) {
    //         router.push(next)
    //       } else {
    //         router.push('/account')
    //       }
    //     } else {
    //       toast.error('Đăng nhập thất bại!')
    //     }
    //   }

    //   useEffect(() => {
    //     setError('')
    //   }, [JSON.stringify(watch())])

    //   useEffect(() => {
    //     setValue('username', query?.username || '')
    //   }, [pathname])

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

    //   const loginGoogle = (res) => {
    //     if (res && res.access_token) {
    //       const { access_token } = res;
    //       const data = {
    //         type_mode: 'CLI',
    //         provider: "google",
    //         access_token: access_token,
    //       }
    //       setSocialing('google')
    //       loginSocial(data)
    //         .then(({ access, refresh, message }) => {
    //           if (access) {
    //             checkSession(access.token).then((el) => {
    //               const info = el?.data?.data;
    //               if (!info.phone) {
    //                 toast.error("Vui lòng cập nhật thông tin!");
    //                 router.push(`/auth/register?email=${info.email}`);
    //               } else {
    //                 Auth.setAccessToken(access);
    //                 Auth.setRefreshToken(refresh);
    //                 callbackResult(true);
    //               }
    //             });
    //           } else {
    //             setError(message || "Lỗi đăng nhập!");
    //             callbackResult(false);
    //           }
    //         })
    //         .catch((error) => {
    //           callbackResult(false, error?.message)
    //         })
    //         .finally(() => {
    //           setSocialing(null)
    //         })
    //     }
    //   }

    //   const loginFacebook = (res) => {
    //     if (res && res.authResponse) {
    //       const { accessToken } = res.authResponse;
    //       const data = {
    //         type_mode: 'CLI',
    //         provider: "facebook",
    //         access_token: accessToken,
    //       }
    //       setSocialing('facebook')
    //       loginSocial(data)
    //         .then(({ access, refresh, message }) => {
    //           if (access) {
    //             Auth.setAccessToken(access);
    //             Auth.setRefreshToken(refresh);
    //             callbackResult(true)
    //           } else {
    //             setError(message || 'Lỗi đăng nhập!')
    //             callbackResult(false)
    //           }
    //         })
    //         .catch((error) => {
    //           callbackResult(false, error?.message)
    //         })
    //         .finally(() => {
    //           setSocialing(null)
    //         })
    //     }
    //   }

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
                                    <div className="tab-separate">
                                        <span>Hoặc đăng nhập qua</span>
                                    </div>
                                    {/* <div className="group-social flex justify-between gap-4">
                                        <div className="item-login w-100">
                                            <GoogleOAuthProvider clientId={auth.clientIdGoogle}>
                                                <Google loginGoogle={loginGoogle} socialing={socialing} />
                                            </GoogleOAuthProvider>
                                        </div>
                                        <div className="item-login w-100">
                                            <FacebookProvider appId={auth.appFacebookId}>
                                                <Facebook loginFacebook={loginFacebook} socialing={socialing} />
                                            </FacebookProvider>
                                        </div>
                                    </div> */}
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

// const Google = ({ loginGoogle, socialing }) => {
//   const googleLogin = useGoogleLogin({
//     onSuccess: loginGoogle,
//     onError: () => toast.error('Đăng nhập google thất bại.')
//   })
//   return (
//     <Button
//       onPress={googleLogin}
//       size="large"
//       loading={socialing === 'google'}
//       disabled={!!socialing}
//       className="btn-login-google"
//     >
//       <span>Google</span>
//     </Button>
//   )
// }

// const Facebook = ({ loginFacebook, socialing }) => {
//   return (
//     <LoginButton
//       disabled={!!socialing}
//       scope="email"
//       onError={(e) => console.log(e)}
//       onSuccess={loginFacebook}
//       className="btn-login-facebook"
//     >
//       <span>Facebook</span>
//     </LoginButton>
//   )
// }

export default LoginV