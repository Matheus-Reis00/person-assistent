export interface IRequest {
    property: string;
}

export interface IRequestGet extends IRequest {
    query?: {
        id?: number;
        user_id?: number;
        login?: string;
        password?: string;
    }
}
export interface IRequestPost extends IRequest {
    body?: any
}