export interface Usuario {
    id?: number
    login: string
    passoword: string
}

export interface DespesaAvulsa {
    id?: number
    name: string
    mes: number
    ano: number
    total_parcelas: number
    value_parcela: number
    total_value: number
}

export interface DespesasAvulsa {
    id?: number
    userId?: number
    despesas: DespesaAvulsa[]

}
export interface DespesaFixa {
    id?: number
    userId?: number
    despesas: {
        id?: number
        name: string
        value: number
    }[]
}

