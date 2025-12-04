// --- NEXUS BANK CORE LOGIC v3.0 ---

// CONFIGURAÇÕES E ESTADO GLOBAL
const Config = {
    bills: [200, 100, 50, 20, 10, 5, 2],
    limits: {
        tellerMax: 10000,
        drawerLarge: 3000, // Terminais A e B
        drawerSmall: 1800  // Terminais C e D
    }
};

const DB = {
    users: [
        { id: 1001, name: "Neo Anderson", passWeb: "123", balance: 5000, investments: [], extract: [] }
    ],
    // Estrutura física do banco
    infrastructure: {
        vaultA: 0,
        vaultB: 0,
        teller: 0, // Guichê
        terminals: {
            'A': { type: 'large', cash: 0, drawers: { 100:0, 50:0, 20:0, 10:0, generic:0 } },
            'B': { type: 'large', cash: 0, drawers: { 100:0, 50:0, 20:0, 10:0, generic:0 } },
            'C': { type: 'small', cash: 0, drawers: { 100:0, 50:0, 20:0, 10:0, generic:0 } },
            'D': { type: 'small', cash: 0, drawers: { 100:0, 50:0, 20:0, 10:0, generic:0 } }
        }
    }
};

// --- GERENCIADOR DE ROTAS ---
const Router = {
    go: (viewId) => {
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        document.getElementById(`view-${viewId}`).classList.add('active');
    }
};

// --- MÓDULO ADMINISTRATIVO (Lógica de Distribuição) ---
const Admin = {
    currentUser: null,
    
    login: () => {
        const u = document.getElementById('adm-user').value.toLowerCase();
        const p = document.getElementById('adm-pass').value;
        if ((u === 'cosmos' && p === '0099') || (u === 'nexus' && p === '0909')) {
            document.getElementById('admin-login').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
            Admin.currentUser = u;
            CashManager.updateMonitor();
        } else {
            alert('ACESSO NEGADO: Credenciais inválidas.');
        }
    },
    logout: () => {
        location.reload();
    }
};

const CashManager = {
    tempDistribution: null,

    calculateDistribution: () => {
        const total = parseFloat(document.getElementById('cash-request-val').value);
        if (!total || total <= 0) return alert("Valor inválido");

        // Regra 1: 50% para Cofres/Guichê, 50% para ATMs
        const half = total * 0.5;
        
        // Logica Guichê (Limite 10k)
        let tellerVal = 10000;
        let vaultsTotal = half - tellerVal;
        
        // Se 50% for menor que 10k, tudo vai pro caixa (caso de contorno)
        if (half < 10000) { tellerVal = half; vaultsTotal = 0; }

        const vaultA = vaultsTotal / 2;
        const vaultB = vaultsTotal / 2;

        // Logica ATMs (31%, 31%, 19%, 19% dos 50% destinados aos ATMs)
        const atmTotal = half;
        const atmA = atmTotal * 0.31;
        const atmB = atmTotal * 0.31;
        const atmC = atmTotal * 0.19;
        const atmD = atmTotal * 0.19;

        // Armazenar para execução
        this.tempDistribution = { tellerVal, vaultA, vaultB, atmA, atmB, atmC, atmD };

        // Renderizar Resultado
        document.getElementById('dist-results').style.display = 'block';
        
        document.getElementById('res-group1').innerHTML = `
            <li>GUICHÊ (Max 10k): <strong>R$ ${tellerVal.toFixed(2)}</strong></li>
            <li>COFRE A: R$ ${vaultA.toFixed(2)}</li>
            <li>COFRE B: R$ ${vaultB.toFixed(2)}</li>
        `;

        document.getElementById('res-group2').innerHTML = `
            <li>TERM A (31%): R$ ${atmA.toFixed(2)} (${this.estimateBills(atmA)} cédulas aprox)</li>
            <li>TERM B (31%): R$ ${atmB.toFixed(2)}</li>
            <li>TERM C (19%): R$ ${atmC.toFixed(2)}</li>
            <li>TERM D (19%): R$ ${atmD.toFixed(2)}</li>
        `;
    },

    // Função auxiliar simples para estimar volume de cédulas (média R$ 50)
    estimateBills: (val) => Math.floor(val / 50),

    executeDistribution: () => {
        if (!this.tempDistribution) return;
        const d = this.tempDistribution;
        
        // Atualizar DB
        DB.infrastructure.teller += d.tellerVal;
        DB.infrastructure.vaultA += d.vaultA;
        DB.infrastructure.vaultB += d.vaultB;
        
        // Função para encher gavetas (simplificada para o demo)
        const fillATM = (id, amount) => {
            DB.infrastructure.terminals[id].cash += amount;
            // Distribuir nas gavetas (lógica fictícia de carregamento equilibrado)
            // Na versão real, dividiria amount pelas notas de 100, 50, 20, 10
            DB.infrastructure.terminals[id].drawers[100] += Math.floor((amount * 0.4) / 100);
            DB.infrastructure.terminals[id].drawers[50] += Math.floor((amount * 0.3) / 50);
            DB.infrastructure.terminals[id].drawers[20] += Math.floor((amount * 0.2) / 20);
            DB.infrastructure.terminals[id].drawers[10] += Math.floor((amount * 0.1) / 10);
        };

        fillATM('A', d.atmA);
        fillATM('B', d.atmB);
        fillATM('C', d.atmC);
        fillATM('D', d.atmD);

        alert('ABASTECIMENTO CONCLUÍDO COM SUCESSO.');
        CashManager.updateMonitor();
    },

    updateMonitor: () => {
        const grid = document.getElementById('atm-monitor-grid');
        grid.innerHTML = '';
        
        ['A', 'B', 'C', 'D'].forEach(id => {
            const t = DB.infrastructure.terminals[id];
            const max = t.type === 'large' ? 3000 : 1800; // Limite por gaveta
            
            // Verifica alertas
            let status = '<span style="color:#0f0">NORMAL</span>';
            if (t.drawers[100] > max) status = '<span style="color:red">GAVETA 100 CHEIA!</span>';

            grid.innerHTML += `
                <div class="card" style="font-size:0.8rem">
                    <h4>TERMINAL ${id} (${t.type.toUpperCase()})</h4>
                    <p>Status: ${status}</p>
                    <ul>
                        <li>R$ 100: ${t.drawers[100]} / ${max}</li>
                        <li>R$ 50: ${t.drawers[50]} / ${max}</li>
                        <li>R$ 20: ${t.drawers[20]} / ${max}</li>
                        <li>R$ 10: ${t.drawers[10]} / ${max}</li>
                    </ul>
                    <p>TOTAL CAIXA: R$ ${t.cash.toFixed(2)}</p>
                </div>
            `;
        });
    }
};

// --- MÓDULO INTERNET BANKING & INVESTIMENTOS ---
const IB = {
    current: null,

    login: () => {
        const id = parseInt(document.getElementById('ib-user-id').value);
        const pass = document.getElementById('ib-user-pass').value;
        const user = DB.users.find(u => u.id === id && u.passWeb === pass);

        if (user) {
            IB.current = user;
            document.getElementById('ib-login').style.display = 'none';
            document.getElementById('ib-panel').style.display = 'block';
            IB.updateUI();
        } else {
            alert('Usuário ou senha inválidos');
        }
    },

    logout: () => {
        IB.current = null;
        document.getElementById('ib-panel').style.display = 'none';
        document.getElementById('ib-login').style.display = 'block';
    },

    updateUI: () => {
        document.getElementById('ib-name').innerText = IB.current.name;
        document.getElementById('ib-balance').innerText = `R$ ${IB.current.balance.toFixed(2)}`;
        
        const tbody = document.getElementById('extract-list');
        tbody.innerHTML = '';
        IB.current.extract.forEach(item => {
            tbody.innerHTML += `<tr><td>${item.date}</td><td>${item.type}</td><td>R$ ${item.val.toFixed(2)}</td></tr>`;
        });
    },

    tab: (id) => {
        document.querySelectorAll('.ib-tab').forEach(el => el.style.display = 'none');
        document.getElementById(`ib-tab-${id}`).style.display = 'block';
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    },

    pay: () => {
        const type = document.getElementById('pay-type').value;
        const val = parseFloat(document.getElementById('pay-val').value);
        
        if (IB.current.balance >= val) {
            IB.current.balance -= val;
            IB.current.extract.push({ date: new Date().toLocaleDateString(), type: `PGTO ${type}`, val: -val });
            alert('PAGAMENTO REALIZADO');
            IB.updateUI();
        } else {
            alert('SALDO INSUFICIENTE');
        }
    }
};

const Invest = {
    selectedType: null,

    simulate: (type) => {
        Invest.selectedType = type;
        const area = document.getElementById('invest-sim-area');
        area.style.display = 'block';
        document.getElementById('sim-title').innerText = `SIMULAÇÃO: ${type}`;
        
        let desc = "";
        switch(type) {
            case 'CDB': desc = "Renda Fixa. 110% do CDI. Imposto Regressivo."; break;
            case 'ACOES': desc = "Renda Variável. Alto risco. Oscilação de mercado."; break;
            case 'POUPANCA': desc = "Isento de IR. Rendimento: 0.5% a.m + TR."; break;
            case 'TESOURO': desc = "Garantia do Tesouro Nacional. IPCA + Juros."; break;
        }
        document.getElementById('sim-desc').innerText = desc;
        
        // Listener para atualizar calculo real-time
        document.getElementById('sim-val').onkeyup = Invest.calcProjection;
        document.getElementById('sim-months').onkeyup = Invest.calcProjection;
    },

    calcProjection: () => {
        const val = parseFloat(document.getElementById('sim-val').value) || 0;
        const months = parseInt(document.getElementById('sim-months').value) || 0;
        let rate = 0;

        // Taxas ficticias
        if (Invest.selectedType === 'POUPANCA') rate = 0.006; // 0.6% am
        else if (Invest.selectedType === 'CDB') rate = 0.01; // 1% am
        else if (Invest.selectedType === 'ACOES') rate = 0.02; // 2% am (media otimista)
        else rate = 0.008;

        const total = val * Math.pow((1 + rate), months);
        const profit = total - val;
        
        // Imposto simples
        let tax = 0;
        if (Invest.selectedType !== 'POUPANCA' && Invest.selectedType !== 'LCI') {
            tax = profit * 0.15;
        }

        const final = total - tax;

        document.getElementById('sim-result').innerHTML = `
            Bruto: R$ ${total.toFixed(2)}<br>
            Imposto Est.: -R$ ${tax.toFixed(2)}<br>
            <strong>LÍQUIDO ESTIMADO: R$ ${final.toFixed(2)}</strong>
        `;
    },

    apply: () => {
        const val = parseFloat(document.getElementById('sim-val').value);
        if (IB.current.balance >= val) {
            IB.current.balance -= val;
            IB.current.investments.push({ type: Invest.selectedType, val: val, date: new Date().toLocaleDateString() });
            IB.current.extract.push({ date: new Date().toLocaleDateString(), type: `APLIC. ${Invest.selectedType}`, val: -val });
            alert('INVESTIMENTO REALIZADO COM SUCESSO');
            IB.updateUI();
            document.getElementById('invest-sim-area').style.display = 'none';
        } else {
            alert('SALDO INSUFICIENTE NA CONTA CORRENTE');
        }
    }
};

const Services = {
    openAccount: () => {
        const name = document.getElementById('new-name').value;
        const id = Math.floor(Math.random() * 10000);
        DB.users.push({ id, name, passWeb: '123', balance: 0, investments: [], extract: [] });
        alert(`CONTA ABERTA!\nCLIENTE: ${name}\nCONTA: ${id}\nSENHA WEB: 123`);
    }
};

const Tabs = {
    open: (id) => {
        document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
        document.getElementById(`tab-${id}`).style.display = 'block';
    }
};

// MATRIX RAIN VISUAL
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const letters = '0101010101XYZW';
const drops = Array(Math.floor(canvas.width/15)).fill(1);
function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0F0';
    drops.forEach((y, i) => {
        const text = letters[Math.floor(Math.random()*letters.length)];
        ctx.fillText(text, i*15, y*15);
        if(y*15 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(draw, 33);