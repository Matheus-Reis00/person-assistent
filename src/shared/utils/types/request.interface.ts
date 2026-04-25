export interface IRequest {
    property: string;
}

export interface IRequestGet extends IRequest {
    query?: {
        id?: number | string;
        user_id?: number;
        user?: {
            name: string,
            password: string
        }
        login?: string;
        password?: string;
        "mes-referencia"?: string;
        "mes-referencia-fim"?: string;
    }
}
export interface IRequestPost extends IRequest {
    body?: any
}