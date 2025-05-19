
import React from 'react';
import { Textarea } from '@nextui-org/react';
import { useController } from 'react-hook-form';

const InputField = (props) => {
    const { label, options, ...rest } = props;
    const { field, formState: { errors } } = useController(props)
    const { name, value, onChange, onBlur } = field;
    return (
        <div>
            <Textarea
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