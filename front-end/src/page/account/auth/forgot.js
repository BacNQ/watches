'use client'
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Countdown from 'react-countdown';
import phoneValidate from '../../../helpers/phone-validator';
import PasscodeInput from '../../../components/fields/passcode/input';
import { FieldInput, FieldPassword } from '../../../components/fields/index';
import { verifyUser, forgot } from '../../../services/auth'
import { useForm } from 'react-hook-form';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import './auth.scss'

const ForgotV = () => {
    const router = useRouter();
    const { watch, control, handleSubmit } = useForm({});
    const [socialing, setSocialing] = useState(false)
    const [token, setToken] = useState()
    const [error, setError] = useState('')
    const [count, setCount] = useState(false)
    const [verify, setVerify] = useState(false)
    const [email, setEmail] = useState('')
    const [value, setValue] = useState('')


    useEffect(() => {
      setError('')
    }, [JSON.stringify(watch())])

    const submitRequest = (values) => {
        if (!values?.email) return;
        setError('');
        setSocialing(true);
      
        verifyUser({ email: values.email }) // gọi API gửi OTP
          .then(({ data, message }) => {
            if (data?.res.token) {
                setVerify(true);
                toast.success('Mã xác minh đã được gửi!');
                setToken(data?.res.token); // token sẽ được dùng để reset mật khẩu
                setEmail(values.email);
            } else {
              setError(message || 'Không gửi được mã xác minh!');
              toast.error(message || 'Có lỗi xảy ra!');
            }
          })
          .catch((err) => {
            setError(err?.message || 'Lỗi gửi OTP');
            toast.error(err?.message || 'Lỗi gửi OTP');
          })
          .finally(() => setSocialing(false));
      }
      

      const changePassword = (values) => {
        if (!value || !token || !values?.password || !values?.confirmPassword) {
          return setError('Vui lòng điền đầy đủ thông tin');
        }
      
        setSocialing(true);
        setError('');
      
        forgot({
          code: value,
          token,
          password: values.password
        })
          .then(({ data, message }) => {
            if (data) {
              toast.success('Cập nhật mật khẩu thành công!');
              router.push(`/auth/login?username=${email}`);
            } else {
              setError(message || 'Không đổi được mật khẩu');
              toast.error(message || 'Lỗi');
            }
          })
          .catch((err) => {
            setError(err?.message || 'Đổi mật khẩu thất bại');
            toast.error(err?.message || 'Lỗi');
          })
          .finally(() => setSocialing(false));
      }
      

    return (
        <div className='container'>
            <div className='auth-body'>
                <div className='form-register'>
                    <div className='group-auth'>
                        <div className='box-register'>
                            <h3 className="label-auth text-center bold">QUÊN MẬT KHẨU</h3>
                            <p className="text-center label-redirect">Bạn đã nhớ lại mật khẩu? <Link href="/auth/login" className='link-auth'>Đăng nhập</Link></p>
                            <br />
                            <div className='login-body'>
                                {!verify && <div><p className="text-instruct">Để khôi phục nhập khẩu, bạn vui lòng nhập SĐT/Email đã dùng để đăng ký trên hệ thống.</p><br /></div>}
                                {verify && <div className="text-center text-success text-sm text-check">Vui lòng kiểm tra hộp thư hoặc tin nhắn để lấy mã xác minh.</div>}
                                {verify && <div className='pd-15 text-send-back'>Không nhập được mã xác thực ? {count ? CountTime({ setCount }) : <Button size='small' className="btn-send-back" onClick={() => submitRequest({ email })} isIconOnly>Gửi lại</Button>}</div>}
                                {verify
                                    ?
                                    <div>
                                        <div className='input-form py-2'>
                                            <label className='bold mr-b-5'>MÃ XÁC MINH</label>
                                            <div className='flex justify-center'>
                                                <PasscodeInput
                                                    plain
                                                    seperated
                                                    value={value}
                                                    numInputs={6}
                                                    onChange={(v) => setValue(v)}
                                                />
                                            </div>
                                        </div>
                                        <form onSubmit={handleSubmit((data) => changePassword(data))} className='form-password'>
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
                                                    label="Mật khẩu mới"
                                                    variant="bordered"
                                                    placeholder="Nhập lại mật khẩu mới"
                                                    labelPlacement="outside"
                                                />
                                            </div>
                                            <div className='input-form py-2' style={{paddingTop: 24}}>
                                                <FieldPassword
                                                    control={control}
                                                    name="confirmPassword"
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
                                            <div className='text-center box-submit-change'>
                                                <Button type='submit' className='btn-submit-change' color='primary' isLoading={socialing} isDisabled={!value} fullWidth>Thay đổi</Button>
                                                <p className='text-danger text-sm text-right py-2'>{error}</p>
                                            </div>
                                        </form>
                                    </div>
                                    :
                                    <form onSubmit={handleSubmit((data) => submitRequest(data))}>
                                        <div className='input-form py-2'>
                                            <FieldInput
                                                fullWidth
                                                control={control}
                                                name="email"
                                                rules={{
                                                    required: { value: true, message: 'Trường không được để trống' },
                                                    maxLength: { value: 255, message: 'Vượt quá ký tự cho phép' },
                                                    validate: checkUsername
                                                }}
                                                size="lg"
                                                type="text"
                                                label="Tài khoản :"
                                                variant="bordered"
                                                placeholder='Số điện thoại/email'
                                                labelPlacement={'outside'}
                                            />
                                        </div>
                                        <div className='input-form py-2 px-3'>
                                            <Button type='submit' className='button-forgot' color='primary' isLoading={socialing} fullWidth>Gửi yêu cầu khôi phục mật khẩu</Button>
                                            <p className='text-danger text-sm text-right py-2' dangerouslySetInnerHTML={{ __html: error }}></p>
                                        </div>
                                    </form>
                                }
                                <p className="mr-0 text-end"><Link href="/auth/login" className='link-auth'><i className="fa fa-arrow-circle-left" /> Đăng nhập</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const renderer = ({ seconds }) => (
    <span>&emsp;<span className='bold'>{seconds}</span> s</span>
);

const CountTime = ({ setCount }) => {
    return (
        <Countdown date={Date.now() + 30000} renderer={renderer} onComplete={() => setCount(false)} />
    )
}

const valiEmail = (val) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) {
        return true;
    }
    return false;
}

const checkUsername = (value) => {
    if (value) {
        if (value && (phoneValidate(value).validate() || valiEmail(value))) return true;
        return 'Không phải điện thoại/email'
    }
    return 'Trường không được để trống'
}

const checkPassword = (watch) => (value) => {
    const password = watch('password')
    if (value) {
        if (password === value) return true;
        return 'Mật khẩu chưa trùng nhau'
    }
    return 'Trường không được để trống'
}

export default ForgotV