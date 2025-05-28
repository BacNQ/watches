
import React from 'react';
import { RadioGroup, Radio } from '@nextui-org/react';
import { useController } from 'react-hook-form';

const RadioField = (props) => {
    const { label, options } = props;
    const { field, formState: { errors } } = useController(props)
    const { name, value, onChange, onBlur } = field;

    return (
        <div>
            <RadioGroup
                label={label || undefined}
                name={name}
                onValueChange={onChange}
                onBlur={onBlur}
                value={value}
                classNames={{label: 'text-default-500 text-small'}}
                orientation="horizontal"
                className='radio-group'
            >
                {options.map((item) => <Radio value={item.value} key={item.value}>{item.label}</Radio>)}
            </RadioGroup>
            <div className='text-end'><span className='text-tiny text-danger'>{errors[name] && errors[name].message}</span></div>
        </div>
    )
}

export default RadioField;