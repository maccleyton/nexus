// --- MATRIX RAIN EFFECT ---
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$@#%';
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#0F0';
	ctx.font = fontSize + 'px monospace';
	for (let i = 0; i < drops.length; i++) {
		const text = letters.charAt(Math.floor(Math.random() * letters.length));
		ctx.fillText(text, i * fontSize, drops[i] * fontSize);
		if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
		drops[i]++;
	}
}
setInterval(drawMatrix, 33);
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

// --- AUTH ---
const AdminAuth = {
	login() {
		const u = document.getElementById('admin-user').value;
		const p = document.getElementById('admin-pass').value;
		// Usuário 'nexus' ou 'cosmos'
		if((u === 'nexus' || u === 'cosmos') && p === '0099') {
			document.getElementById('lock-screen').style.display = 'none';
			document.getElementById('admin-content').style.display = 'block';
			AgenciaManager.init();
		} else {
			document.getElementById('admin-error').innerText = "ACESSO NEGADO";
		}
	},
	logout() {
		document.getElementById('lock-screen').style.display = 'flex';
		document.getElementById('admin-content').style.display = 'none';
		document.getElementById('admin-pass').value = '';
	}
};

// --- DB CORE ---
const DB = {
	key: 'nexus_db_v1',
	data: null,
	init() {
		const s = localStorage.getItem(this.key);
		this.data = s ? JSON.parse(s) : this.seed();
	},
	save() { localStorage.setItem(this.key, JSON.stringify(this.data)); },
	seed() {
		return {
			config: { totalSystemCash: 3500000 },
			treasury: { vault: 2000000 },
			humanCashier: 0,
			atms: {
				atmA: this.createAtm(3000), atmB: this.createAtm(3000),
				atmC: this.createAtm(1800), atmD: this.createAtm(1800)
			},
			accounts: [
				{id:1, name:"Neo", balance:1000000, pw:"123", pt:"1234", hist:[], active:true},
				{id:2, name:"Trinity", balance:1000000, pw:"123", pt:"1234", hist:[], active:true},
				{id:3, name:"Morpheus", balance:1000000, pw:"123", pt:"1234", hist:[], active:true},
				{id:4, name:"Smith", balance:1000000, pw:"123", pt:"1234", hist:[], active:true}
			]
		};
	},
	createAtm(cap) {
		return { drawers: [{face:100, count:cap, max:cap}, {face:50, count:cap, max:cap}, {face:20, count:cap, max:cap}, {face:10, count:cap, max:cap}] }
	}
};

// --- UI MANAGERS ---
const Tabs = {
	show(id) {
		document.querySelectorAll('[id^="tab-"]').forEach(e => e.style.display = 'none');
		document.getElementById('tab-'+id).style.display = 'block';
		document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
		event.target.classList.add('active');
	}
};

const AgenciaManager = {
	init() { this.updateSummary(); this.renderATMs(); this.renderAccounts(); },
	getAtmTotal(atm) { return atm.drawers.reduce((acc, d) => acc + (d.face * d.count), 0); },
	
	updateSummary() {
		const d = DB.data;
		let atmTotal = 0;
		Object.values(d.atms).forEach(a => atmTotal += this.getAtmTotal(a));
		const totalSys = d.treasury.vault + d.humanCashier + atmTotal;
		
		document.getElementById('adm-total').innerText = totalSys.toLocaleString('pt-BR');
		document.getElementById('adm-cofre').innerText = d.treasury.vault.toLocaleString('pt-BR');
		document.getElementById('adm-atms').innerText = atmTotal.toLocaleString('pt-BR');
		document.getElementById('adm-caixa-val').innerText = d.humanCashier.toLocaleString('pt-BR');
		document.getElementById('human-cash-balance').innerText = d.humanCashier.toLocaleString('pt-BR');
	},

	humanRefill() {
		const val = parseFloat(document.getElementById('human-op-val').value);
		if(!val || val <= 0) return alert("VALOR INVÁLIDO");
		if(DB.data.treasury.vault < val) return alert("COFRE VAZIO");
		DB.data.treasury.vault -= val; DB.data.humanCashier += val;
		DB.save(); this.init(); alert("ABASTECIMENTO COMPLETO");
	},
	humanRelieve() {
		const val = parseFloat(document.getElementById('human-op-val').value);
		if(!val || val <= 0) return alert("VALOR INVÁLIDO");
		if(DB.data.humanCashier < val) return alert("FUNDOS INSUFICIENTES");
		DB.data.humanCashier -= val; DB.data.treasury.vault += val;
		DB.save(); this.init(); alert("ALÍVIO COMPLETO");
	},

	renderATMs() {
		const grid = document.getElementById('terminals-grid');
		grid.innerHTML = '';
		Object.keys(DB.data.atms).forEach(id => {
			const atm = DB.data.atms[id];
			let html = `<div class="card">
				<div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #005500;">
					<strong>NÓ_${id.replace('atm','')}</strong>
					<span>TOTAL: ${this.getAtmTotal(atm).toLocaleString('pt-BR')}</span>
				</div>`;
			atm.drawers.forEach((d, idx) => {
				const pct = (d.count / d.max) * 100;
				html += `<div class="drawer-row">
					<input type="number" style="margin:0; width:60px" value="${d.face}" onchange="AgenciaManager.setFace('${id}',${idx},this.value)">
					<small>${d.count}/${d.max}</small>
					<input type="number" id="in-${id}-${idx}" placeholder="QTD" style="margin:0; width:60px;">
					<div class="capacity-bar"><div class="cap-fill" style="width:${pct}%"></div></div>
				</div>`;
			});
			html += `<div class="grid-2" style="margin-top:10px;">
				<button class="btn" onclick="AgenciaManager.atmOp('${id}', 'add')">ABASTECER</button>
				<button class="btn btn-warn" onclick="AgenciaManager.atmOp('${id}', 'sub')">ALIVIAR</button>
			</div></div>`;
			grid.innerHTML += html;
		});
	},

	setFace(id, idx, val) { DB.data.atms[id].drawers[idx].face = parseFloat(val); DB.save(); this.init(); },

	calculateDynamic() {
		Object.keys(DB.data.atms).forEach(id => {
			DB.data.atms[id].drawers.forEach((d, idx) => {
				const target = Math.floor(d.max * 0.8);
				const diff = target - d.count;
				if(diff > 0) document.getElementById(`in-${id}-${idx}`).value = diff;
			});
		});
		alert("DISTRIBUIÇÃO CALCULADA. PRONTO PARA EXECUTAR.");
	},

	atmOp(id, mode) {
		const atm = DB.data.atms[id];
		let cost = 0; let err = null;
		atm.drawers.forEach((d, idx) => {
			const qty = parseInt(document.getElementById(`in-${id}-${idx}`).value) || 0;
			if(qty > 0) {
				if(mode === 'add') {
					if(d.count + qty > d.max) err = "ESTOURO DE CAPACIDADE";
					cost += (qty * d.face);
				} else if(d.count - qty < 0) err = "FALTA DE SALDO";
			}
		});
		if(err) return alert(err);
		if(mode === 'add' && DB.data.treasury.vault < cost) return alert("COFRE VAZIO");

		atm.drawers.forEach((d, idx) => {
			const qty = parseInt(document.getElementById(`in-${id}-${idx}`).value) || 0;
			if(qty > 0) {
				const val = qty * d.face;
				if(mode === 'add') { d.count += qty; DB.data.treasury.vault -= val; }
				else { d.count -= qty; DB.data.treasury.vault += val; }
				document.getElementById(`in-${id}-${idx}`).value = '';
			}
		});
		DB.save(); this.init(); alert("CMD EXECUTADO");
	},

	renderAccounts() {
		const list = document.getElementById('accounts-list');
		list.innerHTML = DB.data.accounts.map(a => {
			if(a.active === false) return '';
			return `<tr style="border-bottom:1px solid #111;">
				<td>${a.id}</td><td>${a.name}</td>
				<td style="color:var(--matrix-green)">${a.balance.toLocaleString('pt-BR')}</td>
				<td>${a.pw}/${a.pt}</td>
				<td>
					<button class="btn-danger" style="padding:2px 5px; font-size:0.7rem;" onclick="AgenciaManager.closeAccount(${a.id})">FIM</button>
					<button class="btn-warn" style="padding:2px 5px; font-size:0.7rem;" onclick="AgenciaManager.resetPass(${a.id})">RST</button>
				</td>
			</tr>`;
		}).join('');
	},

	createAccount() {
		const name = document.getElementById('new-name').value;
		const pw = document.getElementById('new-pass-web').value;
		const pt = document.getElementById('new-pass-trans').value;
		if(!name || !pw || !pt) return alert("DADOS FALTANDO");
		const newId = DB.data.accounts.length + 1;
		DB.data.accounts.push({id: newId, name: name, balance: 0, pw: pw, pt: pt, hist: [], active: true});
		DB.save(); this.renderAccounts(); document.getElementById('new-name').value=''; alert("ENTIDADE CRIADA");
	},
	closeAccount(id) {
		const acc = DB.data.accounts.find(a => a.id == id);
		if(acc.balance !== 0) return alert("SALDO NÃO É ZERO");
		if(confirm("ENCERRAR ENTIDADE?")) { acc.active = false; DB.save(); this.renderAccounts(); }
	},
	resetPass(id) {
		const acc = DB.data.accounts.find(a => a.id == id);
		if(confirm("RESETAR CHAVES?")) { acc.pw = "123"; acc.pt = "1234"; DB.save(); this.renderAccounts(); alert("CHAVES RESETADAS"); }
	}
};

const AtendimentoManager = {
	curr: null,
	openTerminal(id) {
		this.curr = id;
		document.getElementById('lobby-select').style.display = 'none';
		document.getElementById('terminal-interface').style.display = 'block';
		document.getElementById('term-title').innerText = id === 'caixa' ? "INTERFACE_HUMANA" : `NÓ_${id.replace('atm','').toUpperCase()}`;
		const dest = document.getElementById('op-dest');
		const type = document.getElementById('op-type');
		type.onchange = () => { dest.style.display = (type.value === 'transferencia') ? 'block' : 'none'; };
	},
	closeTerminal() {
		document.getElementById('lobby-select').style.display = 'flex';
		document.getElementById('terminal-interface').style.display = 'none';
	},
	execute() {
		const id = document.getElementById('op-conta').value;
		const pt = document.getElementById('op-senha').value;
		const type = document.getElementById('op-type').value;
		const val = parseFloat(document.getElementById('op-valor').value);
		const destId = document.getElementById('op-dest').value;

		if(!val || val <= 0) return alert("VALOR INVÁLIDO");
		if(this.curr !== 'caixa' && !Number.isInteger(val)) return alert("APENAS VALORES INTEIROS EM NÓS");

		const acc = DB.data.accounts.find(a => a.id == id && a.pt == pt);
		if(!acc || acc.active === false) return alert("FALHA NA AUTENTICAÇÃO");

		if(type === 'saque') {
			if(acc.balance < val) return alert("FUNDOS INSUFICIENTES");
			if(this.curr === 'caixa') {
				if(DB.data.humanCashier < val) return alert("CACHE FÍSICO VAZIO");
				DB.data.humanCashier -= val;
			} else {
				const atm = DB.data.atms[this.curr];
				if(AgenciaManager.getAtmTotal(atm) < val) return alert("NÓ VAZIO");
				let rem = val;
				const drawers = [...atm.drawers].sort((a,b)=>b.face-a.face);
				for(let d of drawers) {
					if(rem<=0) break;
					let take = Math.min(Math.floor(rem/d.face), d.count);
					d.count -= take; rem -= (take*d.face);
				}
				if(rem > 0) { DB.init(); return alert("ERRO DE DENOMINAÇÃO"); }
			}
			acc.balance -= val; acc.hist.push({desc:`SAQUE ${this.curr}`, v:-val, d:new Date().toLocaleDateString('pt-BR')});
		
		} else if(type === 'deposito') {
			acc.balance += val;
			if(this.curr === 'caixa') DB.data.humanCashier += val;
			else { const atm = DB.data.atms[this.curr]; atm.drawers[0].count += Math.floor(val/100); }
			acc.hist.push({desc:`DEPÓSITO ${this.curr}`, v:val, d:new Date().toLocaleDateString('pt-BR')});
		
		} else if(type === 'transferencia') {
			 const dest = DB.data.accounts.find(a => a.id == destId);
			 if(!dest || dest.active === false) return alert("DESTINO DESCONHECIDO");
			 if(acc.balance < val) return alert("FUNDOS INSUFICIENTES");
			 acc.balance -= val; dest.balance += val;
			 acc.hist.push({desc:`TRANSF > ${destId}`, v:-val, d:new Date().toLocaleDateString('pt-BR')});
			 dest.hist.push({desc:`TRANSF < ${acc.id}`, v:val, d:new Date().toLocaleDateString('pt-BR')});
		} else if(type === 'pagamento') {
			 if(acc.balance < val) return alert("FUNDOS INSUFICIENTES");
			 acc.balance -= val; acc.hist.push({desc:`PAGAMENTO`, v:-val, d:new Date().toLocaleDateString('pt-BR')});
		}
		DB.save(); alert("SUCESSO"); document.getElementById('op-valor').value = '';
	}
};

const IBManager = {
	user: null,
	login() {
		const u = document.getElementById('ib-user').value;
		const p = document.getElementById('ib-pass').value;
		const acc = DB.data.accounts.find(a => a.id == u && a.pw == p);
		if(acc && acc.active !== false) {
			this.user = acc; document.getElementById('ib-login-screen').style.display='none';
			document.getElementById('ib-dashboard').style.display='block'; this.updateDash();
		} else alert("FALHA NA AUTENTICAÇÃO");
	},
	logout() { location.reload(); },
	updateDash() {
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		document.getElementById('ib-welcome').innerText = `USUÁRIO: ${acc.name}`;
		document.getElementById('ib-balance').innerText = acc.balance.toLocaleString('pt-BR');
	},
	showAction(act) {
		const area = document.getElementById('ib-action-area'); area.innerHTML = '';
		if(act === 'extrato') {
			let html = `<div class="card"><h3>LOGS</h3><ul style="list-style:none">`;
			this.user.hist.reverse().forEach(h => {
				html += `<li style="border-bottom:1px solid #111; padding:5px; display:flex; justify-content:space-between">
					<span>${h.d} - ${h.desc}</span><span style="color:${h.v<0?'var(--alert)':'var(--matrix-green)'}">${h.v.toFixed(2)}</span></li>`;
			});
			area.innerHTML = html + '</ul></div>';
		} else if(act === 'pix') {
			area.innerHTML = `<div class="card"><h3>TRANSFERÊNCIA PIX</h3><input id="pix-dest" placeholder="ID DEST"><input id="pix-val" type="number" placeholder="VAL"><button class="btn" onclick="IBManager.execPix()">ENVIAR</button></div>`;
		} else if(act === 'pagar') {
			area.innerHTML = `<div class="card"><h3>PAGAMENTO BOLETO</h3><input placeholder="CÓDIGO BARRAS"><input id="pag-val" type="number" placeholder="VAL"><button class="btn" onclick="IBManager.execPay()">PAGAR</button></div>`;
		}
	},
	execPix() {
		const destId = document.getElementById('pix-dest').value;
		const val = parseFloat(document.getElementById('pix-val').value);
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		if(acc.balance < val) return alert("FUNDOS INSUFICIENTES");
		const destAcc = DB.data.accounts.find(a => a.id == destId);
		acc.balance -= val; acc.hist.push({desc:`PIX > ${destId}`, v:-val, d:new Date().toLocaleDateString('pt-BR')});
		if(destAcc && destAcc.active !== false) { destAcc.balance += val; destAcc.hist.push({desc:`PIX < ${acc.id}`, v:val, d:new Date().toLocaleDateString('pt-BR')}); }
		DB.save(); this.updateDash(); alert("ENVIADO");
	},
	execPay() {
		const val = parseFloat(document.getElementById('pag-val').value);
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		if(acc.balance < val) return alert("FUNDOS INSUFICIENTES");
		acc.balance -= val; acc.hist.push({desc:`PAGAMENTO`, v:-val, d:new Date().toLocaleDateString('pt-BR')});
		DB.save(); this.updateDash(); alert("PAGO");
	}
};

const Router = {
	go(id) {
		document.querySelectorAll('.view-section').forEach(e => e.classList.remove('active'));
		document.getElementById('view-'+id).classList.add('active');
		
		// --- FIX: Forçar atualização ao navegar ---
		if(id === 'agencia' && document.getElementById('admin-content').style.display === 'block') {
			AgenciaManager.init();
		}
		if(id === 'internetbanking' && IBManager.user) {
			IBManager.updateDash();
		}
	}
};

DB.init(); Router.go('hub');
