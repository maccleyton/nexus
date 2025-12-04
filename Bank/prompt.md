# **PROMPT PRONTO — SISTEMA COMPLETO DE BANCO**

Crie um sistema completo de Banco com os seguintes módulos e regras.
O sistema deve ser organizado, com todas as validações necessárias, telas claras e fluxo completo de operações.

---

## **🎯 MÓDULO AGÊNCIA**

### **1. Administrador – Financeiro**

Implementar um painel administrativo capaz de:

* Controlar **abastecimento e recolhimento de numerário** dos terminais (guichê e autoatendimento).
* Solicitar numerário via carro-forte e registrar alívio de numerário, indicando a composição por denominação:
  **0,05; 0,10; 0,25; 0,50; 1,00; 2,00; 5,00; 10,00; 20,00; 50,00; 100,00; 200,00**.
* Administrar **dois cofres (A e B)** e **quatro terminais de autoatendimento (A, B, C, D)**.
* O banco deve dividir o numerário total assim:

  * **50% → Cofres + guichê de caixa**

    * Descontar **R$ 10.000,00**, que é o limite permitido de permanência no guichê.
    * O restante dos 50% é dividido: **50% Cofre A / 50% Cofre B**.
  * **50% → Quatro terminais:**

    * Terminal A: **31%**
    * Terminal B: **31%**
    * Terminal C: **19%**
    * Terminal D: **19%**

### **Capacidade dos terminais**

* **Terminal A e Terminal B:**

  * 4 gavetas
  * Limite: **3.000 cédulas por gaveta**
  * Total: **12.000 cédulas**

* **Terminal C e Terminal D:**

  * 4 gavetas
  * Limite: **1.800 cédulas por gaveta**
  * Total: **7.200 cédulas**

### **Valor de face padrão das gavetas**

* Gavetas 1 a 4: **10, 20, 50 e 100 reais**, respectivamente.
* Padrão pode ser alterado. Quando alterar, o sistema deve exibir **alerta** avisando que a mudança foi necessária para equilibrar o numerário.

### **Quinta gaveta (genérica)**

* Aceita qualquer cédula sem gaveta específica.
* Limite igual às gavetas do terminal:

  * **3000 para A e B**
  * **1800 para C e D**

### **Distribuição dinâmica de numerário**

Criar uma tela que:

* Calcula automaticamente a distribuição ideal entre cofres, guichê e todos os terminais.
* Sugere abastecimento por gaveta.
* Permite edição manual pelo usuário.
* Exibe alertas caso falte ou sobre numerário.
* Caso uma gaveta atinja limite em um depósito, o sistema:

  * Redireciona automaticamente esse valor para a **quinta gaveta**.
  * Emite alerta no painel do administrador para ajustar o valor de face e o equilíbrio do terminal.

### **Depósitos em terminais**

Usuário informa quantidade depositada por cédula:

* **2, 5, 10, 20, 50, 100 e 200 reais**

Sistema calcula:

* Quantidade de cédulas por gaveta
* Capacidade restante
* Alerta de limite

### **Ações do administrador**

* Ver tudo em painel geral: cada terminal, capacidade, ocupação, alertas.
* Gerenciar cofres e guichê (abastecimento e recolhimento).
* Registrar operações de carro-forte.
* Emitir avisos de reconfiguração das gavetas.

---

## **🎯 ATENDIMENTO (Agência)**

* Abrir contas
* Encerrar contas
* Alterar senha
* Cadastrar dados do cliente

---

## **🎯 GUICHÊ DE CAIXA**

Operações disponíveis:

* Pagamentos
* Transferências
* Depósitos
* Saques

Registrar tudo no extrato do cliente.

---

## **🎯 TERMINAIS DE AUTOATENDIMENTO (4 unidades)**

Cada terminal deve permitir:

* Pagamentos
* Transferências
* Depósitos
* Saques

Com todas as mesmas validações do guichê, porém automáticas, respeitando limites de gavetas e emissão de alertas.

---

# **🌐 MÓDULO INTERNET BANKING**

Criar um portal completo:

## **Login**

* Autenticação por usuário e senha
* Política de senha segura
* Sessão com timeout

## **Tela inicial**

Menu com:

* Extrato
* Pagamentos
* Transferências
* Investimentos

---

## **Extrato**

* Listar todas as operações do usuário, contendo:

  * Data
  * Hora
  * Tipo de transação
  * Valor
  * Saldo após operação

---

## **Pagamentos**

Tela simples contendo:

* Tipo de pagamento (água, energia, internet, telefone, tributos, cartão, boletos etc)
* Data
* Valor

Registrar no extrato.

---

## **Transferências**

* Conta destino
* Data
* Valor

Registrar no extrato.

---

## **Investimentos**

Criar módulo completo com:

### **Tipos de investimento**

* CDB
* Ações
* Fundos Imobiliários
* Fundos de Investimentos
* LCI
* LCA
* Título Público
* Poupança

### **Tela de aplicação**

* Tipo escolhido
* Data
* Valor aplicado

### **Tela de resgate**

* Data
* Valor resgatado

### **Extrato da aplicação**

* Movimentações
* Saldo investido
* Rentabilidade
* Histórico

### **Simulação de rendimentos e impostos**

Simular de forma simples:

* Juros compostos
* Imposto regressivo
* Alíquotas típicas de cada tipo de investimento
* Oscilação de ações (leve simulação randômica)
* Rentabilidade da poupança
* CDI para CDB
* IPCA para títulos atrelados
  (Simulação fictícia, não real)

---

# **🚀 ENTREGA ESPERADA DA IA**

Com esse prompt, gerar:

* Arquitetura do sistema
* Modelagem de dados
* Back-end completo
* Front-end completo
* Regras e validações
* Telas do painel da agência
* Telas dos terminais
* Telas do internet banking
* Fluxos de operação
* Logs e auditoria
* Sistema redondo operando com todas as funcionalidades acima

---

