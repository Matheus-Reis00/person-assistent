import { FC, useEffect, useState } from "react";
import { MdArrowForwardIos, MdOutlineKeyboardArrowDown, MdRemoveRedEye } from "react-icons/md"
import { FaEdit } from "react-icons/fa"
import { PiCheckCircleBold } from "react-icons/pi"
import { DespesasAvulsa, DespesaFixa } from "../../shared/utils/types";
import { months } from "../../shared/utils/statics";
import { handleSetParamsUrl } from "../../shared/utils/helpers";
import { useNavigate } from "react-router-dom";
import imgFinance from "../../shared/images/person.png"
import api from "../../shared/api";
import Button from "../../shared/components/Button";
import Modal from "../../shared/components/Modal";
import "./styles.scss"

interface IListing { }
const Listing: FC<IListing> = () => {

    const navigate = useNavigate()
    const currentUrl = new URL(window.location.href)
    const [despesasAvulsas, setDespesasAvulsas] = useState<DespesasAvulsa | null>()
    const [despesasFixas, setDespesasFixas] = useState<DespesaFixa | null>()
    const [paramsRequest, setParamsRequest] = useState<any>({
        mes: currentUrl.searchParams.get("mes") || new Date().getMonth(),
        ano: currentUrl.searchParams.get("ano") || new Date().getFullYear()
    })
    const [dropMes, setDropMes] = useState<boolean>(false)
    const [dropAno, setDropAno] = useState<boolean>(false)
    const [plus, setPlus] = useState<boolean>(false)
    const [typeDespesa, setTypeDespesa] = useState<string>("")
    const [indexDespesa, setIndexDespesa] = useState<number>(0)

    const handleGetDespesas = async (params: any = {}, type: "avulsas" | "fixas") => {
        const paramsRequest = type === "avulsas" ? params : {}

        const { data } = await api.get({
            property: `despesas_${type}`,
            query: paramsRequest
        })

        if (type === "avulsas") {
            data[0].despesas = data[0].despesas.filter((item: any) => {
                if (item.mes == paramsRequest.mes && item.ano == paramsRequest.ano) {
                    return true
                } else {
                    let teste = false
                    for (let i = 1; i < item.total_parcelas; i++) {
                        const filterMes = item.mes + i > 11 ? item.mes + i - 12 : item.mes + i
                        const filterAno = item.mes + i > 11 ? item.ano + 1 : item.ano

                        if (paramsRequest.mes == filterMes && filterAno == paramsRequest.ano) {
                            teste = true
                        }
                    }
                    return teste
                }
            })
            setDespesasAvulsas(data[0])
        } else {
            setDespesasFixas(data[0])
        }
    }

    const handleCalcDespesas = (type: 'avulsa' | 'fixa' | 'total') => {
        let value = 0
        let values: number[] = []
        switch (type) {
            case "avulsa":
                if (despesasAvulsas)
                    values = despesasAvulsas?.despesas?.map((despesa => despesa.value_parcela))
                break;
            case "fixa":
                if (despesasFixas)
                    values = despesasFixas?.despesas?.map((despesa => despesa.value))
                break;
            case "total":
                if (despesasAvulsas)
                    values = despesasAvulsas?.despesas?.map((despesa => despesa.value_parcela))
                if (despesasFixas)
                    despesasFixas?.despesas?.forEach((despesa => { values.push(despesa.value) }))
                break;
        }

        values?.forEach((valueItem) => {
            value += valueItem
        })

        return value
    }

    const handleSetTypeDespesa = (type: "fixas" | "avulsas", index: any) => {
        setTypeDespesa(type)
        setIndexDespesa(index)
        setPlus(true)
    }

    useEffect(() => {
        handleGetDespesas(paramsRequest, "fixas")
    }, [])

    useEffect(() => {
        handleGetDespesas(paramsRequest, "avulsas")
        const url = handleSetParamsUrl(window.location.href, paramsRequest)
        window.history.pushState(null, '', url)
    }, [paramsRequest])

    return (
        <div className="container-listing">
            <div className="container">
                <div className="logo">
                    <button onClick={() => navigate(`/home`)}><MdArrowForwardIos size={50} /></button>
                    <img src={imgFinance} />
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
                                <th>Despesas fixas</th>
                                <th>Despesas avulsas</th>
                                <th>Valor total</th>
                            </tr>
                            <tr>
                                <td>{handleCalcDespesas('fixa')}</td>
                                <td>{handleCalcDespesas('avulsa')}</td>
                                <td>{handleCalcDespesas('total')}</td>
                            </tr>
                        </table>
                        <div className="table-products">
                            <div className="table title">
                                <div>
                                    <span>Parcelas</span>
                                    <span>Titulo</span>
                                    <span>Valor</span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                            <div className="table products">
                                {despesasAvulsas?.despesas?.map((item, index) => (
                                    <div key={index}>
                                        <span>{item.total_parcelas}</span>
                                        <span>{item.name}</span>
                                        <span>{item.value_parcela}</span>
                                        <span onClick={() => handleSetTypeDespesa("avulsas", item.id)}><MdRemoveRedEye color="#000" size={18} /></span>
                                        <span onClick={() => navigate(`/produto/avulsa/${item.id}`)}><FaEdit color="#000" size={16} /></span>
                                        <span><PiCheckCircleBold color="#000" size={18} /></span>
                                    </div>
                                ))}
                                {despesasFixas?.despesas?.map((item, index) => (
                                    <div key={index}>
                                        <span>0</span>
                                        <span>{item.name}</span>
                                        <span>{item.value}</span>
                                        <span onClick={() => handleSetTypeDespesa("fixas", item.id)}><MdRemoveRedEye color="#000" size={18} /></span>
                                        <span onClick={() => navigate(`/produto/fixa/${item.id}`)}><FaEdit color="#000" size={16} /></span>
                                        <span><PiCheckCircleBold color="#000" size={18} /></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="new">
                            <div>
                                <Button nameButton="Nova despesa" onClick={() => navigate("/produto")}></Button>
                            </div>
                        </div>
                        {plus ? <Modal type={typeDespesa} index={indexDespesa} onClick={() => setPlus(false)} /> : ""}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Listing