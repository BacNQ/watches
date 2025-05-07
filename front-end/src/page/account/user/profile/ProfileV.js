'use client'
import './style.scss';
import dayjs from 'dayjs';
import Link from 'next/link';
import toast from 'react-hot-toast';
import UserAvatar from '../../_components/avatar';
import { Button, Chip } from '@nextui-org/react';
import { useUser } from '../../../../provider/UserProvider'
import { FieldRadio, FieldSelect, FieldInput } from '../../../../components/fields';
import { updateProfile } from '../../../../services/auth';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { useState } from 'react';


const ProfileV = () => {
    const { user, refetch } = useUser();
    console.log(user)
    const [phone, setPhone] = useState("");
    const [open, setOpen] = useState(false);

    const initialValues = {
        id: user?._id,
        username: user?.username,
        gender: user?.gender && user?.gender ? user?.gender : "M",
        // phone: user?.phone,
        // email: user?.email,
        day: user?.birthdate ? dayjs(user.birthdate).format('DD') : null,
        month: user?.birthdate ? dayjs(user.birthdate).format('MM') : null,
        year: user?.birthdate ? dayjs(user.birthdate).format('YYYY') : null,
    };

    const { register, control, handleSubmit } = useForm({ defaultValues: initialValues });

    const onSuccess = () => {
        if (refetch) refetch();
        toast.success('Cập nhật thành công!')
        close(false)
    }

    const onError = (error) => {
        toast.error('Cập nhật thông tin thất bại!')
    }

    const { mutate, isPending } = useMutation({
        onError: onError,
        onSuccess: onSuccess,
        mutationFn: (body) => updateProfile(body)
    })

    const onSubmit = (values) => {
        let birthdate = null;
        if (values.day && values.month && values.year) {
            birthdate = dayjs(values.day + '/' + values.month + '/' + values.year, 'DD/MM/YYYY').format();
        }
        const body = {
            id: user?._id,
            username: values?.username,
            gender: values?.gender || "M",
            birthdate: birthdate,
        };
        mutate(body)
    }

    const onActive = (active) => {
        setPhone(active)
        setOpen(true);
    }

    return (
        <>
            <nav aria-label="breadcrumb" className='breadcrumb'>
                <ol className="breadcrumb-list">
                    <li className="breadcrumb-item">
                        <Link href="/"><i className='bx bx-home-alt-2' />Trang chủ</Link>
                    </li>
                    <li className="breadcrumb-item active">
                        <i className='bx bx-chevron-right' />
                        <span>Thông tin tài khoản</span>
                    </li>
                </ol>
            </nav>
            <div className='page-user'>
                <div className="box-left">
                    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                        <p className="label-group"><label className="text-[18px] tracking-[0.25px] font-semibold">Thông tin cá nhân</label></p>
                        <div className='group-info items-center'>
                            <div className='form-avatar'>
                                <div className="avatar-user">
                                    <UserAvatar user={user} refetch={refetch} />
                                </div>
                            </div>
                            <div className='form-info'>
                                <FieldInput
                                    fullWidth
                                    control={control}
                                    name="username"
                                    rules={{ required: true, maxLength: 255 }}
                                    type="input"
                                    label="Họ và tên:"
                                    variant="bordered"
                                    placeholder="Nhập họ và tên"
                                    classNames={{ label: 'w-[110px]', mainWrapper: 'w-full' }}
                                    labelPlacement={'outside-left'}
                                />
                            </div>
                        </div>
                        <div className='group-birthdate'>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-default-500 text-small">Ngày sinh</h3>
                                <div className="birthdate-select flex w-full items-end flex-nowrap mb-0 gap-4">
                                    <FieldSelect
                                        control={control}
                                        name="day"
                                        variant='bordered'
                                        labelPlacement={'outside'}
                                        placeholder="Ngày"
                                        options={Array.from(new Array(31)).map((i, index) => {
                                            let day = index >= 9 ? `${index + 1}` : `0${index + 1}`
                                            return ({ value: day, label: day })
                                        })}
                                    />
                                    <FieldSelect
                                        control={control}
                                        name="month"
                                        variant='bordered'
                                        labelPlacement={'outside'}
                                        placeholder="Tháng"
                                        options={Array.from(new Array(12)).map((i, index) => {
                                            let month = index >= 9 ? `${index + 1}` : `0${index + 1}`
                                            return ({ value: month, label: month })
                                        })}
                                    />
                                    <FieldSelect
                                        control={control}
                                        name="year"
                                        variant='bordered'
                                        labelPlacement={'outside'}
                                        placeholder="Năm"
                                        options={Array.from(new Array(120)).map((i, index) => {
                                            let year_str = dayjs().format('YYYY');
                                            let year = Number(year_str) - index;
                                            return ({ value: `${year}`, label: `${year}` })
                                        }
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='group-gender'>
                            <FieldRadio
                                control={control}
                                rules={{ required: true }}
                                label="Giới tính"
                                name="gender"
                                options={[
                                    { value: 'M', label: 'Nam' },
                                    { value: 'F', label: 'Nữ' },
                                    { value: 'O', label: 'Khác' }
                                ]}
                            />
                        </div>
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <Button type='submit' color="primary" className='btn-update' block loading={isPending}>Cập nhật</Button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className='line-vertical' />
                <div className='box-right'>
                    <p className="label-group"><label className="text-[18px] tracking-[0.25px] font-semibold">Số điện thoại và Email</label></p>
                    <div className='group-user'>
                        <div className='line-group'>
                            <i className='bx bx-phone icon' />
                            <div className='label-line'>Số điện thoại</div>
                            <span className='label-name'>{user?.phone ? user?.phone : <Chip color="warning" variant="flat">Chưa có số điện thoại</Chip>}</span>
                            <Button onPress={() => onActive(true)} className='btn-update' color="primary" variant="ghost">Cập nhật</Button>
                        </div>
                        <div className='line-group'>
                            <i className='bx bx-envelope icon' />
                            <div className='label-line'>Email</div>
                            <span className='label-name'>{user?.email ? user?.email : <Chip color="warning" variant="flat">Chưa có địa chỉ email</Chip>}</span>
                            <Button onPress={() => onActive(false)} className='btn-update' color="primary" variant="ghost">Cập nhật</Button>
                        </div>
                    </div>
                    <p className="label-group"><label className="text-[18px] tracking-[0.25px] font-semibold">Bảo mật</label></p>
                    <div className='group-user'>
                        <div className='line-group'>
                            <i className='bx bx-lock icon !top-[6px]' />
                            <span className='label-name !text-base'>Cập nhật lại mật khẩu</span>
                            <Link href="/account/user/password">
                                <Button className='btn-update' style={{ top: 2 }} color="primary" variant="ghost">Cập nhật</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileV;
