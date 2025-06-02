
import React from 'react';
import { SearchIcon } from './SearchIcon';
import { Input } from '@nextui-org/react';

const InputSearch = (props) => {
    const { label, onChange, onBlur, onSearch, value, className, ...rest } = props;
    const onSubmit = (e) => {
        e.preventDefault();
        onSearch(value)
    }

    return (
        <form onSubmit={onSubmit} className="input-group">
            <Input
                {...rest}
                value={value || ''}
                onBlur={onBlur}
                onValueChange={(val) => onChange(val)}
                startContent={<SearchIcon size={18} />}
                classNames={{
                    inputWrapper: 'h-10 py-0 bg-white'
                }}
                className={`${className || ''}`}
                type="search"
            />
        </form>
    )
}

export default InputSearch;