# Flowmodoro

O **Flowmodoro** é uma ferramenta de produtividade desenvolvida para ajudar usuários a equilibrar sessões de trabalho focado com períodos de descanso, utilizando a abordagem de "fluxo" para a gestão de tempo.

<img width="926" height="723" alt="image" src="https://github.com/user-attachments/assets/65b80a9f-d213-4135-92cf-b61f5404998d" />


## 🚀 Funcionalidades

- **Timer de Fluxo:** Acompanhamento dinâmico de sessões de foco e pausas automáticas.
- **Gestão de Tarefas:** Organização e acompanhamento de tarefas integradas ao cronômetro.
- **Histórico de Sessões:** Visualização detalhada das sessões concluídas e produtividade.
- **Design Responsivo:** Interface moderna e intuitiva adaptada para diferentes dispositivos.

## 🛠️ Tecnologias

### Backend
- **Java 21** com **Spring Boot 3.5.6**
- **PostgreSQL** para persistência de dados
- **Spring Data JPA** & **Lombok**
- **Maven** como gerenciador de dependências

### Frontend
- **React 19** com **TypeScript** e **Vite**
- **Tailwind CSS 4** para estilização
- **React Context API** para gerenciamento de estado
- **Axios** para comunicação com a API

## 🏁 Como Começar

### Pré-requisitos
- Docker e Docker Compose
- Java 21+
- Node.js 20+

### Instalação

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/flowmodoro.git
   cd flowmodoro
   ```

2. **Subir o banco de dados:**
   ```bash
   docker compose up -d
   ```

3. **Configurar o Backend:**
   - Navegue até `backend/`
   - Configure o arquivo `.env` baseado no `.env.example`
   - Execute: `./mvnw spring-boot:run`

4. **Configurar o Frontend:**
   - Navegue até `frontend/`
   - Execute: `npm install`
   - Configure o arquivo `.env` baseado no `.env.example`
   - Execute: `npm run dev`

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
