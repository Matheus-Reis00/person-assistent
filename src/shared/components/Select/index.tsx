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
            {(placeholder && !value) && (
                <label>{placeholder || ''}</label>
            )}
            <select className="default-select" onChange={onChange} value={value} style={!!value ? { color: '#000' } : {}}>
                <option value=""></option>
                {options.map((option, key) => (
                    <option key={key} value={option?.value}>{option.name}</option>
                ))}
            </select>
        </div>
    )
}

export default Select