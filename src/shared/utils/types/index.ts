export interface Usuario {
    id?: number
    login: string
    passoword: string
}

export interface Despesa {
    id?: string,
    user_id?: string,
    titulo: string,
    tipo_pagamento: string,
    mes: string,
    ano: string,
    total_parcelas: number | 'fixa',
    parcela_atual: number | 'fixa',
    valor_parcela: number,
    valor_total: number | string
}