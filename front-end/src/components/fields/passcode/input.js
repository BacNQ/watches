import React from 'react';
import CodeInput from 'react-otp-input';
// import { Input } from '@nextui-org/react';

const PassCode = ({ ...rest }) => {
    return (
        <CodeInput
            {...rest}
            renderSeparator={<span>&ensp;</span>}
            renderInput={(props) => (
                <input
                    {...props}
                    className="!w-12 !h-12 !mt-4 text-center border border-slate-300 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}
        />

    )
}

export default PassCode;