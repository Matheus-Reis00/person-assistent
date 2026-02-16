import { FC, useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md"
import { Despesa } from "../../shared/utils/types";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { getCardsFromStorage } from "../../shared/utils/cardStorage";
import Logo from "../../shared/components/Logo";
import api from "../../shared/api";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import "./styles.scss"
import Select from "../../shared/components/Select";
import { currencyFormatter, currencyFormatterInput } from "../../shared/utils/helpers";
import { months } from "../../shared/utils/statics";



interface IProduct {
    isEditType?: 'fixa' | 'avulsa' | null
}
const Product: FC<IProduct> = ({ isEditType = null }) => {

    const { id: idDespesa, mes, ano } = useParams();

    const navigate = useNavigate()
    const [type, setType] = useState('')
    const [cards, setCards] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const [dataFieldsDespesa, setDataFieldsDespesa] = useState<Despesa>({
        id: new Date().getTime().toString(),
        title: "",
        mes: "",
        ano: new Date().getFullYear().toString(),
        parcela_atual: 1,
        total_parcelas: 1,
        tipo_pagamento: "",
        valor_parcela: 0,
        valor_total: "",
    })

    const optionsType = [{ name: "Fixa", value: "fixa" }, { name: "Avulsa", value: "avulsa" }]

    const handleChangeType = (e: any) => {
        const value = e.target.value

        if (value === 'fixa') {
            setDataFieldsDespesa({
                ...dataFieldsDespesa,
                parcela_atual: 'fixa',
                total_parcelas: 'fixa',
                mes: "N/A",
                ano: "N/A",
            })
        } else {
            setDataFieldsDespesa({
                ...dataFieldsDespesa,
                parcela_atual: 1,
                total_parcelas: 0,
                mes: new Date().getMonth().toString(),
                ano: new Date().getFullYear().toString()
            })
        }

        setType(value)
    }

    const handleFormatNumbersToSend = (value: string | number) => {
        return String(value).replace("R$", "").replace(".", "").replace(",", ".").trim()
    }

    useEffect(() => {
        handleGetCards()
        if (!!isEditType) {
            handleGetDespesa()
        }
    }, [])

    const handleGetCards = () => {
        const storedCards = getCardsFromStorage();
        if (storedCards.length > 0) {
            setCards(storedCards);
        } else {
            api.get({ property: "cartoes" }).then(({ data }) => {
                if (data) setCards(data);
            });
        }
    }

    const paymentOptions = [
        ...cards.map(card => ({ name: card.name, value: card.slug }))
    ]

    const handleGetDespesa = () => {
        if (isEditType && idDespesa) {
            api.get({
                property: "despesas",
                query: {
                    "mes-referencia": `${ano}-${mes?.toString()?.padStart(2, '0')}`
                }
            }).then(({ data }) => {
                const despesa = data.find((despesa: Despesa) => despesa.id === idDespesa)
                if (despesa) {
                    setDataFieldsDespesa({
                        ...despesa,
                        valor_total: currencyFormatter(despesa.valor_total),
                        valor_parcela: currencyFormatter(despesa.valor_parcela)
                    })
                }
            })
        }
    }

    const handleSendValue = () => {
        setIsLoading(true)
        const valor_parcela = handleFormatNumbersToSend(dataFieldsDespesa.valor_total)
        const numParcelas = dataFieldsDespesa.total_parcelas === 'fixa' ? 1 : Number(dataFieldsDespesa.total_parcelas)
        const valor_total = (Number(valor_parcela) * numParcelas).toFixed(2)
        if (!!isEditType) {

            api.put({
                property: "despesas",
                body: {
                    despesa: {
                        ...dataFieldsDespesa,
                        id: idDespesa,
                        title: dataFieldsDespesa.title || "N/A",
                        valor_total: valor_total,
                        valor_parcela: valor_parcela,
                        total_parcelas: String(dataFieldsDespesa.total_parcelas),
                        parcela_atual: String(dataFieldsDespesa.parcela_atual),
                        mes: String(dataFieldsDespesa.mes),
                        ano: String(dataFieldsDespesa.ano)
                    }
                }
            }).then(() => {
                navigate('/produtos')
            }).finally(() => setIsLoading(false))
        } else {
            api.post({
                property: "despesas",
                body: {
                    despesa: {
                        ...dataFieldsDespesa,
                        title: dataFieldsDespesa.title || "N/A",
                        valor_total: valor_total,
                        valor_parcela: valor_parcela,
                        total_parcelas: String(dataFieldsDespesa.total_parcelas),
                        parcela_atual: String(dataFieldsDespesa.parcela_atual),
                    }
                }
            }).then(() => {
                navigate('/produtos')
            }).finally(() => setIsLoading(false))
        }
    }

    useEffect(() => {
        if (!dataFieldsDespesa.tipo_pagamento || dataFieldsDespesa.total_parcelas === 'fixa') return

        const dia_atual = new Date().getDate()
        const paymentList = cards;
        const card = paymentList.find((option) => (option.value || option.slug) === dataFieldsDespesa.tipo_pagamento)
        const dia_vencimento = card?.dia_vencimento || card?.data_vencimento

        let formatedMonth: any = dia_vencimento && dia_atual > dia_vencimento ? new Date().getMonth() + 1 : new Date().getMonth()
        let formatedYear: any = new Date().getFullYear()

        if (formatedMonth === 12) {
            formatedMonth = 0
            formatedYear = new Date().getFullYear() + 1
        }

        setDataFieldsDespesa({
            ...dataFieldsDespesa,
            mes: String(formatedMonth),
            ano: String(formatedYear)
        })
    }, [dataFieldsDespesa.tipo_pagamento])

    return (
        <div className="container-product">
            <div className="container">
                <div className="logo">
                    <button onClick={() => {
                        if (isEditType) {
                            navigate(`/produtos?mes-referencia=${ano}-${mes?.toString()?.padStart(2, '0')}`);
                        } else {
                            navigate('/home');
                        }
                    }}>
                        <MdArrowForwardIos size={50} />
                    </button>
                    <div className="logo-container">
                        <Logo />
                    </div>
                </div>

                <div className="container-fields">
                    <div className="container-one">
                        <Select value={type} onChange={handleChangeType} placeholder="Tipo de despesa" options={optionsType} />
                    </div>

                    {!!type && (
                        <>
                            <div className="container-one">
                                <Input input="common" value={dataFieldsDespesa.title} onChange={(e) => setDataFieldsDespesa({ ...dataFieldsDespesa, title: e.target.value })} type="text" placeholder="Título" />
                            </div>

                            <div className="container-one">
                                <label>Tipo de pagamento</label>
                                <Select
                                    onChange={(e) => setDataFieldsDespesa({ ...dataFieldsDespesa, tipo_pagamento: e.target.value })}
                                    options={paymentOptions}
                                    value={dataFieldsDespesa.tipo_pagamento}
                                />
                            </div>
                            <div className="container-one">
                                <Select value={String(dataFieldsDespesa.mes)} onChange={(e) => setDataFieldsDespesa({ ...dataFieldsDespesa, mes: e.target.value })} placeholder="Mês Referência" options={months.map((month, index) => ({ name: month.name, value: String(index) }))} />
                            </div>

                            {dataFieldsDespesa.parcela_atual !== 'fixa' && (
                                <>
                                    <div className="container-two">
                                        <Select value={dataFieldsDespesa.total_parcelas} onChange={(e) => setDataFieldsDespesa({ ...dataFieldsDespesa, total_parcelas: parseInt(e.target.value) })} placeholder="Qtde parcelas" options={Array.from({ length: 12 }).map((_, i) => ({ name: (i + 1).toString(), value: (i + 1) }))} />
                                        <Input input="common" value={dataFieldsDespesa.valor_total} onChange={(e) => setDataFieldsDespesa({ ...dataFieldsDespesa, valor_total: currencyFormatterInput(e.target.value) })} type="text" placeholder="Valor parcela" />
                                    </div>
                                </>
                            )}

                            {dataFieldsDespesa.parcela_atual === 'fixa' && (
                                <>
                                    <Input input="common" value={dataFieldsDespesa.valor_total} onChange={(e) => setDataFieldsDespesa({ ...dataFieldsDespesa, valor_total: currencyFormatterInput(e.target.value) })} type="text" placeholder="Valor total" />
                                </>
                            )}
                        </>
                    )}

                    {!!type && (
                        <div className="container-two" style={{ marginTop: "20px" }}>
                            <Button nameButton="Cancelar" colorOptional="red" onClick={() => navigate("/home")} disabled={isLoading} />
                            <Button nameButton={!!isEditType ? "Editar" : "Cadastrar"} onClick={handleSendValue} disabled={!dataFieldsDespesa.valor_total || !dataFieldsDespesa.tipo_pagamento || !dataFieldsDespesa.mes || !type} loading={isLoading} />
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

export default Product