import { FC, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai"
import "./styles.scss"

interface IModalVirada {
    onClick: () => void;
    cardName: string;
    diaVirada: number;
}

const ModalVirada: FC<IModalVirada> = ({ onClick, cardName, diaVirada }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="container-modal-virada">
            <div className="container-box">
                <div className="container-close">
                    <button onClick={onClick}>
                        <AiOutlineClose />
                    </button>
                </div>
                <div className="content">
                    <h1>Dia de virada do cartão</h1>
                    <div className="info">
                        <label>{cardName}</label>
                        <span>Todo dia {diaVirada}</span>
                    </div>
                    <p className="description">
                        Todas as compras realizadas a partir dessa data irão entrar na fatura do mês seguinte
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ModalVirada;
