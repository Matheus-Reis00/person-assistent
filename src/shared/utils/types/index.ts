export interface Usuario {
    user_id?: number
    login: string
    passoword: string
}

export interface Despesa {
    id?: string,
    user_id?: string,
    title: string,
    tipo_pagamento: string,
    mes: string,
    ano: string,
    total_parcelas: number | 'fixa',
    parcela_atual: number | 'fixa',
    valor_parcela: number,
    valor_total: number | string
}