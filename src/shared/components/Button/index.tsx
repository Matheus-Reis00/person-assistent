import { FC } from "react";
import "./styles.scss"

interface IButton {
    marginTop?: string
    nameButton: string
    onClick?: () => void
    colorOptional?: string
    disabled?: boolean
    loading?: boolean
}
const Button: FC<IButton> = ({ nameButton, onClick, colorOptional, disabled = false, loading = false }) => {
    return (
        <button
            disabled={disabled || loading}
            className={`button-interactive ${loading ? 'loading' : ''}`}
            style={{ backgroundColor: `${colorOptional}` }}
            onClick={onClick}
        >
            {loading ? <div className="spinner"></div> : nameButton}
        </button>
    )
}

export default Button