import { FC, useState } from "react";
import { MdArrowForwardIos, MdClose } from "react-icons/md";
import { months } from "../../shared/utils/statics";
import { currencyFormatter } from "../../shared/utils/helpers";
import { useNavigate } from "react-router-dom";
import Logo from "../../shared/components/Logo";
import api from "../../shared/api";
import "./styles.scss";

interface FormaPagamentoTotal {
    tipo_pagamento: string;
    total_consolidado: number;
}

interface IDetailedReport { }

const DetailedReport: FC<IDetailedReport> = () => {
    const navigate = useNavigate();

    const [startMes, setStartMes] = useState<string>("");
    const [startAno, setStartAno] = useState<string>("");

    const [endMes, setEndMes] = useState<string>("");
    const [endAno, setEndAno] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [rawData, setRawData] = useState<any[]>([]);
    const [aggregatedData, setAggregatedData] = useState<FormaPagamentoTotal[]>([]);
    const [totalGeral, setTotalGeral] = useState<number>(0);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    // Modal state
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

    const anosDisponiveis = Array.from({ length: 10 }).map((_, i) => new Date().getFullYear() - 5 + i);

    const handleSearch = async () => {
        if (!startMes || !startAno || !endMes || !endAno) {
            alert("Por favor, preencha todos os campos do período.");
            return;
        }

        setLoading(true);
        setHasSearched(true);
        setAggregatedData([]);
        setRawData([]);
        setTotalGeral(0);

        const mesInicioFmt = `${startAno}-${String(Number(startMes)).padStart(2, '0')}`;
        const mesFimFmt = `${endAno}-${String(Number(endMes)).padStart(2, '0')}`;

        try {
            // Requisição única passando o período para o backend usando mes-referencia e mes-referencia-fim
            const res: any = await api.get({
                property: 'relatorio-detalhado',
                query: {
                    "mes-referencia": mesInicioFmt,
                    "mes-referencia-fim": mesFimFmt
                }
            });

            const data = res.data;
            if (data && data.length > 0) {
                setRawData(data);
            } else {
                setRawData([]);
            }

            const mapTotais = new Map<string, number>();
            let tGeral = 0;

            if (data && data.length > 0) {
                // A API suporta range, então agregamos os dados já filtrados pelo servidor
                data.forEach((relatorio: any) => {
                    if (relatorio && relatorio.formas_pagamento) {
                        relatorio.formas_pagamento.forEach((f: any) => {
                            const currentVal = mapTotais.get(f.tipo_pagamento) || 0;
                            const addedVal = Number(f.total_tipo) || 0;
                            mapTotais.set(f.tipo_pagamento, currentVal + addedVal);
                            tGeral += addedVal;
                        });
                    }
                });
            }

            const resultArr: FormaPagamentoTotal[] = [];
            mapTotais.forEach((val, key) => {
                resultArr.push({ tipo_pagamento: key, total_consolidado: val });
            });

            // Sort by highest total
            resultArr.sort((a, b) => b.total_consolidado - a.total_consolidado);

            setAggregatedData(resultArr);
            setTotalGeral(tGeral);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getHistoryForMethod = () => {
        if (!selectedPaymentMethod || rawData.length === 0) return [];
        
        const history: { mesReferencia: string; total: number }[] = [];
        
        rawData.forEach((relatorio: any) => {
            if (relatorio && relatorio.formas_pagamento) {
                const methodData = relatorio.formas_pagamento.find((f: any) => f.tipo_pagamento === selectedPaymentMethod);
                if (methodData) {
                    history.push({
                        mesReferencia: relatorio.mesReferencia,
                        total: Number(methodData.total_tipo) || 0
                    });
                }
            }
        });

        // Ordena histórico em ordem crescente pelo mês de referência
        history.sort((a, b) => a.mesReferencia.localeCompare(b.mesReferencia));
        return history;
    };

    const historyData = getHistoryForMethod();

    return (
        <div className="container-detailed-report">
            <div className="container">
                <div className="logo">
                    <button onClick={() => navigate('/home')}><MdArrowForwardIos size={50} /></button>
                    <div className="logo-container">
                        <Logo />
                    </div>
                </div>

                <div className="form-periodo">
                    <h3 className="titulo-secao">Filtrar por Período</h3>

                    <div className="row-inputs">
                        <div className="col-input">
                            <label>Início</label>
                            <div className="select-group">
                                <select value={startMes} onChange={e => setStartMes(e.target.value)}>
                                    <option value="" disabled>Mês</option>
                                    {months.map(m => (
                                        <option key={m.value} value={m.value}>{m.name}</option>
                                    ))}
                                </select>
                                <select value={startAno} onChange={e => setStartAno(e.target.value)}>
                                    <option value="" disabled>Ano</option>
                                    {anosDisponiveis.map(a => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-input">
                            <label>Fim</label>
                            <div className="select-group">
                                <select value={endMes} onChange={e => setEndMes(e.target.value)}>
                                    <option value="" disabled>Mês</option>
                                    {months.map(m => (
                                        <option key={m.value} value={m.value}>{m.name}</option>
                                    ))}
                                </select>
                                <select value={endAno} onChange={e => setEndAno(e.target.value)}>
                                    <option value="" disabled>Ano</option>
                                    {anosDisponiveis.map(a => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button className="btn-search" onClick={handleSearch} disabled={loading}>
                        {loading ? 'Consolidando...' : 'Buscar Valores'}
                    </button>
                    
                </div>

                <div className="resultados">
                    {loading && <p className="loading-text">Buscando relatórios, por favor aguarde...</p>}

                    {!loading && hasSearched && aggregatedData.length === 0 && (
                        <p className="empty-text">Nenhum valor encontrado para o período selecionado.</p>
                    )}

                    {!loading && aggregatedData.length > 0 && (
                        <>
                            <table className="table-total">
                                <tbody>
                                    <tr>
                                        <th>Total Consolidado no Período</th>
                                        <th>{currencyFormatter(totalGeral)}</th>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="totais-cartoes">
                                {aggregatedData.map((item, idx) => (
                                    <div 
                                      key={idx} 
                                      className="cartao-card clickable" 
                                      onClick={() => {
                                          setSelectedPaymentMethod(item.tipo_pagamento);
                                          setModalOpen(true);
                                      }}
                                    >
                                        <span className="nome">{item.tipo_pagamento}</span>
                                        <span className="valor">{currencyFormatter(item.total_consolidado)}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                
                {/* Modal de Detalhes Mensais da Forma de Pagamento */}
                {modalOpen && (
                    <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{selectedPaymentMethod}</h3>
                                <button className="btn-close" onClick={() => setModalOpen(false)}>
                                    <MdClose size={24} />
                                </button>
                            </div>
                            <div className="modal-body">
                                {historyData.length > 0 ? (
                                    <table className="table-history">
                                        <thead>
                                            <tr>
                                                <th>Mês/Ano</th>
                                                <th>Total Pago</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {historyData.map((hist, i) => {
                                                const [a, m] = hist.mesReferencia.split('-');
                                                const mesNome = months.find(x => x.value === String(Number(m)))?.name || m;
                                                return (
                                                    <tr key={i}>
                                                        <td>{mesNome}/{a}</td>
                                                        <td className="valor">{currencyFormatter(hist.total)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="empty-text">Sem histórico para esta forma de pagamento.</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <div className="totalizador">
                                    <span>Total: </span>
                                    <span className="valor">
                                        {currencyFormatter(historyData.reduce((acc, obj) => acc + obj.total, 0))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default DetailedReport;
