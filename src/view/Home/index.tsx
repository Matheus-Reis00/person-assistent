import { FC } from "react"
import { deleteCookie } from "../../shared/utils/cookie"
import { clearCardsStorage } from "../../shared/utils/cardStorage"
// import { VscSettingsGear } from "react-icons/vsc"
import { MdArrowForwardIos } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import Logo from "../../shared/components/Logo"
import Button from "../../shared/components/Button"
import "./styles.scss"

interface IHome { }
const Home: FC<IHome> = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        deleteCookie("user")
        clearCardsStorage()
        navigate("/login")
    }

    return (
        <div className="container-home">
            <div className="container">
                <button className="setting" onClick={() => navigate(`/configuracoes`)}>
                    {/* <VscSettingsGear size={30} color="#000" /> */}
                </button>
                <div className="logo">
                    <Logo />
                </div>
                <div className="buttons">
                    <button onClick={() => navigate("/produto")}>Cadastrar nova despesa<MdArrowForwardIos size={35} /></button>
                    <button onClick={() => navigate("/produtos")}>Listar todas as despesas<MdArrowForwardIos size={35} /></button>
                    <button onClick={() => navigate("/cadastrar-cartao")}>Adicionar novo cartão<MdArrowForwardIos size={35} /></button>
                    <button onClick={() => navigate("/relatorio-detalhado")}>Relatório detalhado<MdArrowForwardIos size={35} /></button>
                </div>
                <div className="logout">
                    <div>
                        <Button nameButton="Logout" colorOptional="red" onClick={handleLogout}></Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home