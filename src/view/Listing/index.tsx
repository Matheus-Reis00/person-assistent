import { FC, useEffect, useState } from "react";
import { MdArrowForwardIos, MdOutlineKeyboardArrowDown } from "react-icons/md"

import { months } from "../../shared/utils/statics";
import { currencyFormatter, handleSetParamsUrl } from "../../shared/utils/helpers";
import { useNavigate } from "react-router-dom";
import { getCardsFromStorage } from "../../shared/utils/cardStorage";
import Logo from "../../shared/components/Logo";
import api from "../../shared/api";
import Button from "../../shared/components/Button";
import Modal from "../../shared/components/Modal";
import ModalVirada from "../../shared/components/ModalVirada";
import "./styles.scss"
import { Despesa } from "../../shared/utils/types";
import { optionsTypePayment } from "../../shared/statics/optionsTypePayment";

interface IListing { }
const Listing: FC<IListing> = () => {

    const navigate = useNavigate()
    const currentUrl = new URL(window.location.href)
    const [despesasAvulsas, setDespesasAvulsas] = useState<Despesa[]>([])
    const [despesasFixas, setDespesasFixas] = useState<Despesa[]>([])
    const [paramsRequest, setParamsRequest] = useState<any>({
        mes: currentUrl.searchParams.get("mes") || new Date().getMonth(),
        ano: currentUrl.searchParams.get("ano") || new Date().getFullYear()
    })
    const [dropMes, setDropMes] = useState<boolean>(false)
    const [dropAno, setDropAno] = useState<boolean>(false)
    const [plus, setPlus] = useState<boolean>(false)
    const [typeDespesa, setTypeDespesa] = useState<string>("")
    const [despesaSelected, setDespesaSelected] = useState<Despesa | null>(null)
    const [showViradaModal, setShowViradaModal] = useState<boolean>(false)
    const [cardData, setCardData] = useState<{ name: string, dia: number, id?: string } | null>(null)
    const [cards, setCards] = useState<any[]>([])

    const handleGetDespesas = async (params: any = {}) => {
        const paramsRequest = params

        const { data }: any = await api.get({
            property: `despesas`,
            query: { "mes-referencia": paramsRequest.ano + '-' + params.mes.toString().padStart(2, '0') }
        }).catch(() => {
            alert("Erro ao buscar despesas")
            setDespesasAvulsas([])
            setDespesasFixas([])
            return []
        })

        let avulsas: Despesa[] = []
        let fixas: Despesa[] = []

        data.forEach((item: Despesa) => {
            if (item.total_parcelas === 'fixa')
                fixas.push(item)
            else
                avulsas.push(item)
        })

        setDespesasAvulsas(avulsas)
        setDespesasFixas(fixas)
    }

    const handleCalcDespesasByCalc = () => {
        let despesas: any[] = []
        const paymentList = cards.length > 0 ? cards : optionsTypePayment;

        paymentList.forEach((item) => {
            let totalValue = 0

            const despesasByPayment = despesasAvulsas.filter((despesa) => despesa.tipo_pagamento === (item.value || item.slug))

            if (despesasByPayment.length > 0) {
                despesasByPayment.forEach((despesa) => {
                    totalValue += Number(despesa.valor_parcela) || Number(despesa.valor_total)
                })
            }

            despesas.push({
                id: item.id || item.value,
                name: item.name,
                totalValue: totalValue.toFixed(2)
            })
        })

        return despesas
    }

    const handleCalcDespesas = (type: 'avulsa' | 'fixa' | 'total') => {
        let value = 0
        let values: any[] = []
        switch (type) {
            case "avulsa":
                if (despesasAvulsas)
                    values = despesasAvulsas?.map((despesa => despesa.valor_parcela))
                break;
            case "fixa":
                if (despesasFixas)
                    values = despesasFixas?.map((despesa => despesa.valor_parcela))
                break;
            case "total":
                if (despesasAvulsas)
                    values = despesasAvulsas?.map((despesa => despesa.valor_parcela))
                if (despesasFixas)
                    despesasFixas?.forEach((despesa => { values.push(despesa.valor_parcela) }))
                break;
        }

        values?.forEach((valueItem) => {
            value += valueItem
        })

        return value.toFixed(2)
    }

    const handleSetTypeDespesa = (type: "fixas" | "avulsas", index: any) => {
        setTypeDespesa(type)
        setDespesaSelected(index)
        setPlus(true)
    }

    const handleShowVirada = (name: string) => {
        const paymentList = cards.length > 0 ? cards : optionsTypePayment;
        const card = paymentList.find(opt => opt.name === name);
        if (card && (card.dia_vencimento || card.data_vencimento)) {
            setCardData({
                id: card.id,
                name: card.name,
                dia: (card.dia_vencimento || card.data_vencimento) + 1
            });
            setShowViradaModal(true);
        }
    }

    const handleGetCards = () => {
        const storedCards = getCardsFromStorage();
        if (storedCards.length > 0) {
            setCards(storedCards);
        } else {
            // Fallback para API caso o storage esteja vazio (garantia extra)
            api.get({ property: "cartoes" }).then(({ data }) => {
                if (data) setCards(data);
            });
        }
    }

    useEffect(() => {
        handleGetDespesas(paramsRequest)
        handleGetCards()
        const url = handleSetParamsUrl(window.location.href, paramsRequest)
        window.history.pushState(null, '', url)
    }, [paramsRequest])

    console.log(despesasAvulsas)

    return (
        <div className="container-listing">
            <div className="container">
                <div className="logo">
                    <button onClick={() => navigate('/home')}><MdArrowForwardIos size={50} /></button>
                    <div className="logo-container">
                        <Logo />
                    </div>
                </div>
                <div className="separet">
                    <div className="date">
                        <div>
                            <div>
                                <input type="button" value={months[paramsRequest.mes].name} onClick={() => dropMes ? setDropMes(false) : setDropMes(true)} />
                                <MdOutlineKeyboardArrowDown className="arrow" onClick={() => dropMes ? setDropMes(false) : setDropMes(true)} />
                                <div className={`${dropMes ? "drop" : ""}`}>
                                    {months?.map((month, index) => (
                                        <input type="button" value={month.name} key={index} onClick={() => { setParamsRequest({ ...paramsRequest, mes: month.value }); setDropMes(false) }} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <input type="button" value={paramsRequest.ano} onClick={() => dropAno ? setDropAno(false) : setDropAno(true)} />
                                <MdOutlineKeyboardArrowDown className="arrow" onClick={() => dropAno ? setDropAno(false) : setDropAno(true)} />
                                <div className={`${dropAno ? "drop" : ""}`}>
                                    {/* @ts-ignore */}
                                    {Array.from({ length: 5 }).map((item, index) => {
                                        const ano = new Date().getFullYear() + index
                                        return (
                                            <input type="button" value={ano} key={index} onClick={() => { setParamsRequest({ ...paramsRequest, ano: ano }); setDropAno(false) }} />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-tables">
                        <table className="table-total">
                            <tr>
                                <th>Titulo</th>
                                <th>Valor</th>
                            </tr>
                            {handleCalcDespesasByCalc().map((item, index) => (
                                <>
                                    <tr key={index} onClick={() => handleShowVirada(item.name)} style={{ cursor: 'pointer' }}>
                                        <th>{item.name}</th>
                                        <th>{currencyFormatter(item.totalValue)}</th>
                                    </tr>
                                </>
                            ))}
                            <tr>
                                <th>Fixa</th>
                                <th>{currencyFormatter(Number(handleCalcDespesas('fixa')))}</th>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td>{currencyFormatter(Number(handleCalcDespesas('total')))}</td>
                            </tr>
                        </table>
                        <div className="new">
                            <div>
                                <Button nameButton="Nova despesa" onClick={() => navigate("/produto")}></Button>
                            </div>
                        </div>
                        <div className="table-products">
                            <div className="table title">
                                <div>
                                    <span>Parcela</span>
                                    <span>Titulo</span>
                                    <span>Valor</span>
                                    <span>Cartão</span>
                                </div>
                            </div>
                            <div className="table products">
                                {despesasAvulsas?.map((item, index) => (
                                    <div key={index} className="product-row" onClick={() => handleSetTypeDespesa("avulsas", item)}>
                                        <span>{Number(item?.total_parcelas) > 1 ? item?.parcela_atual + "/" : ''}{item?.total_parcelas}</span>
                                        <span>{item.title}</span>
                                        <span>{currencyFormatter(item.valor_parcela)}</span>
                                        <span dangerouslySetInnerHTML={{ __html: optionsTypePayment.find(opt => opt.value === item.tipo_pagamento)?.name?.replace(" ", "<br/>") || 'N/A' }}></span>
                                    </div>
                                ))}
                                {despesasFixas?.map((item, index) => (
                                    <div key={index} className="product-row" onClick={() => handleSetTypeDespesa("fixas", item)}>
                                        <span>fixa</span>
                                        <span>{item.title}</span>
                                        <span>{currencyFormatter(item.valor_parcela)}</span>
                                        <span dangerouslySetInnerHTML={{ __html: optionsTypePayment.find(opt => opt.value === item.tipo_pagamento)?.name?.replace(" ", "<br/>") || 'N/A' }}></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {(plus && despesaSelected) ? <Modal despesa={despesaSelected} type={typeDespesa} onClick={() => setPlus(false)} /> : ""}
                        {showViradaModal && cardData && (
                            <ModalVirada
                                id={cardData.id}
                                cardName={cardData.name}
                                diaVirada={cardData.dia}
                                onClick={() => setShowViradaModal(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Listing