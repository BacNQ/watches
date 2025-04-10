import './style.scss';
import React from 'react';
import { Input } from '@nextui-org/react';

const Password = ({...rest}) => {
    const [hidden, setHidden] = React.useState(false);
    return (
        <div className="flex w-full items-center flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 relative">
            <Input
              {...rest}
              type={hidden ? 'text' : 'password'}
            />
            <span className='cursor-pointer pr-2 text-[14px] eye-pass'>{!hidden ? (<i className="fa fa-eye"  onClick={() => setHidden(true)} />) : (<i className="fa fa-eye-slash" onClick={() => setHidden(false)} />)}</span>
        </div>
    )
}

export default Password;