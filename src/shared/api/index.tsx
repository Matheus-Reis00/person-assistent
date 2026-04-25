import axios from "axios";
import { IRequest, IRequestGet, IRequestPost } from "../utils/types/request.interface";
import { getCookie } from "../utils/cookie";

class Api {
    private apiUrl = "" as string;

    private config = (req: IRequest) => {
        switch (req.property) {
            case "users":
                this.apiUrl = `${import.meta.env.VITE_BASE_URL}/users/login`
                break;
            case "user-create":
                this.apiUrl = `${import.meta.env.VITE_BASE_URL}/users/create`
                break;
            case "despesas":
                this.apiUrl = `${import.meta.env.VITE_BASE_URL}/despesas`
                break;
            case "cartoes":
                this.apiUrl = `${import.meta.env.VITE_BASE_URL}/cartoes`
                break;
            case "relatorio-detalhado":
                this.apiUrl = `${import.meta.env.VITE_BASE_URL}/despesas/relatorio-detalhado`
                break;
        }
    }

    get(req: IRequestGet) {
        this.config(req)
        let query: string = "";
        let objQueryes: any = req.query || {};
        let id

        if (objQueryes?.id) {
            id = objQueryes.id
            delete objQueryes.id
        }

        if (getCookie("user")) {
            const userLogged = JSON.parse(decodeURIComponent(getCookie("user")))
            objQueryes.user_id = userLogged.id
        }
        if (req.query || objQueryes) {
            query = new URLSearchParams(objQueryes).toString()
        }

        return axios.get(`${this.apiUrl}${id ? '/' + id : ''}/?${query}`)
    }

    post(req: IRequestPost) {
        this.config(req)

        if (getCookie("user")) {
            const userLogged = JSON.parse(decodeURIComponent(getCookie("user")))
            if (userLogged.id)
                if (req.body.despesa) {
                    req.body.despesa.user_id = userLogged.id
                } else {
                    req.body.user_id = userLogged.id
                }
        }

        return axios.post(`${this.apiUrl}`, req.body)
    }

    put(req: IRequestPost) {
        this.config(req)

        if (getCookie("user")) {
            const userLogged = JSON.parse(decodeURIComponent(getCookie("user")))
            if (userLogged.id) {
                if (req.body.despesa) {
                    req.body.despesa.user_id = userLogged.id
                } else {
                    req.body.user_id = userLogged.id
                }
            }
        }

        return axios.put(`${this.apiUrl}`, req.body)
    }

    delete(req: IRequestGet) {
        this.config(req)
        let query: string = "";
        let objQueryes: any = req.query || {};
        let id

        if (objQueryes?.id) {
            id = objQueryes.id
            delete objQueryes.id
        }

        if (getCookie("user")) {
            const userLogged = JSON.parse(decodeURIComponent(getCookie("user")))
            objQueryes.user_id = userLogged.id
        }

        if (req.query || objQueryes) {
            query = new URLSearchParams(objQueryes).toString()
        }

        return axios.delete(`${this.apiUrl}${id ? '/' + id : ''}/?${query}`)
    }
}

export default new Api()