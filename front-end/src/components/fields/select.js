
import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { useController } from 'react-hook-form';

const SelectField = (props) => {
    const { field, formState: { errors } } = useController(props)
    const { name, value, onChange, onBlur } = field;
    const { label, options, ...rest } = props;
    let _value = value ? `${value}` : null;
    return (
        <div className='w-100'>
            <Select
                {...rest}
                label={label || undefined}
                name={name}
                selectedKeys={[_value]}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
            >
                {options?.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
            </Select>
            <div className='text-end'><span className='text-tiny text-danger'>{errors[name] && errors[name].message}</span></div>
        </div>
    )
}

export default SelectField;