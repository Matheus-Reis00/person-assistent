import { FC, useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai"
import { months } from "../../../shared/utils/statics";
import api from "../../api";
import "./styles.scss"

interface IModal {
    onClick?: () => void;
    type?: string
    index?: any
}

const Modal: FC<IModal> = ({ onClick, type, index }) => {

    const [despesa, setDespesa] = useState<any[]>([])

    const handleGetProducts = async () => {
        await api.get({
            property: `despesas_${type}`
        })
            .then(({ data }) => {
                if (type == "avulsas") {
                    setDespesa(data[0].despesas.filter((product: any) => product.id === index))
                }
                if (type == "fixas") {
                    setDespesa(data[0].despesas.filter((product: any) => product.id === index))
                }
            })
    }
    useEffect(() => {
        handleGetProducts()
    }, [])

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
                        {despesa.map((item, index) => (
                            <div className="container-data" key={index}>
                                <div className="data">
                                    <div>
                                        <label>Título</label>
                                        <input type="text" placeholder={item.name} disabled />
                                    </div>
                                </div>
                                <div className="data">
                                    <div>
                                        <label>Mês</label>
                                        <input type="text" placeholder={months[item.mes].name} disabled />
                                    </div>
                                    <div>
                                        <label>Ano</label>
                                        <input type="text" placeholder={item.ano} disabled />
                                    </div>
                                </div>
                                <div className="data">
                                    <div>
                                        <label>Valor</label>
                                        <input type="text" placeholder={item.total_value} disabled />
                                    </div>
                                    <div>
                                        <label>Parcelas</label>
                                        <input type="text" placeholder={item.total_parcelas} disabled />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : type === "fixas" && (
                    <>
                        {despesa.map((item, index) => (
                            <div className="container-data" key={index}>
                                <div className="data">
                                    <div>
                                        <label>Título</label>
                                        <input type="text" placeholder={item.name} disabled />
                                    </div>
                                </div>
                                <div className="data">
                                    <div>
                                        <label>Valor</label>
                                        <input type="text" placeholder={item.value} disabled />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )

                }


            </div>
        </div>
    )
}

export default Modal