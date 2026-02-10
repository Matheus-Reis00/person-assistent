import { FC } from "react";
import { AiOutlineClose } from "react-icons/ai"
import { months } from "../../../shared/utils/statics";
import "./styles.scss"
import { Despesa } from "../../utils/types";
import { optionsTypePayment } from "../../statics/optionsTypePayment";
import { currencyFormatter } from "../../utils/helpers";

interface IModal {
    onClick?: () => void;
    type?: string
    despesa: Despesa
}

const Modal: FC<IModal> = ({ onClick, type, despesa }) => {

    const typePayment = optionsTypePayment.find((item) => item.value === despesa?.tipo_pagamento)

    return (
        <div className="container-modal">
            <div className="container-box">
                <div className="container-close">
                    <button onClick={onClick}>
                        <AiOutlineClose />
                    </button>
                </div>
                {type === "avulsas" ? (
                    <>
                        <div className="container-data">
                            <div className="data">
                                <div>
                                    <label>Título</label>
                                    <input type="text" placeholder={despesa?.title} disabled />
                                </div>
                            </div>
                            <div className="data">
                                <div>
                                    <label>Cartão</label>
                                    <input type="text" placeholder={typePayment?.name} disabled />
                                </div>
                            </div>
                            <div className="data">
                                <div>
                                    <label>Mês</label>
                                    <input type="text" placeholder={months[Number(despesa?.mes)].name} disabled />
                                </div>
                                <div>
                                    <label>Ano</label>
                                    <input type="text" placeholder={despesa?.ano} disabled />
                                </div>
                            </div>
                            <div className="data">
                                <div>
                                    <label>Valor</label>
                                    <input type="text" placeholder={String(currencyFormatter(Number(despesa?.valor_total) || 0))} disabled />
                                </div>


                            </div>
                            <div className="data">
                                <div>
                                    <label>Valor parcela</label>
                                    <input type="text" placeholder={String(currencyFormatter(Number(despesa?.valor_parcela) || 0))} disabled />
                                </div>
                            </div>
                            <div className="data">
                                <div>
                                    <label>Parcelas</label>
                                    <input type="text" placeholder={String(despesa?.total_parcelas)} disabled />
                                </div>
                            </div>
                        </div>
                    </>
                ) : type === "fixas" && (
                    <>
                        <div className="container-data">
                            <div className="data">
                                <div>
                                    <label>Título</label>
                                    <input type="text" placeholder={despesa?.title} disabled />
                                </div>
                            </div>
                            <div className="data">
                                <div>
                                    <label>Valor</label>
                                    <input type="text" placeholder={String(currencyFormatter(Number(despesa?.valor_total) || 0))} disabled />
                                </div>
                            </div>
                        </div>
                    </>
                )

                }


            </div>
        </div>
    )
}

export default Modal