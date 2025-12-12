# 🚀 Guia de Melhorias - Banco NEXUS v3.0

Este documento contém melhorias incrementais que podem ser adicionadas ao sistema atual.

## ✅ Funcionalidades Já Implementadas

- ✅ Sistema de notificações toast
- ✅ Console de logs
- ✅ Gestão de ATMs com gavetas
- ✅ Caixa humano
- ✅ Internet Banking básico
- ✅ Extrato de transações
- ✅ PIX e transferências
- ✅ Pagamentos
- ✅ Export/Import de dados

---

## 🎯 Melhorias Prioritárias (Fácil Implementação)

### 1. Sistema de Cartões de Crédito

**Adicionar ao DB.seed():**
```javascript
cards: [],
```

**Adicionar função no DB:**
```javascript
createCard(accountId, limit = 5000) {
    const card = {
        id: Date.now(),
        accountId: accountId,
        number: '5199' + Math.random().toString().slice(2, 14),
        brand: 'Nexus Card',
        limit: limit,
        used: 0,
        dueDay: 10,
        status: 'active',
        createdAt: new Date().toISOString(),
        transactions: []
    };
    this.data.cards.push(card);
    this.save();
    return card;
}
```

**Adicionar no Internet Banking:**
```javascript
showAction(act) {
    // ... código existente ...
    
    else if(act === 'cartoes') {
        const cards = DB.data.cards.filter(c => c.accountId == this.user.id);
        let html = `<div class="card">
            <h3>MEUS CARTÕES</h3>`;
        
        if (cards.length === 0) {
            html += `<p>Nenhum cartão ativo</p>
                <button class="btn" onclick="IBManager.requestCard()">Solicitar Cartão</button>`;
        } else {
            cards.forEach(card => {
                const available = card.limit - card.used;
                html += `
                    <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <div style="color: white;">
                            <h4>${card.brand}</h4>
                            <p style="font-size: 1.2rem; letter-spacing: 2px;">${card.number.replace(/(.{4})/g, '$1 ')}</p>
                            <div class="grid-2" style="margin-top: 10px;">
                                <div>
                                    <small>Limite</small>
                                    <p>R$ ${card.limit.toFixed(2)}</p>
                                </div>
                                <div>
                                    <small>Disponível</small>
                                    <p>R$ ${available.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
            });
        }
        
        html += `</div>`;
        area.innerHTML = html;
    }
}

requestCard() {
    const limit = parseFloat(prompt('Limite desejado (R$):', '5000'));
    if (!limit || limit <= 0) return;
    
    const card = DB.createCard(this.user.id, limit);
    NotificationSystem.success('Cartão Aprovado', `Cartão com limite de R$ ${limit.toFixed(2)} criado!`);
    this.showAction('cartoes');
}
```

---

### 2. Sistema de Empréstimos

**Adicionar ao DB.seed():**
```javascript
loans: [],
```

**Adicionar função no DB:**
```javascript
createLoan(accountId, amount, installments) {
    const rate = 2.5; // % ao mês
    const installmentValue = (amount * Math.pow(1 + rate/100, installments) * (rate/100)) / 
                             (Math.pow(1 + rate/100, installments) - 1);
    
    const loan = {
        id: Date.now(),
        accountId: accountId,
        amount: amount,
        installments: installments,
        installmentValue: installmentValue,
        paidInstallments: 0,
        rate: rate,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    this.data.loans.push(loan);
    this.save();
    return loan;
}
```

**Adicionar no Internet Banking:**
```javascript
showAction(act) {
    // ... código existente ...
    
    else if(act === 'emprestimos') {
        let html = `<div class="card">
            <h3>SIMULADOR DE EMPRÉSTIMO</h3>
            <input type="number" id="loan-amount" placeholder="Valor (R$)">
            <select id="loan-installments">
                <option value="12">12x</option>
                <option value="24">24x</option>
                <option value="36">36x</option>
                <option value="48">48x</option>
            </select>
            <button class="btn" onclick="IBManager.simulateLoan()">Simular</button>
            <div id="loan-result" style="margin-top: 20px;"></div>
        </div>`;
        
        area.innerHTML = html;
    }
}

simulateLoan() {
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const installments = parseInt(document.getElementById('loan-installments').value);
    
    if (!amount || amount <= 0) {
        NotificationSystem.error('Erro', 'Valor inválido');
        return;
    }
    
    const rate = 2.5; // % ao mês
    const installmentValue = (amount * Math.pow(1 + rate/100, installments) * (rate/100)) / 
                             (Math.pow(1 + rate/100, installments) - 1);
    const total = installmentValue * installments;
    const interest = total - amount;
    
    const result = document.getElementById('loan-result');
    result.innerHTML = `
        <div style="border: 1px solid var(--matrix-green); padding: 15px; margin-top: 10px;">
            <h4>RESULTADO DA SIMULAÇÃO</h4>
            <p>Valor Solicitado: R$ ${amount.toFixed(2)}</p>
            <p>Parcelas: ${installments}x de R$ ${installmentValue.toFixed(2)}</p>
            <p>Total a Pagar: R$ ${total.toFixed(2)}</p>
            <p>Juros: R$ ${interest.toFixed(2)}</p>
            <button class="btn btn-success" onclick="IBManager.requestLoan(${amount}, ${installments})">
                Contratar Empréstimo
            </button>
        </div>
    `;
}

requestLoan(amount, installments) {
    const account = DB.getAccount(this.user.id);
    
    // Creditar valor na conta
    account.balance += amount;
    
    // Criar empréstimo
    const loan = DB.createLoan(this.user.id, amount, installments);
    
    // Registrar transação
    DB.addTransaction(this.user.id, {
        desc: `Empréstimo contratado - ${installments}x`,
        v: amount,
        d: new Date().toLocaleDateString('pt-BR')
    });
    
    DB.save();
    NotificationSystem.success('Empréstimo Aprovado', `R$ ${amount.toFixed(2)} creditado na conta!`);
    this.updateDash();
}
```

---

### 3. Cheque Especial

**Adicionar ao createAccount() no DB:**
```javascript
overdraft: {
    enabled: false,
    limit: 0,
    used: 0,
    rate: 8.0 // % ao mês
}
```

**Modificar validação de saque:**
```javascript
// No AtendimentoManager.execute(), modificar validação de saque:
if(type === 'saque') {
    const availableBalance = acc.balance + (acc.overdraft.enabled ? acc.overdraft.limit - acc.overdraft.used : 0);
    
    if(availableBalance < val) {
        NotificationSystem.error('Erro de Saldo', 'Fundos insuficientes');
        return;
    }
    
    // Se usar cheque especial
    if(acc.balance < val) {
        const overdraftUsed = val - acc.balance;
        acc.overdraft.used += overdraftUsed;
        acc.balance = 0;
    } else {
        acc.balance -= val;
    }
    
    // ... resto do código
}
```

---

### 4. Investimentos Simplificado

**Adicionar ao DB.seed():**
```javascript
investments: []
```

**Adicionar no Internet Banking:**
```javascript
showAction(act) {
    // ... código existente ...
    
    else if(act === 'investimentos') {
        let html = `<div class="card">
            <h3>INVESTIMENTOS</h3>
            <div class="grid-3">
                <div class="card" style="cursor: pointer;" onclick="IBManager.showInvestmentType('CDB')">
                    <h4>CDB</h4>
                    <p>110% do CDI</p>
                    <small>Risco: Baixo</small>
                </div>
                <div class="card" style="cursor: pointer;" onclick="IBManager.showInvestmentType('POUPANCA')">
                    <h4>Poupança</h4>
                    <p>6% ao ano</p>
                    <small>Risco: Muito Baixo</small>
                </div>
                <div class="card" style="cursor: pointer;" onclick="IBManager.showInvestmentType('ACOES')">
                    <h4>Ações</h4>
                    <p>12% ao ano</p>
                    <small>Risco: Alto</small>
                </div>
            </div>
            <div id="investment-detail"></div>
        </div>`;
        
        // Listar investimentos ativos
        const investments = DB.data.investments.filter(i => i.accountId == this.user.id && i.status === 'active');
        if (investments.length > 0) {
            html += `<div class="card">
                <h3>MEUS INVESTIMENTOS</h3>`;
            investments.forEach(inv => {
                html += `
                    <div style="border: 1px solid #333; padding: 10px; margin: 5px 0;">
                        <strong>${inv.type}</strong> - R$ ${inv.amount.toFixed(2)}
                        <button class="btn btn-small" onclick="IBManager.redeemInvestment(${inv.id})">Resgatar</button>
                    </div>`;
            });
            html += `</div>`;
        }
        
        area.innerHTML = html;
    }
}

showInvestmentType(type) {
    const rates = { CDB: 13.75, POUPANCA: 6, ACOES: 12 };
    const detail = document.getElementById('investment-detail');
    
    detail.innerHTML = `
        <div class="card" style="border: 2px solid var(--matrix-green);">
            <h4>Investir em ${type}</h4>
            <input type="number" id="inv-amount" placeholder="Valor (R$)">
            <input type="number" id="inv-months" placeholder="Meses" value="12">
            <button class="btn" onclick="IBManager.applyInvestment('${type}')">Aplicar</button>
        </div>
    `;
}

applyInvestment(type) {
    const amount = parseFloat(document.getElementById('inv-amount').value);
    const months = parseInt(document.getElementById('inv-months').value);
    
    if (!amount || amount <= 0) {
        NotificationSystem.error('Erro', 'Valor inválido');
        return;
    }
    
    const account = DB.getAccount(this.user.id);
    if (account.balance < amount) {
        NotificationSystem.error('Erro', 'Saldo insuficiente');
        return;
    }
    
    // Debitar da conta
    account.balance -= amount;
    
    // Criar investimento
    const investment = {
        id: Date.now(),
        accountId: this.user.id,
        type: type,
        amount: amount,
        months: months,
        startDate: new Date().toISOString(),
        status: 'active'
    };
    
    DB.data.investments.push(investment);
    DB.save();
    
    NotificationSystem.success('Investimento Realizado', `R$ ${amount.toFixed(2)} aplicado em ${type}`);
    this.updateDash();
    this.showAction('investimentos');
}

redeemInvestment(id) {
    const investment = DB.data.investments.find(i => i.id === id);
    if (!investment) return;
    
    const account = DB.getAccount(investment.accountId);
    
    // Simular rendimento (simplificado)
    const monthsPassed = Math.floor((Date.now() - new Date(investment.startDate)) / (1000 * 60 * 60 * 24 * 30));
    const rate = 0.01; // 1% ao mês
    const finalValue = investment.amount * Math.pow(1 + rate, monthsPassed);
    
    // Creditar na conta
    account.balance += finalValue;
    investment.status = 'redeemed';
    
    DB.save();
    NotificationSystem.success('Resgate Realizado', `R$ ${finalValue.toFixed(2)} creditado na conta`);
    this.updateDash();
    this.showAction('investimentos');
}
```

---

### 5. Melhorias no Dashboard

**Adicionar botão de cartões no grid:**
```html
<!-- No index.html, adicionar no grid-4 do Internet Banking: -->
<button class="btn" onclick="IBManager.showAction('cartoes')">CARTÕES</button>
<button class="btn" onclick="IBManager.showAction('emprestimos')">EMPRÉSTIMOS</button>
```

---

## 🎨 Melhorias Visuais

### Adicionar ao style.css:

```css
/* Cartões de crédito */
.credit-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 15px;
    padding: 20px;
    color: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* Botões pequenos */
.btn-small {
    padding: 5px 10px;
    font-size: 0.8rem;
}

/* Gráficos simples */
.progress-bar {
    width: 100%;
    height: 20px;
    background: #111;
    border: 1px solid var(--matrix-green);
    border-radius: 10px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--matrix-green), var(--success));
    transition: width 0.3s ease;
}
```

---

## 📊 Próximos Passos

1. ✅ Implementar cartões de crédito
2. ✅ Implementar empréstimos
3. ✅ Implementar cheque especial
4. ✅ Implementar investimentos básicos
5. ⏳ Adicionar gráficos de gastos
6. ⏳ Adicionar categorização de transações
7. ⏳ Adicionar metas de economia
8. ⏳ Adicionar alertas personalizados

---

## 🔧 Como Implementar

1. Copie o código de cada seção
2. Cole no local indicado do seu `script.js`
3. Teste cada funcionalidade individualmente
4. Ajuste conforme necessário

---

**Dica:** Implemente uma funcionalidade por vez e teste antes de adicionar a próxima!
