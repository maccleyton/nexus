# 🏦 BANCO NEXUS - Sistema Bancário Completo v3.0

Sistema bancário completo com tema Matrix/Cyberpunk, desenvolvido em JavaScript vanilla com persistência em localStorage.

## 🚀 Funcionalidades

### 📊 Módulo Administrativo (Agência)
- ✅ Gestão de cofres (A e B)
- ✅ Controle de 4 ATMs com capacidades diferentes
- ✅ Gestão de caixa humano
- ✅ Sistema de gavetas com múltiplas denominações
- ✅ Distribuição dinâmica de numerário
- ✅ Auto-balanceamento de terminais
- ✅ CRUD completo de contas
- ✅ Sistema de logs e auditoria
- ✅ Export/Import de dados (backup)
- ✅ Métricas em tempo real
- ✅ Gestão de cartões de crédito
- ✅ Empréstimos e financiamentos
- ✅ Cheques especiais

### 🏧 Terminais de Atendimento
- ✅ 4 ATMs + 1 Caixa Humano
- ✅ Operações: Saque, Depósito, Transferência, Pagamento
- ✅ Validação de saldo e disponibilidade física
- ✅ Sistema de denominações inteligente
- ✅ Alertas de capacidade

### 💻 Internet Banking
- ✅ Login seguro com sessão
- ✅ Dashboard com resumo financeiro
- ✅ Extrato completo com filtros
- ✅ PIX e transferências
- ✅ Pagamentos diversos
- ✅ **Módulo de Investimentos Completo:**
  - CDB, LCI, LCA
  - Ações e Fundos Imobiliários
  - Fundos de Investimento
  - Tesouro Direto
  - Poupança
  - Simulador de rendimentos
  - Cálculo de impostos
- ✅ Gestão de cartões
- ✅ Solicitação de empréstimos
- ✅ Cheque especial

### 📈 Sistema de Monitoramento
- ✅ Status dos terminais em tempo real
- ✅ Atividade recente
- ✅ Gráficos de transações
- ✅ Console de logs
- ✅ Sistema de notificações

## 🎨 Design
- Tema Matrix/Cyberpunk
- Efeito de chuva de caracteres
- Animações e transições suaves
- Responsivo (mobile-friendly)
- Interface intuitiva

## 🔧 Tecnologias
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript ES6+ (Classes, Modules)
- LocalStorage para persistência
- Font Awesome para ícones

## 📦 Estrutura de Arquivos

```
/
├── index.html          # HTML principal
├── style.css           # Estilos globais
├── js/
│   ├── core/
│   │   ├── database.js      # Gerenciamento de dados
│   │   ├── router.js        # Sistema de rotas
│   │   └── notifications.js # Sistema de notificações
│   ├── modules/
│   │   ├── admin.js         # Módulo administrativo
│   │   ├── terminals.js     # Gestão de terminais
│   │   ├── banking.js       # Internet banking
│   │   ├── investments.js   # Sistema de investimentos
│   │   ├── cards.js         # Gestão de cartões
│   │   └── loans.js         # Empréstimos
│   └── main.js              # Inicialização
└── README.md
```

## 🚀 Como Usar

1. Abra o arquivo `index.html` em um navegador moderno
2. O sistema será inicializado automaticamente

### Credenciais Padrão

**Admin:**
- Usuário: `nexus` ou `cosmos`
- Senha: `0099`

**Clientes (Internet Banking):**
- Conta: `1`, `2`, `3` ou `4`
- Senha Web: `123`
- Senha Transação: `1234`

## 💡 Novas Funcionalidades v3.0

### Cartões de Crédito
- Solicitação de cartões
- Múltiplas bandeiras (Visa, Mastercard, Elo)
- Limite de crédito configurável
- Fatura mensal
- Pagamento de faturas

### Empréstimos
- Simulação de empréstimos
- Cálculo de parcelas
- Taxas de juros configuráveis
- Aprovação automática baseada em score
- Acompanhamento de parcelas

### Cheque Especial
- Ativação/desativação
- Limite configurável
- Juros sobre uso
- Controle de utilização

### Investimentos Avançados
- Simulador com taxas reais
- Cálculo de IR regressivo
- Rentabilidade histórica
- Diversificação de carteira
- Resgate automático

## 🔒 Segurança
- Validação de todas as operações
- Logs de auditoria
- Sessões com timeout
- Backup/Restore de dados

## 📱 Responsividade
- Desktop (1920x1080+)
- Laptop (1366x768+)
- Tablet (768x1024)
- Mobile (320x568+)

## 🐛 Debugging
- Console Matrix integrado
- Sistema de logs detalhado
- Notificações em tempo real

## 📝 Licença
MIT License - Livre para uso e modificação

## 👨‍💻 Desenvolvedor
Sistema desenvolvido como demonstração de aplicação bancária completa.

---

**Versão:** 3.0.0  
**Data:** Dezembro 2024  
**Status:** ✅ Operacional
