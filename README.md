# Person Assistent 💰

O **Person Assistent** é um gerenciador financeiro pessoal desenvolvido para ajudar no controle de despesas e cartões de crédito. Com uma interface moderna e intuitiva, ele permite que você organize seus gastos fixos e variáveis, acompanhando parcelamentos e datas de vencimento de forma centralizada.

## 🚀 Funcionalidades

- **Controle de Despesas**: Cadastro de despesas fixas (recorrentes) e avulsas (únicas ou parceladas).
- **Gestão de Cartões**: Cadastro e edição de cartões de crédito, incluindo a definição do dia de fechamento da fatura.
- **Cálculo de Parcelas**: Lógica automática que multiplica o valor da parcela pela quantidade total para exibir o custo final.
- **Fechamento de Fatura**: Identificação visual e alertas sobre a "virada" do cartão (melhor dia de compra).
- **Autenticação**: Sistema de login e registro de usuários.
- **Performance**: Cache inteligente de dados (como cartões) via LocalStorage para carregamento instantâneo.
- **Interface Premium**: Design dark mode com estética moderna (glassmorphism/blur).

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [SASS/SCSS](https://sass-lang.com/)
- **Ícones**: [React Icons](https://react-icons.github.io/react-icons/)
- **Comunicação API**: [Axios](https://axios-http.com/)
- **Roteamento**: [React Router](https://reactrouter.com/)

## 📦 Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- Backend do projeto rodando (ou utilize uma URL pública no .env)

### Passo a passo
1. Clone o repositório:
   ```bash
   git clone https://github.com/SeuUsuario/person-assistent.git
   ```

2. Entre no diretório:
   ```bash
   cd person-assistent
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
   ```bash
   VITE_BASE_URL=http://localhost:3000
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 📄 Variáveis de Ambiente

O projeto utiliza as seguintes variáveis:
- `VITE_BASE_URL`: URL base para a comunicação com a API (Node.js/Express).

---
Desenvolvido para facilitar a vida financeira. 🚀