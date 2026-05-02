# Flowmodoro

O **Flowmodoro** é uma ferramenta de produtividade desenvolvida para ajudar usuários a equilibrar sessões de trabalho focado com períodos de descanso, utilizando a abordagem de "fluxo" para a gestão de tempo.

<img width="926" height="723" alt="image" src="https://github.com/user-attachments/assets/65b80a9f-d213-4135-92cf-b61f5404998d" />

## 🚀 Funcionalidades

### Timer de Fluxo

O timer é o componente principal da aplicação. O diferencial está no cálculo automático de pausas com base no foco total do usuário. 

Além disso, ele é persistente: não perde a contagem mesmo se o usuário trocar de aba ou fechar o navegador. Quando a aplicação é aberta novamente, o último estado é recuperado e o tempo é recalculado com base na data atual, mantendo o timer consistente.

Também é possível selecionar 3 modos de fluxo:
- **Intenso**: utiliza 10% do foco total como descanso;
- **Padrão**: utiliza 20% para o descanso;
- **Leve**: utiliza 30% para o descanso;

Quando o usuário inicia o descanso calculado pelo app, ele pode:
- esperar até o fim (uma notificação será enviada ao término);
- ou pular a pausa e iniciar uma nova sessão.

### Gestão de Tarefas

A aplicação possui uma sidebar no lado direito responsável pelo gerenciamento das tarefas.

Nela é possível:
- criar
- editar
- excluir
- iniciar o tracking de uma tarefa ao clicar no botão de play

### Histórico de Sessões

Quando o timer é finalizado, um modal é exibido perguntando se o usuário deseja salvar ou descartar a sessão.

Caso a sessão seja salva, ela aparece na parte inferior da tela, sendo agrupada por dias conforme o uso da aplicação.

### Design responsivo

A aplicação funciona tanto no desktop quanto no mobile e possui suporte a PWA.

Em navegadores como o Chrome no celular, é possível instalar a aplicação para que ela fique disponível como um app no dispositivo.

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

## 🚀 Deploy

O deploy foi realizado em plataformas gratuitas. Por conta disso, em alguns momentos pode haver:
- **cold start** da API
- expiração do banco de dados após **90 dias de inatividade**

### Plataformas utilizadas
- **Frontend:** Vercel
- **API Spring e banco de dados:** Render

A aplicação pode ser acessada aqui:  
👉 https://flowmodoro-jsn.vercel.app/

## 🏁 Como rodar localmente

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
