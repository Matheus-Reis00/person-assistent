import { FC } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Access from "../../view/Access"
import Home from "../../view/Home"
import Product from "../../view/Product"
import Listing from "../../view/Listing"
import Settings from "../../view/Settings"
import CardRegistration from "../../view/CardRegistration"
import DetailedReport from "../../view/DetailedReport"

interface IRouter { }
const Router: FC<IRouter> = () => {
    return (
        <Routes>
            <Route path="/login" element={<Access cadastro="Não tem cadastro?" urlCadastro="/login" />} />
            {/* <Route path="/register" element={<Access cadastro="Tem cadastro?" urlCadastro="/register" />} /> */}
            <Route path="/home" element={<Home />} />
            <Route path="/produto" element={<Product />} />
            <Route path="/produto/fixa/:mes/:ano/:id" element={<Product isEditType={'fixa'} />} />
            <Route path="/produto/avulsa/:mes/:ano/:id" element={<Product isEditType={'avulsa'} />} />
            <Route path="/produtos" element={<Listing />} />
            <Route path="/cadastrar-cartao" element={<CardRegistration />} />
            <Route path="/cadastrar-cartao/:id" element={<CardRegistration isEditType={true} />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/relatorio-detalhado" element={<DetailedReport />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    )
}

export default Router