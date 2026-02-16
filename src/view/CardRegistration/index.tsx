import { FC, useEffect, useState } from "react";
import { MdArrowForwardIos, MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../shared/components/Logo";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import api from "../../shared/api";
import { getCookie } from "../../shared/utils/cookie";
import { upsertCardInStorage, removeCardFromStorage } from "../../shared/utils/cardStorage";
import "./styles.scss";

interface ICardRegistration {
    isEditType?: boolean;
}

const CardRegistration: FC<ICardRegistration> = ({ isEditType }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [cardName, setCardName] = useState("");
    const [dueDay, setDueDay] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEditType && id) {
            handleGetCard();
        }
    }, [isEditType, id]);

    const handleGetCard = async () => {
        try {
            const { data } = await api.get({
                property: "cartoes",
                query: { id }
            });
            if (data) {
                setCardName(data.name);
                setDueDay(data.dia_vencimento.toString());
            }
        } catch (error) {
            console.error("Erro ao buscar cartão:", error);
            alert("Erro ao carregar dados do cartão.");
        }
    };

    const handleRegisterCard = async () => {
        if (!cardName) {
            alert("Por favor, preencha o nome do cartão.");
            return;
        }

        setIsLoading(true);

        const slug = cardName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "_")
            .replace(/_+/g, "_")
            .replace(/^_+|_+$/g, "");

        const body: any = {
            id,
            name: cardName,
            dia_vencimento: Number(dueDay),
            slug: slug
        };

        const userCookie = getCookie("user");
        if (userCookie) {
            const userLogged = JSON.parse(decodeURIComponent(userCookie));
            body.user_id = userLogged.id;
        }

        try {
            if (isEditType) {
                await api.put({
                    property: "cartoes",
                    body: body
                });
                upsertCardInStorage(body); // Atualiza no storage
                alert("Cartão atualizado com sucesso!");
            } else {
                const { data } = await api.post({
                    property: "cartoes",
                    body: body
                });
                if (data) upsertCardInStorage(data); // Salva o novo no storage com ID da API
                alert("Cartão cadastrado com sucesso!");
            }
            navigate("/home");
        } catch (error) {
            console.error("Erro ao salvar cartão:", error);
            alert("Erro ao salvar o cartão. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCard = async () => {
        if (!id) return;
        const confirmDelete = window.confirm("Deseja realmente excluir este cartão?");
        if (!confirmDelete) return;

        try {
            await api.delete({
                property: "cartoes",
                query: { id }
            });
            removeCardFromStorage(id); // Remove do storage
            alert("Cartão excluído com sucesso!");
            navigate("/home");
        } catch (error) {
            console.error("Erro ao excluir cartão:", error);
            alert("Erro ao excluir o cartão.");
        }
    };

    return (
        <div className="container-card-registration">
            <div className="container">
                <div className="logo">
                    <button onClick={() => navigate("/home")}>
                        <MdArrowForwardIos size={50} />
                    </button>
                    <div className="logo-container">
                        <Logo />
                    </div>
                </div>

                <div className="container-fields">
                    <div className="container-one">
                        <label>Nome do Cartão</label>
                        <Input
                            onChange={(e) => setCardName(e.target.value)}
                            value={cardName}
                            type="text"
                            placeholder="Ex: Nubank Fulano"
                            input="common"
                        />
                    </div>
                    <div className="container-one">
                        <label>Dia que vira a fatura</label>
                        <Input
                            onChange={(e) => setDueDay(e.target.value)}
                            value={dueDay}
                            type="number"
                            placeholder="Ex: 5"
                            input="common"
                        />
                    </div>

                    <div className="container-two" style={{ marginTop: "20px" }}>
                        <Button
                            nameButton={isEditType ? "Excluir" : "Cancelar"}
                            colorOptional="red"
                            onClick={isEditType ? handleDeleteCard : () => navigate("/home")}
                        />
                        <Button
                            nameButton={isEditType ? "Salvar" : "Cadastrar"}
                            onClick={handleRegisterCard}
                            disabled={!cardName || isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardRegistration;
