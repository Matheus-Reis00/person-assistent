import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../shared/utils/cookie";
import { saveCardsToStorage } from "../../shared/utils/cardStorage";
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
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleGetUser = () => {
        setIsLoading(true)
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

                        // Busca e salva cartões no login
                        api.get({ property: "cartoes" }).then(({ data }) => {
                            if (data) saveCardsToStorage(data);
                            navigate(`/home`)
                        }).catch(() => navigate(`/home`));

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
                setIsLoading(false)
            })
    }

    const handlePostUser = () => {
        setIsLoading(true)
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
                    saveCardsToStorage([]) // Inicializa vazio para novo usuário
                    navigate("/home")

                    api.post({
                        property: "despesas_avulsas",
                        body: {
                            user_id: data.user_id,
                            despesas: []
                        }
                    })

                    api.post({
                        property: "despesas_fixas",
                        body: {
                            user_id: data.user_id,
                            despesas: []
                        }
                    })
                })
            }
            setIsLoading(false)
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
                            <Input onChange={(e) => setUser({ ...user, password: e.target.value })} type={showPassword ? "text" : "password"} placeholder="Crie uma senha..." input="common" />
                        </>
                    ) :
                        urlCadastro === "/login" && (
                            <>
                                <Input onChange={(e) => setUser({ ...user, login: e.target.value })} type="text" placeholder="Login..." input="common" errorMessage={errorMessage?.login || ''} />
                                <Input onChange={(e) => setUser({ ...user, password: e.target.value })} type={showPassword ? "text" : "password"} placeholder="Senha..." input="common" errorMessage={errorMessage?.password || ''} />
                            </>
                        )
                    }
                    <div className="show-password">
                        <input
                            type="checkbox"
                            id="show-password"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        />
                        <label htmlFor="show-password">Ver senha</label>
                    </div>
                    {/* <span onClick={() => navigate(urlCadastro)}>{cadastro}</span> */}
                    <div className="button-acess">
                        {urlCadastro === "/register" ? (
                            <div>
                                <Button onClick={() => handlePostUser()} nameButton="Registrar" loading={isLoading} />
                            </div>
                        ) :
                            urlCadastro === "/login" && (
                                <div>
                                    <Button onClick={() => handleGetUser()} nameButton="Acessar" loading={isLoading} />
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