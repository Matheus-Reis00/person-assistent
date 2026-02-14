import { FC, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai"
import { months } from "../../../shared/utils/statics";
import "./styles.scss"
import { Despesa } from "../../utils/types";
import { optionsTypePayment } from "../../statics/optionsTypePayment";
import { currencyFormatter } from "../../utils/helpers";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import api from "../../api";

interface IModal {
    onClick?: () => void;
    type?: string
    despesa: Despesa
}

const Modal: FC<IModal> = ({ onClick, type, despesa }) => {
    const navigate = useNavigate();
    const typePayment = optionsTypePayment.find((item) => item.value === despesa?.tipo_pagamento)

    useEffect(() => {
        // Bloqueia o scroll do body ao abrir o modal
        document.body.style.overflow = 'hidden';

        // Remove o bloqueio ao fechar o modal (unmount)
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleEdit = () => {
        const typeUrl = type === "fixas" ? "fixa" : "avulsa";
        navigate(`/produto/${typeUrl}/${despesa.mes}/${despesa.ano}/${despesa.id}`);
    }

    const handleDelete = async () => {
        if (!despesa.id) return;

        const confirmDelete = window.confirm("Deseja realmente excluir esta despesa?");
        if (!confirmDelete) return;

        try {
            await api.delete({
                property: "despesas",
                query: { id: despesa.id }
            });
            alert("Despesa excluída com sucesso!");
            window.location.reload(); // Recarrega para atualizar a lista
        } catch (error) {
            console.error("Erro ao excluir despesa:", error);
            alert("Erro ao excluir despesa.");
        }
    }

    return (
        <div className="container-modal">
            <div className="container-box">
                <div className="container-close">
                    <button onClick={onClick}>
                        <AiOutlineClose />
                    </button>
                </div>
                <div className="container-data">
                    <div className="data">
                        <div>
                            <label>Data de Lançamento</label>
                            <input
                                type="text"
                                placeholder={despesa?.id ? new Date(Number(despesa.id)).toLocaleDateString('pt-BR') : 'N/A'}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="data">
                        <div>
                            <label>Título</label>
                            <input type="text" placeholder={despesa?.title} disabled />
                        </div>
                    </div>
                    {type === "avulsas" ? (
                        <>
                            <div className="data">
                                <div>
                                    <label>Cartão</label>
                                    <input type="text" placeholder={typePayment?.name} disabled />
                                </div>
                            </div>
                            <div className="data">
                                <div>
                                    <label>Mês</label>
                                    <input type="text" placeholder={despesa?.mes !== "N/A" ? months[Number(despesa?.mes)]?.name : "N/A"} disabled />
                                </div>
                                <div>
                                    <label>Ano</label>
                                    <input type="text" placeholder={despesa?.ano} disabled />
                                </div>
                            </div>
                            <div className="data">
                                <div>
                                    <label>Valor Total</label>
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
                        </>
                    ) : (
                        <>
                            <div className="data">
                                <div>
                                    <label>Valor</label>
                                    <input type="text" placeholder={String(currencyFormatter(Number(despesa?.valor_total) || 0))} disabled />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="container-actions">
                        <Button nameButton="Excluir" colorOptional="#ef4444" onClick={handleDelete} />
                        <Button nameButton="Editar" onClick={handleEdit} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal