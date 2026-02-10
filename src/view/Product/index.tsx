import { FC, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md"
import { Despesa } from "../../shared/utils/types";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import imgFinance from "../../shared/images/person.png"
import api from "../../shared/api";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import "./styles.scss"
import Select from "../../shared/components/Select";
import { currencyFormatterInput } from "../../shared/utils/helpers";
import { optionsTypePayment } from "../../shared/statics/optionsTypePayment";



interface IProduct {
    isEditType?: 'fixa' | 'avulsa' | null
}
const Product: FC<IProduct> = ({ isEditType = null }) => {

    const { id: idDespesa } = useParams();

    console.log(idDespesa, isEditType)

    const navigate = useNavigate()
    const [type, setType] = useState('avulsa')

    const [dataFieldsDespesa, setDataFieldsDespesa] = useState<Despesa>({
        id: new Date().getTime().toString(),
        title: "",
        mes: new Date().getMonth().toString(),
        ano: new Date().getFullYear().toString(),
        parcela_atual: 1,
        total_parcelas: 0,
        tipo_pagamento: '',
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
        const total_formated = handleFormatNumbersToSend(dataFieldsDespesa.valor_total)
        const valor_parcela = typeof dataFieldsDespesa.total_parcelas === 'number' ? (Number(total_formated) / dataFieldsDespesa.total_parcelas).toFixed(2) : dataFieldsDespesa.total_parcelas

        const dia_atual = new Date().getDate()
        const dia_vencimento = optionsTypePayment.find((option) => option.value === dataFieldsDespesa.tipo_pagamento)?.dia_vencimento

        let formatedMonth = dia_vencimento && dia_atual > dia_vencimento ? new Date().getMonth() + 1 : new Date().getMonth()
        let formatedYear = new Date().getFullYear()

        if (formatedMonth === 12) {
            formatedMonth = 0
            formatedYear = new Date().getFullYear() + 1
        }

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
                    mes: String(formatedMonth),
                    ano: String(formatedYear)
                }
            }
        }).then(() => {
            navigate('/produtos')
        })
    }

    return (
        <div className="container-product">
            <div className="container">
                <div className="logo">
                    <button onClick={() => navigate(-1)}><MdArrowForwardIos size={50} /></button>
                    <img src={imgFinance} />
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
                            <Button nameButton="Cadastrar" onClick={handleSendValue} disabled={!dataFieldsDespesa.valor_total || !dataFieldsDespesa.tipo_pagamento} />
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

export default Product