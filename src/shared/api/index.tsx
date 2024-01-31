import axios from "axios";
import { IRequest, IRequestGet, IRequestPost } from "../utils/types/request.interface";
import { getCookie } from "../utils/cookie";

class Api {
    private apiUrl = "" as string;

    private config = (req: IRequest) => {
        switch (req.property) {
            case "users":
                this.apiUrl = `${import.meta.env.VITE_BASE_URL}/users`
                break;
            case "despesas_fixas":
                this.apiUrl = `${import.meta.env.VITE_BASE_URL}/despesas_fixas`
                break;
            case "despesas_avulsas":
                this.apiUrl = `${import.meta.env.VITE_BASE_URL}/despesas_avulsas`
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
            const userLogged = JSON.parse(getCookie("user"))
            objQueryes.user_id = userLogged.id
        }
        if (req.query || objQueryes) {
            query = new URLSearchParams(objQueryes).toString()
        }

        console.log(`${this.apiUrl}${id ? '/' + id : ''}/?${query}`)

        return axios.get(`${this.apiUrl}${id ? '/' + id : ''}/?${query}`)
    }

    post(req: IRequestPost) {
        this.config(req)

        if (getCookie("user")) {
            let userLogged = JSON.parse(getCookie("user"))

            if (userLogged.id)
                req.body.user_id = userLogged.id
        }

        return axios.post(`${this.apiUrl}`, req.body)
    }

    put(req: IRequestPost) {
        this.config(req)

        if (this.apiUrl.includes('/users') && getCookie("user")) {
            const userLogged = JSON.parse(getCookie("user"))
            req.body.id = userLogged.id
        }

        return axios.put(`${this.apiUrl}/${req.body.id}`, req.body)
    }
}

export default new Api()