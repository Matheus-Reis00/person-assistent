import { FC, useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md"
import { Despesa } from "../../shared/utils/types";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Logo from "../../shared/components/Logo";
import api from "../../shared/api";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import "./styles.scss"
import Select from "../../shared/components/Select";
import { currencyFormatter, currencyFormatterInput } from "../../shared/utils/helpers";
import { optionsTypePayment } from "../../shared/statics/optionsTypePayment";
import { months } from "../../shared/utils/statics";



interface IProduct {
    isEditType?: 'fixa' | 'avulsa' | null
}
const Product: FC<IProduct> = ({ isEditType = null }) => {

    const { id: idDespesa, mes, ano } = useParams();

    const navigate = useNavigate()
    const [type, setType] = useState('avulsa')

    const [dataFieldsDespesa, setDataFieldsDespesa] = useState<Despesa>({
        id: new Date().getTime().toString(),
        title: "",
        mes: new Date().getMonth().toString(),
        ano: new Date().getFullYear().toString(),
        parcela_atual: 1,
        total_parcelas: 1, // Inicializa com 1 parcela
        tipo_pagamento: optionsTypePayment[0].value, // Inicializa com o primeiro cartão
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

    const handleSendValue = () => {
        if (!!isEditType) {
            api.put({
                property: "despesas",
                body: {
                    despesa: {
                        ...dataFieldsDespesa,
                        id: idDespesa,
                        title: dataFieldsDespesa.title || "N/A",
                        valor_total: handleFormatNumbersToSend(dataFieldsDespesa.valor_total),
                        valor_parcela: typeof dataFieldsDespesa.total_parcelas === 'number' ? (Number(handleFormatNumbersToSend(dataFieldsDespesa.valor_total)) / dataFieldsDespesa.total_parcelas).toFixed(2) : dataFieldsDespesa.total_parcelas,
                        total_parcelas: String(dataFieldsDespesa.total_parcelas),
                        parcela_atual: String(dataFieldsDespesa.parcela_atual),
                        mes: String(dataFieldsDespesa.mes),
                        ano: String(dataFieldsDespesa.ano)
                    }
                }
            }).then(() => {
                navigate('/produtos')
            })
        } else {
            const total_formated = handleFormatNumbersToSend(dataFieldsDespesa.valor_total)
            const valor_parcela = typeof dataFieldsDespesa.total_parcelas === 'number' ? (Number(total_formated) / dataFieldsDespesa.total_parcelas).toFixed(2) : dataFieldsDespesa.total_parcelas

            api.post({
                property: "despesas",
                body: {
                    despesa: {
                        ...dataFieldsDespesa,
                        title: dataFieldsDespesa.title || "N/A",
                        valor_total: total_formated,
                        valor_parcela: valor_parcela,
                        total_parcelas: String(dataFieldsDespesa.total_parcelas),
                        parcela_atual: String(dataFieldsDespesa.parcela_atual),
                    }
                }
            }).then(() => {
                navigate('/produtos')
            })
        }
    }

    useEffect(() => {
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
    }, [isEditType])

    useEffect(() => {
        if (dataFieldsDespesa.tipo_pagamento === 'fixa') return

        const dia_atual = new Date().getDate()
        const dia_vencimento = optionsTypePayment.find((option) => option.value === dataFieldsDespesa.tipo_pagamento)?.dia_vencimento

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
                    <button onClick={() => navigate(-1)}><MdArrowForwardIos size={50} /></button>
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
                                <Select value={dataFieldsDespesa.tipo_pagamento} onChange={(e) => setDataFieldsDespesa({ ...dataFieldsDespesa, tipo_pagamento: e.target.value })} placeholder="Tipo pagamento" options={optionsTypePayment} />
                            </div>

                            <div className="container-one">
                                <Select value={String(dataFieldsDespesa.mes)} onChange={(e) => setDataFieldsDespesa({ ...dataFieldsDespesa, mes: e.target.value })} placeholder="Mês Referência" options={months.map((month, index) => ({ name: month.name, value: String(index) }))} />
                            </div>

                            {dataFieldsDespesa.parcela_atual !== 'fixa' && (
                                <>
                                    <div className="container-two">
                                        <Select value={dataFieldsDespesa.total_parcelas} onChange={(e) => setDataFieldsDespesa({ ...dataFieldsDespesa, total_parcelas: parseInt(e.target.value) })} placeholder="Qtde parcelas" options={Array.from({ length: 12 }).map((_, i) => ({ name: (i + 1).toString(), value: (i + 1) }))} />
                                        <Input input="common" value={dataFieldsDespesa.valor_total} onChange={(e) => setDataFieldsDespesa({ ...dataFieldsDespesa, valor_total: currencyFormatterInput(e.target.value) })} type="text" placeholder="Valor total" />
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
                        <div className="container-two" style={{ maxWidth: '240px', marginLeft: "auto", marginTop: "20px" }}>
                            <Button nameButton="Cancelar" colorOptional="red" onClick={() => navigate("/home")} />
                            <Button nameButton={!!isEditType ? "Editar" : "Cadastrar"} onClick={handleSendValue} disabled={!dataFieldsDespesa.valor_total || !dataFieldsDespesa.tipo_pagamento} />
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

export default Product