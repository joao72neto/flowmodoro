# Instruções para Geração de Especificações (Spec Prompt)

Quando o usuário solicitar a criação de uma especificação (spec) para uma nova funcionalidade, siga rigorosamente o fluxo e o template abaixo.

## Diretrizes de Comportamento
1. **NÃO escreva código** na etapa de spec.
2. **Faça perguntas primeiro:** Se o pedido do usuário for ambíguo ou omitir regras de negócio críticas, faça até 5 perguntas diretas antes de gerar o documento final.
3. **Mantenha o foco no "O QUE" e não no "COMO":** A spec deve descrever comportamentos, regras, contratos e casos de borda — não a implementação técnica dos arquivos (isso pertence ao `plan.md`).
4. **Crie o arquivo:** Salve o resultado final em `_specs/[nome-da-feature].spec.md`.

---

## Template Padrão de Spec

Substitua os trechos entre colchetes pelo conteúdo do projeto:

# Spec: [nome-da-feature]

## 1. Visão Geral
- **Objetivo:** [Descreva em 2-3 frases o problema que esta feature resolve].
- **Público/Atores:** [Quem interage com essa feature? Ex: Usuário autenticado, Admin, Sistema externo].

## 2. Requisitos Funcionais (RF)
- [ ] **RF-01:** O sistema deve permitir que [ator] faça [ação].
- [ ] **RF-02:** Quando [evento acontecer], o sistema deve [comportamento esperado].
- [ ] **RF-03:** O sistema deve validar [condição] antes de prosseguir.

## 3. Fluxo do Usuário & Telas / Endpoints (User Journey)
1. **Entrada:** O usuário acessa [ponto de entrada].
2. **Ação:** O usuário clica/envia [dados].
3. **Resposta do Sistema:** 
   - Se sucesso: [O que acontece/exibe].
   - Se erro: [O que acontece/exibe].

## 4. Regras de Negócio e Casos de Borda (Edge Cases)
### Regras de Negócio
- **RN-01:** [Ex: O limite máximo de upload é de 5MB].
- **RN-02:** [Ex: Apenas usuários com plano Pro podem acessar esta área].

### Casos de Borda & Tratamento de Erros
- **Falha de Rede / API Indisponível:** [O que a interface exibe e como o sistema se comporta].
- **Dados Inválidos / Incompletos:** [Como deve ser o feedback de validação].
- **Concorrência / Ações Duplicadas:** [Ex: Desabilitar o botão enquanto a requisição carrega].

## 5. Critérios de Aceite (Definition of Done)
- [ ] [Critério 1 - Ex: Formulário valida e-mail em tempo real].
- [ ] [Critério 2 - Ex: Feedback de erro amigável ao atingir timeout].
- [ ] [Critério 3 - Ex: Funciona perfeitamente em telas mobile e desktop].

## 6. Dúvidas Pendentes / A Propor
- [Aponte decisões que você tomou por padrão, mas que o usuário precisa aprovar/confirmar].
- [Ex: Gostaria de valdar o input de senha com regras customizadas?]
