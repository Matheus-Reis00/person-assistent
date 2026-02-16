import { FC } from "react";
import "./styles.scss"

interface Select {
    placeholder?: string
    options: { name: string, value: string | number }[]
    onChange: (e: any) => void;
    value: string | number
}
const Select: FC<Select> = ({
    onChange,
    options,
    placeholder = '',
    value
}) => {

    return (
        <div className="container-select">
            <select
                className={`default-select ${!value ? 'placeholder-color' : ''}`}
                onChange={onChange}
                value={value}
            >
                {placeholder && (
                    <option value="" disabled hidden>{placeholder}</option>
                )}
                <option value="">{placeholder || 'Selecione uma opção'}</option>
                {options.map((option, key) => (
                    <option key={key} value={option?.value}>{option.name}</option>
                ))}
            </select>
        </div>
    )
}

export default Select