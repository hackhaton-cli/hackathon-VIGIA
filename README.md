# VIGIA - Vigilância Preventiva em Saúde Comunitária

Sistema de gerenciamento e triagem de pacientes para unidades básicas de saúde do SUS, com foco em priorização inteligente de atendimentos com base em fatores de risco.

## Sobre o Projeto

O **VIGIA** é uma aplicação web desenvolvida para auxiliar profissionais de saúde no gerenciamento eficiente de pacientes, oferecendo:

- **Dashboard** com estatísticas e visão geral dos pacientes
- **Cadastro completo** de pacientes com histórico médico e medicações
- **Sistema de priorização** automática baseado em fatores de risco
- **Perfil detalhado** de cada paciente com histórico de visitas
- **Classificação de risco** (Alto, Médio, Baixo) considerando:
  - Idade do paciente
  - Condições crônicas (hipertensão, diabetes, AVC, doenças cardíacas)
  - Medicações em uso
  - Outros fatores de risco (tabagismo, obesidade, colesterol)

## Funcionalidades Principais

### Dashboard
Visão geral com estatísticas de pacientes e alertas de prioridade.

### Lista de Pacientes
Busca e visualização de todos os pacientes cadastrados com indicadores de risco.

### Cadastro/Edição de Pacientes
Formulário completo para registro de:
- Dados pessoais
- Condições de saúde
- Medicações 
- Histórico médico

### Priorização de Visitas
Sistema inteligente que ordena pacientes por nível de risco para otimizar o atendimento.

### Perfil do Paciente
Visualização detalhada com histórico completo e medicações ativas.

## Tecnologias

- **React 19** com TypeScript
- **Vite** para desenvolvimento e build
- **React Router** para navegação
- **Tailwind CSS** para estilização
- **Radix UI** + **shadcn/ui** para componentes
- **Material UI Icons** para ícones
- **date-fns** para manipulação de datas

## Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd Hackathon2026
```

2. Instale as dependências:
```bash
npm install
```

### Desenvolvimento

Execute o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🤖 Declaração de Uso de Inteligência Artificial

Este projeto foi desenvolvido pela nossa equipe utilizando conceitos, arquitetura e design de solução inteiramente autorais. Ferramentas de IA (GitHub Copilot/Claude) foram utilizadas exclusivamente como ferramentas de apoio durante o processo de desenvolvimento, auxiliando pontualmente em tarefas como sugestões de código, otimização de sintaxe, e aceleração da implementação de funcionalidades já planejadas pela equipe. 

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/      # Componentes reutilizáveis
│   ├── context/         # Context API (gerenciamento de estado)
│   ├── data/           # Tipos e dados dos pacientes
│   ├── pages/          # Páginas da aplicação
│   └── routes.tsx      # Configuração de rotas
├── styles/             # Estilos globais e temas
└── main.tsx           # Ponto de entrada da aplicação
