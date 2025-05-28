
import React from 'react';
import { Checkbox } from '@nextui-org/react';
import { useController } from 'react-hook-form';

const CheckboxField = (props) => {
    const { label, text } = props;
    const { field, formState: { errors } } = useController(props)
    const { name, value, onChange } = field;

    return (
        <div className='label-checkbox'>
            {label && <div>{label}</div>}
            <Checkbox name={name} isSelected={value} onValueChange={onChange}>{text}</Checkbox>
            <div className='text-end'><span className='text-tiny text-danger'>{errors[name] && errors[name].message}</span></div>
        </div>
    )
}

export default CheckboxField;