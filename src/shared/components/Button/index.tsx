import { FC } from "react";
import "./styles.scss"

interface IButton {
    marginTop?: string
    nameButton: string
    onClick?: () => void
    colorOptional?: string
    disabled?: boolean
}
const Button: FC<IButton> = ({ nameButton, onClick, colorOptional, disabled = false}) => {
    return <button disabled={disabled} className="button-interactive" style={{ backgroundColor: `${colorOptional}` }} onClick={onClick}>{nameButton}</button>
}

export default Button