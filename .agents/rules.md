# Diretrizes e Regras do Projeto (Flowmodoro)

Este documento serve como referência de contexto e regras arquiteturais para agentes autônomos e desenvolvedores. **Sempre consulte e atualize este arquivo ao planejar e implementar novas funções ou refatorações.**

O objetivo principal deste arquivo é descrever a estrutura e os padrões do projeto para **evitar buscas globais (greps ou finds genéricos) desnecessárias**, direcionando o desenvolvimento diretamente para os locais corretos.

---

## 🏗️ Visão Geral da Arquitetura

O Flowmodoro é um aplicativo de produtividade offline-first composto por:
1. **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS 4 + Dexie (IndexedDB) para armazenamento offline + React Query + Axios.
2. **Backend**: Java 21 + Spring Boot 3.5.6 + PostgreSQL + Spring Data JPA + Lombok.
3. **Android**: Capacitor + Kotlin para integrações nativas.

Tanto o frontend quanto o backend utilizam uma **Arquitetura Baseada em Funcionalidades (Feature-driven)**.

---

## 📂 Estrutura de Diretórios e Onde Encontrar as Coisas

### 🔹 Backend (Spring Boot)
Toda a lógica de negócio do backend está localizada sob `backend/src/main/java/com/company/flowmodoro/`.
* **Configurações Globais**: `com/company/flowmodoro/configs/`
* **Exceções Globais**: `com/company/flowmodoro/exception/`
* **Funcionalidades (Features)**: `com/company/flowmodoro/features/`
  * Cada funcionalidade tem sua própria pasta contendo tudo o que precisa:
    * `*Controller.java` (Endpoints REST)
    * `*Service.java` (Regra de negócio)
    * `*Repository.java` (Acesso a dados via JPA)
    * `*Model.java` (Entidade JPA)
    * `dtos/` (DTOs de entrada/saída)
    * `mappers/` (Conversões entre Entidade e DTO)
    * `exceptions/` (Exceções específicas da feature)

### 🔹 Frontend (React)
Toda a lógica do frontend está em `frontend/src/`.
* **Layouts e Componentes Globais**: `app/MainLayout/`
* **Configurações Gerais**: `configs/` (Vite, API, Axios, React Query)
* **Constantes Globais**: `consts/`
* **Funcionalidades (Features)**: `features/`
  * Cada funcionalidade possui sua própria estrutura modular:
    * `api/` (Chamadas Axios e hooks do React Query)
    * `components/` (Componentes visuais específicos da feature)
    * `dtos/` (Tipos e interfaces TypeScript para comunicação com a API)
    * `hooks/` (Hooks customizados do React)
    * `local/` (Lógica local do Dexie/IndexedDB para offline-first)
    * `*.schema.ts` (Esquemas de validação de formulários/dados)
    * `*.mappers.ts` (Mapeamento de dados locais para DTOs ou vice-versa)

---

## 📏 Regras de Desenvolvimento e Padrões

### 1. 🔍 Localização de Buscas (Evitar Buscas Globais)
* Ao trabalhar em uma funcionalidade (ex: `projects`), **restrinja suas buscas aos diretórios da respectiva funcionalidade**:
  * Frontend: `frontend/src/features/projects/`
  * Backend: `backend/src/main/java/com/company/flowmodoro/features/projects/`
* Evite varrer todo o projeto com `grep_search` ou `find_by_name` sem especificar o diretório alvo correto.

### 2. 🔌 Padrão Offline-First no Frontend
* Os dados do usuário devem sempre ser salvos localmente primeiro no **IndexedDB** usando o **Dexie** (gerenciado em `local/`).
* A sincronização com o backend deve ocorrer em segundo plano ou quando houver conexão disponível.
* Consulte sempre os arquivos da pasta `local/` da respectiva feature antes de alterar a persistência de dados.

### 3. 🧩 Estruturação de Novas Features
Se for criar uma nova feature (ex: `dashboard`):
* **No Backend**: Crie o pacote `com.company.flowmodoro.features.dashboard` e adicione seus controllers, services, repositories e models ali.
* **No Frontend**: Crie a pasta `frontend/src/features/dashboard` e siga a mesma estrutura modular de subpastas (`api`, `components`, `hooks`, `local`).

### 4. 🎨 UI e Estilização
* O projeto utiliza **Tailwind CSS 4**. Modificações de design devem seguir os padrões de tema (claro/escuro) já existentes.

### 5. Comandos e Prompts Específicos (`.agents/commands/`)
- A pasta `.agents/commands/` contém instruções detalhadas para fluxos específicos do projeto.
- **Geração de Specs:** Quando o usuário solicitar a criação de uma especificação, spec ou RFP, **sempre leia as diretrizes contidas em `.agents/commands/specs.md`** antes de responder ou criar os arquivos.
- Siga estritamente o formato, estrutura e regras definidos nos arquivos desta pasta ao executar esses comandos.

---

*Nota: Ao iniciar qualquer tarefa de codificação, revise este arquivo rules.md para garantir conformidade arquitetural.*
