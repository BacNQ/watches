
import React from 'react';
import PassCode from './input';
import { useController } from 'react-hook-form';

const InputField = (props) => {
    const { field, fieldState: { errors } } = useController(props)
    const { name, value, onChange, onBlur } = field;
    const { label, options, ...rest } = props;

    return (
        <div>
            <PassCode
              {...rest}
              label={label || undefined}
              name={name}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
            />
            <div className='text-end'><span className='text-tiny text-danger'>{errors[name] && errors[name].message}</span></div>
        </div>
    )
}

export default InputField;