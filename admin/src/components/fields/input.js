
import React from 'react';
import { Input } from '@nextui-org/react';
import { useController } from 'react-hook-form';

const renderError = (names, error) => {
    if (names?.length) {
        names.forEach(name => {
            if (error && error[name]) error = error[name]
        });
    }
    return error;
}

const InputField = (props) => {
    const { field, formState: { errors } } = useController(props)
    const { name, value, onChange, onBlur } = field;
    const { label, options, mode, type, ...rest } = props;
    const names = name?.split('.')
    const _error = renderError(names, errors)

    let _value = value;

    if (type === 'number' && value) {
        _value = !isNaN(Number(_value)) ? Number(_value) : (value || '');
        if (mode === 'comma') {
            _value = `${value || ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
    }

    const changeInput = (val) => {
        if (type === 'number' && val) {
            val = `${val}`.replace(/(,*)/g, '');
            if (val && (val.slice(-1) !== '.' || val.split(".").length != 2)) {
                val = !isNaN(Number(val)) ? Number(val) : (value || 0);
            }
        }
        onChange(val);
    }

    return (
        <div className='text-input'>
            {mode === 'comma'
                ?
                <Input
                    {...rest}
                    label={label || undefined}
                    name={name}
                    value={_value}
                    onChange={(e) => changeInput(e.target.value)}
                    onBlur={onBlur}
                />
                :
                <Input
                    {...rest}
                    type={type || 'text'}
                    label={label || undefined}
                    name={name}
                    value={value}
                    onChange={(e) => changeInput(e.target.value)}
                    onBlur={onBlur}
                />
            }
            <div className='text-error text-end leading-4 text-[13px] pr-3 text-[red] mt-2'><span className='text-tiny text-danger'>{_error && _error?.message}</span></div>
        </div>
    )
}

export default InputField;