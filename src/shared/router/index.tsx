import { FC } from "react"
import { Routes, Route } from "react-router-dom"
import Access from "../../view/Access"
import Home from "../../view/Home"
import Product from "../../view/Product"
import Listing from "../../view/Listing"
import Settings from "../../view/Settings"

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
            <Route path="/configuracoes" element={<Settings />} />
        </Routes>
    )
}

export default Router