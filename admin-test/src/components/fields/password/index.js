
import React from 'react';
import Password from './input';
import { useController } from 'react-hook-form';

const InputField = (props) => {
    const { field, formState: { errors } } = useController(props)
    const { name, value, onChange, onBlur } = field;
    const { label, options, ...rest } = props;

    return (
        <div>
            <Password
              {...rest}
              label={label || undefined}
              name={name}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
            />
            <div className='text-end text-error text-[13px] pr-3 text-[red] mt-2'><span className='text-tiny text-danger'>{errors[name] && errors[name].message}</span></div>
        </div>
    )
}

export default InputField;