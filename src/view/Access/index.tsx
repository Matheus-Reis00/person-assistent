import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../shared/utils/cookie";
import Logo from "../../shared/components/Logo";
import api from "../../shared/api";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import "./styles.scss"
import { Usuario } from "../../shared/utils/types";

interface IAccess {
    urlCadastro: string
    cadastro: string
}
const Access: FC<IAccess> = ({ urlCadastro }) => {

    const navigate = useNavigate()

    const [user, setUser] = useState<{ login: string, password: string }>({
        login: "",
        password: ""
    })
    const [errorMessage, setErrorMessage] = useState<{ login: string, password: string }>({
        login: "",
        password: ""
    })

    const handleGetUser = () => {
        api.post({
            property: "users",
            body: {
                user: {
                    name: user.login,
                    password: user.password
                },
            }
        })
            .then(({ data }) => {
                if (data?.name) {
                    const userLogged = data
                    if (user?.password === userLogged?.password) {
                        setCookie("user", JSON.stringify(userLogged), 365)
                        navigate(`/home`)
                    } else {
                        setErrorMessage({ ...errorMessage, password: "Senha incorreta" })
                    }
                } else {
                    setErrorMessage({ login: "Usuário incorreto", password: "" })
                }
            }).catch((err) => {
                console.log(err.response.data.message)
                if (!!err?.response?.data?.message) {
                    if (err.response.data.message.toLowerCase().includes("senha"))
                        setErrorMessage({ ...errorMessage, password: "Senha incorreta" })

                    if (err.response.data.message.toLowerCase().includes("usuário"))
                        setErrorMessage({ ...errorMessage, login: "Usuário incorreto" })
                }
            })
    }

    const handlePostUser = () => {
        api.post({
            property: 'users-create'
        }).then(({ data }) => {
            const findUser = data.find((data: Usuario) => data.login === user.login)

            if (findUser) {
                setErrorMessage({ ...errorMessage, login: 'Usuário ja existe' })
            } else {
                api.post({
                    property: "users",
                    body: user
                }).then(({ data }) => {
                    setCookie("user", JSON.stringify(data), 365)
                    navigate("/home")

                    api.post({
                        property: "despesas_avulsas",
                        body: {
                            user_id: data.id,
                            despesas: []
                        }
                    })

                    api.post({
                        property: "despesas_fixas",
                        body: {
                            user_id: data.id,
                            despesas: []
                        }
                    })
                })
            }
        })
    }

    return (
        <div className="container-access">
            <div className="container">
                <div className="logo">
                    <Logo />
                </div>
                <div className="container-inputs">
                    {urlCadastro === "/register" ? (
                        <>
                            <Input onChange={(e) => setUser({ ...user, login: e.target.value })} type="text" placeholder="Crie um login..." input="common" />
                            <Input onChange={(e) => setUser({ ...user, password: e.target.value })} type="text" placeholder="Crie uma senha..." input="common" />
                        </>
                    ) :
                        urlCadastro === "/login" && (
                            <>
                                <Input onChange={(e) => setUser({ ...user, login: e.target.value })} type="text" placeholder="Login..." input="common" errorMessage={errorMessage?.login || ''} />
                                <Input onChange={(e) => setUser({ ...user, password: e.target.value })} type="text" placeholder="Senha..." input="common" errorMessage={errorMessage?.password || ''} />
                            </>
                        )
                    }
                    {/* <span onClick={() => navigate(urlCadastro)}>{cadastro}</span> */}
                    <div className="button-acess">
                        {urlCadastro === "/register" ? (
                            <div>
                                <Button onClick={() => handlePostUser()} nameButton="Registrar" />
                            </div>
                        ) :
                            urlCadastro === "/login" && (
                                <div>
                                    <Button onClick={() => handleGetUser()} nameButton="Acessar" />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Access