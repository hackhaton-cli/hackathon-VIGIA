Estou projetando um aplicativo mobile para agentes comunitários de saúde do SUS que visitam casas e precisam cadastrar moradores e identificar pacientes de alto risco para doenças graves (como AVC, infarto e complicações crônicas).

O objetivo do aplicativo é ajudar o agente a priorizar quais pacientes precisam de acompanhamento mais urgente com base em idade, doenças (CID), histórico e fatores de risco.

Crie um design simples, intuitivo e rápido de usar em campo, considerando que o agente pode estar na rua ou visitando casas.

Use um design moderno, limpo, acessível e com boa legibilidade.

Estrutura do aplicativo

Crie as seguintes telas:

1. Tela inicial / Dashboard do agente

Mostrar:

número total de pacientes cadastrados

pacientes de alto risco

pacientes de médio risco

pacientes de baixo risco

Adicionar também:

Lista de prioridade de visitas do dia

Exemplo de card de paciente:

Nome

Idade

Principais doenças

Nível de risco (baixo, médio ou alto)

Use cores para indicar risco:

verde → baixo risco

amarelo → médio risco

vermelho → alto risco

2. Lista de pacientes

Tela com:

barra de busca

filtro por risco (alto / médio / baixo)

lista de pacientes

Cada item deve mostrar:

nome

idade

doenças principais

indicador de risco

3. Cadastro de paciente

Formulário simples com:

nome

idade

sexo

endereço

telefone

Seção condições de saúde (CID ou doenças):

checkbox ou seleção para:

hipertensão

diabetes

histórico de AVC

doença cardíaca

colesterol alto

tabagismo

obesidade

Também permitir adicionar outras condições.

Botão:

Salvar paciente

4. Tela de perfil do paciente

Mostrar:

dados pessoais

doenças registradas

score de risco calculado pelo sistema

Exemplo:

Score de risco: ALTO

Explicação:

idade > 70

hipertensão

diabetes

Adicionar também:

Recomendações

Exemplo:

acompanhamento frequente

encaminhamento para UBS

monitoramento de pressão

5. Tela de prioridade de visitas

Lista automática de pacientes ordenados por risco.

Exemplo:

1️⃣ Maria – 72 anos – hipertensão + diabetes – 🔴 alto risco
2️⃣ José – 68 anos – histórico cardíaco – 🔴 alto risco
3️⃣ Ana – 55 anos – hipertensão – 🟡 médio risco

Estilo visual

design mobile first

estilo moderno de aplicativo de saúde

ícones simples

boa hierarquia visual

cores suaves de saúde (verde, azul, branco)

destaque visual para níveis de risco

O design deve parecer um aplicativo real pronto para desenvolvimento.