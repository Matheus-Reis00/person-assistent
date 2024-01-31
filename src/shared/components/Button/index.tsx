import { FC } from "react";
import "./styles.scss"

interface IButton {
    marginTop?: string
    nameButton: string
    onClick?: () => void
    colorOptional?: string
}
const Button: FC<IButton> = ({nameButton, onClick, colorOptional}) => {
    return <button className="button-interactive" style={{backgroundColor: `${colorOptional}`}} onClick={onClick}>{nameButton}</button>
}

export default Button