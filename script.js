// === SISTEMA DE NOTIFICAÇÕES ===
class NotificationSystem {
	static show(title, message, type = 'info', duration = 5000) {
		const container = document.getElementById('notifications');
		const notification = document.createElement('div');
		notification.className = `notification ${type}`;
		
		notification.innerHTML = `
			<button class="close" onclick="this.parentElement.remove()">×</button>
			<div class="title">${title}</div>
			<div class="message">${message}</div>
		`;
		
		container.appendChild(notification);
		
		// Auto remove
		setTimeout(() => {
			if (notification.parentElement) {
				notification.remove();
			}
		}, duration);
		
		// Log no console
		Console.log(`${type.toUpperCase()}: ${title} - ${message}`, type);
	}
	
	static success(title, message) {
		this.show(title, message, 'success');
	}
	
	static error(title, message) {
		this.show(title, message, 'error');
	}
	
	static warning(title, message) {
		this.show(title, message, 'warning');
	}
	
	static info(title, message) {
		this.show(title, message, 'info');
	}
}

// === SISTEMA DE CONSOLE ===
class Console {
	static init() {
		this.log('Console Matrix inicializado', 'info');
		this.updateTime();
		setInterval(() => this.updateTime(), 1000);
	}
	
	static log(message, type = 'info') {
		const container = document.getElementById('console-content');
		const entry = document.createElement('div');
		entry.className = `log-entry ${type}`;
		
		const time = new Date().toLocaleTimeString();
		entry.innerHTML = `
			<div class="log-time">${time}</div>
			<div>${message}</div>
		`;
		
		container.appendChild(entry);
		container.scrollTop = container.scrollHeight;
		
		// Limita a 50 entradas
		while (container.children.length > 50) {
			container.removeChild(container.firstChild);
		}
	}
	
	static updateTime() {
		const timeElements = document.querySelectorAll('.log-time');
		const now = new Date().toLocaleTimeString();
		timeElements.forEach(el => {
			if (el.textContent.includes('::')) {
				el.textContent = `${now} :: system_time`;
			}
		});
	}
	
	static clear() {
		document.getElementById('console-content').innerHTML = '';
		this.log('Console limpo', 'info');
	}
	
	static toggle() {
		const panel = document.getElementById('console-panel');
		const toggle = document.getElementById('console-toggle');
		
		panel.classList.toggle('active');
		toggle.textContent = panel.classList.contains('active') ? 'MIN' : 'MAX';
		
		if (panel.classList.contains('active')) {
			this.log('Console expandido', 'info');
		} else {
			this.log('Console minimizado', 'info');
		}
	}
}

// === MATRIX RAIN EFFECT (Melhorado) ===
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$@#%<>/\\|{}[]()+-=*';
const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1).map(() => Math.random() * canvas.height);

function drawMatrix() {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = '#00ff41';
	ctx.font = fontSize + 'px monospace';
	
	for (let i = 0; i < drops.length; i++) {
		const text = letters.charAt(Math.floor(Math.random() * letters.length));
		ctx.fillText(text, i * fontSize, drops[i] * fontSize);
		
		if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
			drops[i] = 0;
		}
		drops[i] += 0.5 + Math.random() * 0.5;
	}
}

setInterval(drawMatrix, 50);
window.addEventListener('resize', () => { 
	canvas.width = window.innerWidth; 
	canvas.height = window.innerHeight; 
});

// === AUTENTICAÇÃO ADMIN ===
const AdminAuth = {
	login() {
		Console.log('Tentativa de acesso admin iniciada', 'info');
		
		const u = document.getElementById('admin-user').value;
		const p = document.getElementById('admin-pass').value;
		
		if((u === 'nexus' || u === 'cosmos') && p === '0099') {
			Console.log(`Acesso autorizado para usuário: ${u}`, 'success');
			NotificationSystem.success('Acesso Autorizado', `Usuário ${u} conectado ao mainframe`);
			
			document.getElementById('lock-screen').style.display = 'none';
			document.getElementById('admin-content').style.display = 'block';
			AgenciaManager.init();
			
			// Atualizar métricas
			AdminManager.updateMetrics();
		} else {
			Console.log(`Tentativa de acesso falha para usuário: ${u}`, 'error');
			NotificationSystem.error('Acesso Negado', 'Credenciais inválidas');
			document.getElementById('admin-error').innerText = "ACESSO NEGADO";
		}
	},
	
	logout() {
		Console.log('Logout admin executado', 'warning');
		NotificationSystem.warning('Sessão Encerrada', 'Usuário desconectado do mainframe');
		
		document.getElementById('lock-screen').style.display = 'flex';
		document.getElementById('admin-content').style.display = 'none';
		document.getElementById('admin-pass').value = '';
	}
};

// === BASE DE DADOS ===
const DB = {
	key: 'nexus_db_v2',
	data: null,
	
	init() {
		Console.log('Inicializando banco de dados', 'info');
		const s = localStorage.getItem(this.key);
		this.data = s ? JSON.parse(s) : this.seed();
		this.save();
		Console.log('Banco de dados carregado', 'success');
	},
	
	save() {
		localStorage.setItem(this.key, JSON.stringify(this.data));
	},
	
	seed() {
		Console.log('Criando dados iniciais do sistema', 'info');
		return {
			config: { 
				totalSystemCash: 3500000,
				lastBackup: new Date().toISOString(),
				systemVersion: '2.0'
			},
			treasury: { vault: 2000000 },
			humanCashier: 0,
			atms: {
				atmA: this.createAtm(3000), 
				atmB: this.createAtm(3000),
				atmC: this.createAtm(1800), 
				atmD: this.createAtm(1800)
			},
			accounts: [
				{id:1, name:"Neo", balance:1000000, pw:"123", pt:"1234", hist:[], active:true, createdAt:new Date().toISOString()},
				{id:2, name:"Trinity", balance:1000000, pw:"123", pt:"1234", hist:[], active:true, createdAt:new Date().toISOString()},
				{id:3, name:"Morpheus", balance:1000000, pw:"123", pt:"1234", hist:[], active:true, createdAt:new Date().toISOString()},
				{id:4, name:"Smith", balance:1000000, pw:"123", pt:"1234", hist:[], active:true, createdAt:new Date().toISOString()}
			],
			systemLogs: []
		};
	},
	
	createAtm(cap) {
		return { 
			drawers: [
				{face:100, count:cap, max:cap}, 
				{face:50, count:cap, max:cap}, 
				{face:20, count:cap, max:cap}, 
				{face:10, count:cap, max:cap}
			],
			status: 'online',
			lastMaintenance: new Date().toISOString()
		};
	},
	
	logOperation(operation, details) {
		const log = {
			timestamp: new Date().toISOString(),
			operation: operation,
			details: details,
			user: details.user || 'system'
		};
		
		this.data.systemLogs.push(log);
		
		// Limita logs a 1000 entradas
		if (this.data.systemLogs.length > 1000) {
			this.data.systemLogs = this.data.systemLogs.slice(-1000);
		}
		
		this.save();
		Console.log(`${operation}: ${details}`, 'info');
	}
};

// === GESTÃO DE ABAS ===
const Tabs = {
	show(id) {
		Console.log(`Navegando para aba: ${id}`, 'info');
		document.querySelectorAll('[id^="tab-"]').forEach(e => e.style.display = 'none');
		document.getElementById('tab-'+id).style.display = 'block';
		document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
		event.target.classList.add('active');
		
		if (id === 'logs') {
			this.loadLogs();
		}
	},
	
	loadLogs() {
		const container = document.getElementById('system-logs');
		const logs = DB.data.systemLogs.slice(-50).reverse();
		
		if (logs.length === 0) {
			container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Nenhum log encontrado</div>';
			return;
		}
		
		container.innerHTML = logs.map(log => `
			<div style="border-bottom: 1px solid #222; padding: 10px; font-size: 0.8rem;">
				<div style="color: #666; font-size: 0.7rem;">
					${new Date(log.timestamp).toLocaleString()} - ${log.user}
				</div>
				<div style="color: var(--matrix-green); font-weight: bold;">
					${log.operation}
				</div>
				<div>${log.details}</div>
			</div>
		`).join('');
	}
};

// === ADMIN MANAGER (NOVO) ===
const AdminManager = {
	updateMetrics() {
		setInterval(() => {
			const opsPerHour = this.calculateOpsPerHour();
			const activeConnections = this.getActiveConnections();
			const efficiency = this.calculateEfficiency();
			
			document.getElementById('ops-hour').textContent = opsPerHour;
			document.getElementById('active-connections').textContent = activeConnections;
			document.getElementById('system-efficiency').textContent = efficiency + '%';
		}, 5000);
	},
	
	calculateOpsPerHour() {
		const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
		const recentLogs = DB.data.systemLogs.filter(log => 
			new Date(log.timestamp) > oneHourAgo
		).length;
		
		return recentLogs;
	},
	
	getActiveConnections() {
		return Math.floor(Math.random() * 10) + 1;
	},
	
	calculateEfficiency() {
		const totalAtmCapacity = Object.values(DB.data.atms).reduce((acc, atm) => 
			acc + atm.drawers.reduce((sum, drawer) => sum + drawer.count, 0), 0
		);
		
		const maxCapacity = Object.values(DB.data.atms).reduce((acc, atm) => 
			acc + atm.drawers.reduce((sum, drawer) => sum + drawer.max, 0), 0
		);
		
		return Math.round((totalAtmCapacity / maxCapacity) * 100);
	},
	
	exportData() {
		Console.log('Exportando dados do sistema', 'info');
		const dataStr = JSON.stringify(DB.data, null, 2);
		const dataBlob = new Blob([dataStr], {type: 'application/json'});
		
		const link = document.createElement('a');
		link.href = URL.createObjectURL(dataBlob);
		link.download = `nexus_backup_${new Date().toISOString().split('T')[0]}.json`;
		link.click();
		
		NotificationSystem.success('Backup Criado', 'Dados exportados com sucesso');
	},
	
	importData() {
		Console.log('Importação de dados iniciada', 'warning');
		
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		
		input.onchange = (e) => {
			const file = e.target.files[0];
			if (!file) return;
			
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const data = JSON.parse(e.target.result);
					DB.data = data;
					DB.save();
					
					Console.log('Dados importados com sucesso', 'success');
					NotificationSystem.success('Importação Concluída', 'Dados restaurados do backup');
					
					// Recarregar interface
					if (document.getElementById('admin-content').style.display === 'block') {
						AgenciaManager.init();
					}
				} catch (error) {
					Console.log('Erro na importação: ' + error.message, 'error');
					NotificationSystem.error('Erro na Importação', 'Arquivo inválido ou corrupto');
				}
			};
			reader.readAsText(file);
		};
		
		input.click();
	}
};

// === GESTÃO DA AGÊNCIA ===
const AgenciaManager = {
	init() { 
		Console.log('Inicializando manager da agência', 'info');
		this.updateSummary(); 
		this.renderATMs(); 
		this.renderAccounts();
		this.updateHubStats();
	},
	
	getAtmTotal(atm) { 
		return atm.drawers.reduce((acc, d) => acc + (d.face * d.count), 0); 
	},
	
	updateSummary() {
		const d = DB.data;
		let atmTotal = 0;
		Object.values(d.atms).forEach(a => atmTotal += this.getAtmTotal(a));
		const totalSys = d.treasury.vault + d.humanCashier + atmTotal;
		
		document.getElementById('adm-total').textContent = totalSys.toLocaleString('pt-BR');
		document.getElementById('adm-cofre').textContent = d.treasury.vault.toLocaleString('pt-BR');
		document.getElementById('adm-atms').textContent = atmTotal.toLocaleString('pt-BR');
		document.getElementById('adm-caixa-val').textContent = d.humanCashier.toLocaleString('pt-BR');
		document.getElementById('human-cash-balance').textContent = d.humanCashier.toLocaleString('pt-BR');
	},
	
	updateHubStats() {
		const d = DB.data;
		let atmTotal = 0;
		Object.values(d.atms).forEach(a => atmTotal += this.getAtmTotal(a));
		const totalSys = d.treasury.vault + d.humanCashier + atmTotal;
		const activeAccounts = d.accounts.filter(a => a.active).length;
		
		document.getElementById('hub-total').textContent = totalSys.toLocaleString('pt-BR');
		document.getElementById('hub-cofre').textContent = d.treasury.vault.toLocaleString('pt-BR');
		document.getElementById('hub-terminais').textContent = atmTotal.toLocaleString('pt-BR');
		document.getElementById('hub-accounts').textContent = activeAccounts;
	},

	humanRefill() {
		const val = parseFloat(document.getElementById('human-op-val').value);
		if(!val || val <= 0) {
			NotificationSystem.error('Erro de Validação', 'Valor inválido especificado');
			return;
		}
		
		if(DB.data.treasury.vault < val) {
			NotificationSystem.error('Erro de Capital', 'Cofre principal sem fundos suficientes');
			return;
		}
		
		DB.data.treasury.vault -= val; 
		DB.data.humanCashier += val;
		
		DB.logOperation('ABASTECIMENTO_CAIXA', `Valor: R$ ${val.toFixed(2)}`);
		DB.save(); 
		
		this.init();
		NotificationSystem.success('Abastecimento Concluído', `R$ ${val.toFixed(2)} transferidos para caixa humano`);
	},
	
	humanRelieve() {
		const val = parseFloat(document.getElementById('human-op-val').value);
		if(!val || val <= 0) {
			NotificationSystem.error('Erro de Validação', 'Valor inválido especificado');
			return;
		}
		
		if(DB.data.humanCashier < val) {
			NotificationSystem.error('Erro de Capital', 'Caixa humano sem fundos suficientes');
			return;
		}
		
		DB.data.humanCashier -= val; 
		DB.data.treasury.vault += val;
		
		DB.logOperation('ALIVIO_CAIXA', `Valor: R$ ${val.toFixed(2)}`);
		DB.save(); 
		this.init(); 
		NotificationSystem.success('Alívio Concluído', `R$ ${val.toFixed(2)} transferidos para cofre principal`);
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
					<span class="status-${atm.status}">● ${atm.status.toUpperCase()}</span>
				</div>`;
			
			atm.drawers.forEach((d, idx) => {
				const pct = (d.count / d.max) * 100;
				const barClass = pct < 10 ? 'critical' : pct < 30 ? 'low' : '';
				
				html += `<div class="drawer-row">
					<input type="number" style="margin:0; width:60px" value="${d.face}" onchange="AgenciaManager.setFace('${id}',${idx},this.value)">
					<small>${d.count}/${d.max} (${pct.toFixed(1)}%)</small>
					<input type="number" id="in-${id}-${idx}" placeholder="QTD" style="margin:0; width:60px;">
					<div class="capacity-bar">
						<div class="cap-fill ${barClass}" style="width:${pct}%"></div>
					</div>
				</div>`;
			});
			
			html += `<div class="grid-2" style="margin-top:10px;">
				<button class="btn btn-success" onclick="AgenciaManager.atmOp('${id}', 'add')">ABASTECER</button>
				<button class="btn btn-warn" onclick="AgenciaManager.atmOp('${id}', 'sub')">ALIVIAR</button>
			</div></div>`;
			
			grid.innerHTML += html;
		});
	},

	setFace(id, idx, val) { 
		DB.data.atms[id].drawers[idx].face = parseFloat(val); 
		DB.save(); 
		this.init(); 
		Console.log(`Face atualizada para Nó ${id}: R$ ${val}`, 'info');
	},

	calculateDynamic() {
		Console.log('Executando distribuição dinâmica', 'info');
		Object.keys(DB.data.atms).forEach(id => {
			DB.data.atms[id].drawers.forEach((d, idx) => {
				const target = Math.floor(d.max * 0.8);
				const diff = target - d.count;
				if(diff > 0) document.getElementById(`in-${id}-${idx}`).value = diff;
			});
		});
		NotificationSystem.info('Distribuição Calculada', 'Pronto para execução - valores carregados nos campos');
	},
	
	autoBalance() {
		Console.log('Executando auto-balanceamento', 'info');
		NotificationSystem.info('Auto-Balance', 'Algoritmo de balanceamento aplicado');
		
		// Lógica simplificada de balanceamento
		Object.keys(DB.data.atms).forEach(id => {
			const atm = DB.data.atms[id];
			const totalValue = this.getAtmTotal(atm);
			const targetPerDrawer = totalValue / 4;
			
			atm.drawers.forEach((drawer, idx) => {
				const targetCount = Math.floor(targetPerDrawer / drawer.face);
				const input = document.getElementById(`in-${id}-${idx}`);
				if (input) {
					const currentValue = drawer.count * drawer.face;
					const diffValue = targetPerDrawer - currentValue;
					input.value = Math.floor(diffValue / drawer.face);
				}
			});
		});
	},

	atmOp(id, mode) {
		const atm = DB.data.atms[id];
		let cost = 0; 
		let err = null;
		
		atm.drawers.forEach((d, idx) => {
			const qty = parseInt(document.getElementById(`in-${id}-${idx}`).value) || 0;
			if(qty > 0) {
				if(mode === 'add') {
					if(d.count + qty > d.max) err = "Estouro de capacidade";
					cost += (qty * d.face);
				} else if(d.count - qty < 0) err = "Quantidade insuficiente";
			}
		});
		
		if(err) {
			NotificationSystem.error('Erro de Operação', err);
			return;
		}
		
		if(mode === 'add' && DB.data.treasury.vault < cost) {
			NotificationSystem.error('Erro de Capital', 'Cofre principal sem fundos suficientes');
			return;
		}

		atm.drawers.forEach((d, idx) => {
			const qty = parseInt(document.getElementById(`in-${id}-${idx}`).value) || 0;
			if(qty > 0) {
				const val = qty * d.face;
				if(mode === 'add') { 
					d.count += qty; 
					DB.data.treasury.vault -= val; 
				} else { 
					d.count -= qty; 
					DB.data.treasury.vault += val; 
				}
				document.getElementById(`in-${id}-${idx}`).value = '';
			}
		});
		
		DB.logOperation(`ATM_${mode.toUpperCase()}_${id}`, `Operação executada com custo: R$ ${cost.toFixed(2)}`);
		DB.save(); 
		this.init(); 
		NotificationSystem.success('Operação Concluída', `${mode.toUpperCase()} executado no Nó ${id}`);
	},

	renderAccounts() {
		const list = document.getElementById('accounts-list');
		list.innerHTML = DB.data.accounts.map(a => {
			if(a.active === false) return '';
			
			const statusClass = a.balance > 1000 ? 'status-online' : a.balance > 100 ? 'status-warning' : 'status-offline';
			
			return `<tr style="border-bottom:1px solid #111;">
				<td>${a.id}</td>
				<td>${a.name}</td>
				<td style="color:var(--matrix-green)">${a.balance.toLocaleString('pt-BR')}</td>
				<td>${a.pw}/${a.pt}</td>
				<td><span class="${statusClass}">● ${a.balance > 0 ? 'ATIVA' : 'INATIVA'}</span></td>
				<td>
					<button class="btn-danger" style="padding:2px 5px; font-size:0.7rem;" onclick="AgenciaManager.closeAccount(${a.id})">FIM</button>
					<button class="btn-warn" style="padding:2px 5px; font-size:0.7rem;" onclick="AgenciaManager.changePasswords(${a.id})">CHG</button>
					<button class="btn" style="padding:2px 5px; font-size:0.7rem;" onclick="AgenciaManager.resetPass(${a.id})">RST</button>
				</td>
			</tr>`;
		}).join('');
	},

	createAccount() {
		const name = document.getElementById('new-name').value;
		const pw = document.getElementById('new-pass-web').value;
		const pt = document.getElementById('new-pass-trans').value;
		
		if(!name || !pw || !pt) {
			NotificationSystem.error('Erro de Validação', 'Todos os campos devem ser preenchidos');
			return;
		}
		
		const newId = DB.data.accounts.length + 1;
		const newAccount = {
			id: newId, 
			name: name, 
			balance: 0, 
			pw: pw, 
			pt: pt, 
			hist: [], 
			active: true,
			createdAt: new Date().toISOString()
		};
		
		DB.data.accounts.push(newAccount);
		DB.logOperation('CONTA_CRIADA', `Entidade ${name} (ID: ${newId}) criada`);
		DB.save(); 
		this.renderAccounts(); 
		document.getElementById('new-name').value=''; 
		NotificationSystem.success('Entidade Criada', `Conta ${name} (ID: ${newId}) inicializada com sucesso`);
	},
	
	closeAccount(id) {
		const acc = DB.data.accounts.find(a => a.id == id);
		if(acc.balance !== 0) {
			NotificationSystem.error('Erro de Encerramento', 'Conta com saldo não-zero não pode ser encerrada');
			return;
		}
		
		if(confirm("ENCERRAR ENTIDADE? Esta ação é irreversível.")) { 
			acc.active = false; 
			DB.logOperation('CONTA_ENCERRADA', `Entidade ${acc.name} (ID: ${id}) encerrada`);
			DB.save(); 
			this.renderAccounts(); 
			NotificationSystem.warning('Entidade Encerrada', `Conta ${acc.name} foi permanentemente desativada`);
		}
	},
	
	resetPass(id) {
		const acc = DB.data.accounts.find(a => a.id == id);
		if(confirm("RESETAR CHAVES? Senhas voltarão para valores padrão.")) { 
			acc.pw = "123"; 
			acc.pt = "1234"; 
			DB.logOperation('SENHAS_RESETADAS', `Chaves resetadas para entidade ${acc.name} (ID: ${id})`);
			DB.save(); 
			this.renderAccounts(); 
			NotificationSystem.warning('Senhas Resetadas', 'Chaves de acesso restauradas para valores padrão');
		}
	},
	
	changePasswords(id) {
		const acc = DB.data.accounts.find(a => a.id == id);
		const newWebPass = prompt(`Alterar senha WEB para ${acc.name}:`, acc.pw);
		if (newWebPass === null) return; // User cancelled
		
		const newTransPass = prompt(`Alterar senha TRANS para ${acc.name}:`, acc.pt);
		if (newTransPass === null) return; // User cancelled
		
		if (newWebPass.trim() === '' || newTransPass.trim() === '') {
			NotificationSystem.error('Erro de Validação', 'Senhas não podem estar vazias');
			return;
		}
		
		acc.pw = newWebPass.trim();
		acc.pt = newTransPass.trim();
		
		DB.logOperation('SENHAS_ALTERADAS', `Chaves alteradas para entidade ${acc.name} (ID: ${id})`);
		DB.save();
		this.renderAccounts();
		NotificationSystem.success('Senhas Alteradas', 'Chaves de acesso atualizadas com sucesso');
	}
};

// === GESTÃO DE ATENDIMENTO ===
const AtendimentoManager = {
	curr: null,
	
	openTerminal(id) {
		Console.log(`Terminal ${id} aberto`, 'info');
		this.curr = id;
		document.getElementById('lobby-select').style.display = 'none';
		document.getElementById('terminal-interface').style.display = 'block';
		document.getElementById('term-title').textContent = id === 'caixa' ? "INTERFACE_HUMANA" : `NÓ_${id.replace('atm','').toUpperCase()}`;
		
		const dest = document.getElementById('op-dest');
		const type = document.getElementById('op-type');
		type.onchange = () => { 
			dest.style.display = (type.value === 'transferencia') ? 'block' : 'none'; 
		};
		
		NotificationSystem.info('Terminal Ativo', `Interface ${document.getElementById('term-title').textContent} carregada`);
	},
	
	closeTerminal() {
		Console.log(`Terminal ${this.curr} fechado`, 'info');
		document.getElementById('lobby-select').style.display = 'flex';
		document.getElementById('terminal-interface').style.display = 'none';
		this.curr = null;
	},
	
	execute() {
		const id = document.getElementById('op-conta').value;
		const pt = document.getElementById('op-senha').value;
		const type = document.getElementById('op-type').value;
		const val = parseFloat(document.getElementById('op-valor').value);
		const destId = document.getElementById('op-dest').value;

		if(!val || val <= 0) {
			NotificationSystem.error('Erro de Validação', 'Valor inválido especificado');
			return;
		}
		
		if(this.curr !== 'caixa' && !Number.isInteger(val)) {
			NotificationSystem.error('Erro de Validação', 'Apenas valores inteiros são aceitos nos terminais automáticos');
			return;
		}

		const acc = DB.data.accounts.find(a => a.id == id && a.pt == pt);
		if(!acc || acc.active === false) {
			NotificationSystem.error('Erro de Autenticação', 'Falha na verificação de credenciais');
			return;
		}

		let operationSuccess = false;
		let operationDetails = '';

		try {
			if(type === 'saque') {
				if(acc.balance < val) {
					NotificationSystem.error('Erro de Saldo', 'Fundos insuficientes na conta');
					return;
				}
				
				if(this.curr === 'caixa') {
					if(DB.data.humanCashier < val) {
						NotificationSystem.error('Erro de Terminal', 'Caixa físico sem fundos suficientes');
						return;
					}
					DB.data.humanCashier -= val;
				} else {
					const atm = DB.data.atms[this.curr];
					if(AgenciaManager.getAtmTotal(atm) < val) {
						NotificationSystem.error('Erro de Terminal', 'Terminal sem fundos suficientes');
						return;
					}
					
					let rem = val;
					const drawers = [...atm.drawers].sort((a,b)=>b.face-a.face);
					for(let d of drawers) {
						if(rem<=0) break;
						let take = Math.min(Math.floor(rem/d.face), d.count);
						d.count -= take; rem -= (take*d.face);
					}
					
					if(rem > 0) { 
						DB.init(); 
						NotificationSystem.error('Erro de Denominação', 'Não foi possível processar o valor com as notas disponíveis');
						return; 
					}
				}
				
				acc.balance -= val; 
				acc.hist.push({
					desc: `SAQUE ${this.curr}`, 
					v: -val, 
					d: new Date().toLocaleDateString('pt-BR'),
					terminal: this.curr
				});
				
				operationSuccess = true;
				operationDetails = `Saque R$ ${val.toFixed(2)} via ${this.curr}`;
			
			} else if(type === 'deposito') {
				acc.balance += val;
				
				if(this.curr === 'caixa') {
					DB.data.humanCashier += val;
				} else { 
					const atm = DB.data.atms[this.curr]; 
					atm.drawers[0].count += Math.floor(val/100); 
				}
				
				acc.hist.push({
					desc: `DEPÓSITO ${this.curr}`, 
					v: val, 
					d: new Date().toLocaleDateString('pt-BR'),
					terminal: this.curr
				});
				
				operationSuccess = true;
				operationDetails = `Depósito R$ ${val.toFixed(2)} via ${this.curr}`;
			
			} else if(type === 'transferencia') {
				const dest = DB.data.accounts.find(a => a.id == destId);
				if(!dest || dest.active === false) {
					NotificationSystem.error('Erro de Destino', 'Conta de destino não encontrada ou inativa');
					return;
				}
				
				if(acc.balance < val) {
					NotificationSystem.error('Erro de Saldo', 'Fundos insuficientes para transferência');
					return;
				}
				
				acc.balance -= val; 
				dest.balance += val;
				
				acc.hist.push({
					desc: `TRANSF > ${destId}`, 
					v: -val, 
					d: new Date().toLocaleDateString('pt-BR'),
					terminal: this.curr
				});
				
				dest.hist.push({
					desc: `TRANSF < ${acc.id}`, 
					v: val, 
					d: new Date().toLocaleDateString('pt-BR'),
					terminal: this.curr
				});
				
				operationSuccess = true;
				operationDetails = `Transferência R$ ${val.toFixed(2)} para conta ${destId}`;
				
			} else if(type === 'pagamento') {
				if(acc.balance < val) {
					NotificationSystem.error('Erro de Saldo', 'Fundos insuficientes para pagamento');
					return;
				}
				
				acc.balance -= val; 
				acc.hist.push({
					desc: `PAGAMENTO`, 
					v: -val, 
					d: new Date().toLocaleDateString('pt-BR'),
					terminal: this.curr
				});
				
				operationSuccess = true;
				operationDetails = `Pagamento R$ ${val.toFixed(2)} processado`;
			}
			
			if (operationSuccess) {
				DB.save();
				AgenciaManager.init();
				DB.logOperation('OPERACAO_TERMINAL', `${operationDetails} - Conta: ${acc.name} (${acc.id})`);
				
				NotificationSystem.success('Operação Concluída', operationDetails);
				document.getElementById('op-valor').value = '';
				
				// Limpar outros campos
				document.getElementById('op-dest').value = '';
			}
			
		} catch (error) {
			Console.log(`Erro na operação: ${error.message}`, 'error');
			NotificationSystem.error('Erro do Sistema', 'Falha interna na execução da operação');
		}
	}
};

// === GESTÃO INTERNET BANKING ===
const IBManager = {
	user: null,
	investments: [],
	
	login() {
		Console.log('Tentativa de login IB iniciada', 'info');
		const u = document.getElementById('ib-user').value;
		const p = document.getElementById('ib-pass').value;
		const acc = DB.data.accounts.find(a => a.id == u && a.pw == p);
		
		if(acc && acc.active !== false) {
			this.user = acc;
			Console.log(`Login IB bem-sucedido para: ${acc.name}`, 'success');
			NotificationSystem.success('Login Realizado', `Bem-vindo, ${acc.name}!`);
			
			document.getElementById('ib-login-screen').style.display = 'none';
			document.getElementById('ib-dashboard').style.display = 'block'; 
			this.updateDash();
		} else {
			Console.log(`Falha no login IB para ID: ${u}`, 'error');
			NotificationSystem.error('Falha na Autenticação', 'Credenciais inválidas para acesso web');
		}
	},
	
	logout() { 
		Console.log(`Logout IB executado para: ${this.user?.name}`, 'warning');
		NotificationSystem.warning('Sessão Encerrada', 'Usuário desconectado do Net_Link');
		location.reload(); 
	},
	
	updateDash() {
		const acc = DB.data.accounts.find(a => a.id === this.user.id);
		document.getElementById('ib-welcome').textContent = `USUÁRIO: ${acc.name}`;
		document.getElementById('ib-balance').textContent = acc.balance.toLocaleString('pt-BR');
	},
	
	showAction(act) {
		const area = document.getElementById('ib-action-area'); 
		area.innerHTML = '';
		
		if(act === 'extrato') {
			let html = `<div class="card"><h3>EXTRATO COMPLETO</h3>`;
			if (this.user.hist.length === 0) {
				html += '<div style="text-align: center; color: #666; padding: 20px;">Nenhuma transação encontrada</div>';
			} else {
				html += `<ul style="list-style:none; max-height: 400px; overflow-y: auto;">`;
				this.user.hist.reverse().forEach(h => {
					const isNegative = h.v < 0;
					const color = isNegative ? 'var(--alert)' : 'var(--success)';
					html += `<li style="border-bottom:1px solid #111; padding:10px; display:flex; justify-content:space-between; align-items:center;">
						<div>
							<div style="font-weight: bold;">${h.desc}</div>
							<div style="font-size: 0.8rem; color: #666;">${h.d} ${h.terminal ? '- Terminal: ' + h.terminal : ''}</div>
						</div>
						<div style="color:${color}; font-weight: bold;">
							${isNegative ? '-' : '+'}R$ ${Math.abs(h.v).toFixed(2)}
						</div>
					</li>`;
				});
				html += '</ul>';
			}
			area.innerHTML = html + '</div>';
			
		} else if(act === 'pix') {
			area.innerHTML = `
				<div class="card">
					<h3>PIX / TRANSFERÊNCIA INSTANTÂNEA</h3>
					<input id="pix-dest" placeholder="ID CONTA DESTINO">
					<input id="pix-val" type="number" placeholder="VALOR">
					<button class="btn btn-success" onclick="IBManager.execPix()">ENVIAR PIX</button>
				</div>
			`;
			
		} else if(act === 'pagar') {
			area.innerHTML = `
				<div class="card">
					<h3>PAGAMENTO DE CONTAS</h3>
					<input id="boleto-cod" placeholder="CÓDIGO DE BARRAS">
					<input id="pag-val" type="number" placeholder="VALOR">
					<button class="btn btn-success" onclick="IBManager.execPay()">PAGAR BOLETO</button>
				</div>
			`;
			
		} else if(act === 'investimentos') {
			this.loadInvestments();
			const currentBalance = this.user.balance;
			area.innerHTML = `
				<div class="card">
					<h3>CENTRAL DE INVESTIMENTOS</h3>
					<p style="margin-bottom: 20px; font-size: 0.9rem; color: #666;">
						Saldo disponível: <span style="color: var(--matrix-green); font-weight: bold;">R$ ${currentBalance.toLocaleString('pt-BR')}</span>
					</p>
					
					<div class="card" style="border-color: var(--success); margin-bottom: 15px;">
						<h4 style="margin-bottom: 15px; color: var(--success);">
							<i class="fas fa-chart-line"></i> RENDA FIXA - CDB
						</h4>
						<p style="margin-bottom: 15px; font-size: 0.9rem;">Rendimento: 12% a.a. | Mínimo: R$ 1.000,00</p>
						<input id="cdb-amount" type="number" placeholder="VALOR DO INVESTIMENTO" min="1000" max="${currentBalance}">
						<button class="btn btn-success" onclick="IBManager.investCDB()">INVESTIR CDB</button>
					</div>
					
					<div class="card" style="border-color: var(--info);">
						<h4 style="margin-bottom: 15px; color: var(--info);">
							<i class="fas fa-chart-area"></i> RENDA VARIÁVEL - AÇÕES
						</h4>
						<p style="margin-bottom: 15px; font-size: 0.9rem;">Ações Matrix Corp | Mínimo: R$ 500,00</p>
						<input id="stock-amount" type="number" placeholder="VALOR DO INVESTIMENTO" min="500" max="${currentBalance}">
						<button class="btn btn-warn" onclick="IBManager.investStock()">COMPRAR AÇÕES</button>
					</div>
					
					<!-- Lista de Investimentos -->
					<div class="investment-list" id="investment-list" style="display: block;">
						<h4 style="margin-bottom: 15px; color: var(--matrix-green);">MEUS INVESTIMENTOS</h4>
						<div id="investments-container"></div>
					</div>
				</div>
			`;
			this.updateInvestmentsList();
		}
	},
	
	execPix() {
		const destId = document.getElementById('pix-dest').value;
		const val = parseFloat(document.getElementById('pix-val').value);
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		
		if(!val || val <= 0) {
			NotificationSystem.error('Erro de Validação', 'Valor inválido para PIX');
			return;
		}
		
		if(acc.balance < val) {
			NotificationSystem.error('Erro de Saldo', 'Fundos insuficientes para PIX');
			return;
		}
		
		const destAcc = DB.data.accounts.find(a => a.id == destId);
		acc.balance -= val;
		
		acc.hist.push({
			desc: `PIX > ${destId}`, 
			v: -val, 
			d: new Date().toLocaleDateString('pt-BR'),
			type: 'PIX'
		});
		
		if(destAcc && destAcc.active !== false) { 
			destAcc.balance += val; 
			destAcc.hist.push({
				desc: `PIX < ${acc.id}`, 
				v: val, 
				d: new Date().toLocaleDateString('pt-BR'),
				type: 'PIX'
			}); 
		}
		
		DB.logOperation('PIX_ENVIADO', `PIX R$ ${val.toFixed(2)} para conta ${destId}`);
		DB.save(); 
		this.updateDash(); 
		NotificationSystem.success('PIX Enviado', `Transferência de R$ ${val.toFixed(2)} processada`);
	},
	
	execPay() {
		const codigo = document.getElementById('boleto-cod').value;
		const val = parseFloat(document.getElementById('pag-val').value);
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		
		if(!codigo || !val || val <= 0) {
			NotificationSystem.error('Erro de Validação', 'Código de barras e valor são obrigatórios');
			return;
		}
		
		if(acc.balance < val) {
			NotificationSystem.error('Erro de Saldo', 'Fundos insuficientes para pagamento');
			return;
		}
		
		acc.balance -= val; 
		acc.hist.push({
			desc: `PAGAMENTO ${codigo.substring(0,10)}...`, 
			v: -val, 
			d: new Date().toLocaleDateString('pt-BR'),
			type: 'PAGAMENTO'
		});
		
		DB.logOperation('PAGAMENTO_BOLETO', `Boleto ${codigo.substring(0,10)}... - R$ ${val.toFixed(2)}`);
		DB.save(); 
		this.updateDash(); 
		NotificationSystem.success('Pagamento Realizado', `Boleto de R$ ${val.toFixed(2)} pago com sucesso`);
	},
	
	investCDB() {
		const amount = parseFloat(document.getElementById('cdb-amount').value);
		
		if(!amount || amount <= 0) {
			NotificationSystem.error('Erro de Validação', 'Por favor, insira um valor válido para investimento');
			return;
		}
		
		if(amount < 1000) {
			NotificationSystem.error('Valor Insuficiente', 'Mínimo R$ 1.000,00 para investimento em CDB');
			return;
		}
		
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		if(acc.balance < amount) {
			NotificationSystem.error('Saldo Insuficiente', 'Saldo insuficiente para este investimento');
			return;
		}
		
		acc.balance -= amount;
		
		acc.hist.push({
			desc: 'INVESTIMENTO CDB',
			v: -amount,
			d: new Date().toLocaleDateString('pt-BR'),
			type: 'INVESTIMENTO'
		});
		
		DB.logOperation('INVESTIMENTO_CDB', `R$ ${amount.toFixed(2)} investidos em CDB`);
		DB.save();
		this.updateDash();
		NotificationSystem.success('Investimento Realizado', `R$ ${amount.toFixed(2)} investidos em CDB (12% a.a.)`);
	},
	
	investStock() {
		const amount = parseFloat(document.getElementById('stock-amount').value);
		
		if(!amount || amount <= 0) {
			NotificationSystem.error('Erro de Validação', 'Por favor, insira um valor válido para investimento');
			return;
		}
		
		if(amount < 500) {
			NotificationSystem.error('Valor Insuficiente', 'Mínimo R$ 500,00 para investimento em ações');
			return;
		}
		
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		if(acc.balance < amount) {
			NotificationSystem.error('Saldo Insuficiente', 'Saldo insuficiente para este investimento');
			return;
		}
		
		acc.balance -= amount;
		
		acc.hist.push({
			desc: 'AÇÕES MATRIX',
			v: -amount,
			d: new Date().toLocaleDateString('pt-BR'),
			type: 'INVESTIMENTO'
		});
		
		DB.logOperation('INVESTIMENTO_ACOES', `R$ ${amount.toFixed(2)} em ações Matrix Corp`);
		DB.save();
		this.updateDash();
		NotificationSystem.success('Compra Realizada', `R$ ${amount.toFixed(2)} em ações Matrix Corp adquiridos`);
	},
	
	exportStatement() {
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		const statement = {
			account: acc.name,
			id: acc.id,
			balance: acc.balance,
			transactions: acc.hist,
			investments: this.investments,
			exportDate: new Date().toISOString()
		};
		
		const dataStr = JSON.stringify(statement, null, 2);
		const dataBlob = new Blob([dataStr], {type: 'application/json'});
		
		const link = document.createElement('a');
		link.href = URL.createObjectURL(dataBlob);
		link.download = `extrato_${acc.name}_${new Date().toISOString().split('T')[0]}.json`;
		link.click();
		
		Console.log(`Extrato exportado para: ${acc.name}`, 'info');
		NotificationSystem.success('Extrato Exportado', 'Arquivo de extrato baixado com sucesso');
	},
	
	// Load investments from account history
	loadInvestments() {
		this.investments = this.user.hist
			.filter(t => t.type === 'INVESTIMENTO')
			.map(t => ({
				id: Date.now() + Math.random(),
				type: t.desc.includes('CDB') ? 'CDB' : 'AÇÕES',
				amount: Math.abs(t.v),
				date: t.d,
				investedAt: t.d
			}));
	},
	
	// Update investments list display
	updateInvestmentsList() {
		const container = document.getElementById('investments-container');
		if (!container) return;
		
		if (this.investments.length === 0) {
			container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Nenhum investimento realizado</div>';
			return;
		}
		
		container.innerHTML = this.investments.map(inv => {
			const typeColor = inv.type === 'CDB' ? 'var(--success)' : 'var(--info)';
			const withdrawAmount = inv.type === 'CDB' 
				? inv.amount * 1.12  // 12% return
				: inv.amount * (0.8 + Math.random() * 0.4); // 80-120% return for stocks
			
			return `
				<div class="investment-item">
					<div class="investment-info">
						<div class="investment-type" style="color: ${typeColor};">
							<i class="fas ${inv.type === 'CDB' ? 'fa-chart-line' : 'fa-chart-area'}"></i> 
							INVESTIMENTO ${inv.type}
						</div>
						<div class="investment-amount">
							Investido: R$ ${inv.amount.toLocaleString('pt-BR')} |
							Valor Resgate: R$ ${withdrawAmount.toLocaleString('pt-BR')}
						</div>
						<div class="investment-date">Data do investimento: ${inv.date}</div>
					</div>
					<div class="investment-actions">
						<button class="btn btn-success btn-small" onclick="IBManager.withdrawInvestment('${inv.id}')">
							RESGATAR
						</button>
					</div>
				</div>
			`;
		}).join('');
	},
	
	// Withdraw investment
	withdrawInvestment(investmentId) {
		const investment = this.investments.find(inv => inv.id == investmentId);
		if (!investment) return;
		
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		let withdrawAmount;
		
		if (investment.type === 'CDB') {
			// Calculate CDB return (12% per year - simplified calculation)
			const investedDate = new Date(investment.date);
			const currentDate = new Date();
			const daysDiff = (currentDate - investedDate) / (1000 * 60 * 60 * 24);
			const yearFraction = daysDiff / 365;
			withdrawAmount = investment.amount * (1 + 0.12 * yearFraction);
		} else {
			// Stock investment with random return between 80% and 120%
			withdrawAmount = investment.amount * (0.8 + Math.random() * 0.4);
		}
		
		if(confirm(`CONFIRMAR RESGATE?\n\nInvestimento: ${investment.type}\nValor investido: R$ ${investment.amount.toFixed(2)}\nValor a resgatar: R$ ${withdrawAmount.toFixed(2)}\nLucro: R$ ${(withdrawAmount - investment.amount).toFixed(2)}`)) {
			acc.balance += withdrawAmount;
			
			acc.hist.push({
				desc: `RESGATE ${investment.type}`,
				v: withdrawAmount,
				d: new Date().toLocaleDateString('pt-BR'),
				type: 'RESGATE'
			});
			
			// Remove investment from list
			this.investments = this.investments.filter(inv => inv.id != investmentId);
			
			DB.logOperation('RESGATE_INVESTIMENTO', `R$ ${withdrawAmount.toFixed(2)} resgatados - ${investment.type}`);
			DB.save();
			this.updateDash();
			this.updateInvestmentsList();
			
			const profit = withdrawAmount - investment.amount;
			NotificationSystem.success('Resgate Realizado', `R$ ${withdrawAmount.toFixed(2)} resgatados (Lucro: R$ ${profit.toFixed(2)})`);
		}
	}
};

// === ROTEADOR ===
const Router = {
	go(id) {
		Console.log(`Navegando para seção: ${id}`, 'info');
		document.querySelectorAll('.view-section').forEach(e => e.classList.remove('active'));
		document.getElementById('view-'+id).classList.add('active');
		
		// Atualizar navegação
		document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
		document.querySelector(`nav button[onclick="Router.go('${id}')"]`).classList.add('active');
		
		// Forçar atualização ao navegar
		if(id === 'agencia' && document.getElementById('admin-content').style.display === 'block') {
			AgenciaManager.init();
		}
		if(id === 'internetbanking' && IBManager.user) {
			IBManager.updateDash();
		}
		if(id === 'monitor') {
			this.updateMonitor();
		}
		if(id === 'hub') {
			AgenciaManager.updateHubStats();
		}
	},
	
	updateMonitor() {
		// Atualizar status dos terminais
		const statusContainer = document.getElementById('terminals-status');
		statusContainer.innerHTML = '';
		
		Object.keys(DB.data.atms).forEach(id => {
			const atm = DB.data.atms[id];
			const total = AgenciaManager.getAtmTotal(atm);
			const pct = (total / (atm.drawers.reduce((sum, d) => sum + d.count * d.max, 0))) * 100;
			
			statusContainer.innerHTML += `
				<div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border:1px solid var(--matrix-dark); margin-bottom:5px;">
					<div>
						<strong>NÓ_${id.replace('atm','')}</strong>
						<div style="font-size: 0.8rem; color: #666;">Total: R$ ${total.toLocaleString('pt-BR')}</div>
					</div>
					<div style="text-align: right;">
						<div class="status-${atm.status}">● ${atm.status.toUpperCase()}</div>
						<div style="font-size: 0.8rem;">${pct.toFixed(1)}% capacidade</div>
					</div>
				</div>
			`;
		});
		
		// Atividade recente
		const activityContainer = document.getElementById('recent-activity');
		const recentLogs = DB.data.systemLogs.slice(-10).reverse();
		
		if(recentLogs.length === 0) {
			activityContainer.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Nenhuma atividade recente</div>';
		} else {
			activityContainer.innerHTML = recentLogs.map(log => `
				<div style="padding: 8px; border-bottom: 1px solid #222; font-size: 0.8rem;">
					<div style="color: var(--matrix-green); font-weight: bold;">${log.operation}</div>
					<div style="color: #666; font-size: 0.7rem;">${new Date(log.timestamp).toLocaleString()}</div>
					<div>${log.details}</div>
				</div>
			`).join('');
		}
	}
};

// === SCROLL CONTROLS ===
const ScrollControls = {
	init() {
		// Create scroll buttons
		const topBtn = document.createElement('button');
		topBtn.className = 'scroll-btn scroll-to-top';
		topBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
		topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
		
		const bottomBtn = document.createElement('button');
		bottomBtn.className = 'scroll-btn scroll-to-bottom';
		bottomBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
		bottomBtn.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
		
		document.body.appendChild(topBtn);
		document.body.appendChild(bottomBtn);
		
		// Show/hide buttons based on scroll position
		window.addEventListener('scroll', () => {
			const scrollTop = window.pageYOffset;
			const scrollBottom = window.pageYOffset + window.innerHeight;
			const documentHeight = document.body.scrollHeight;
			
			if (scrollTop > 100) {
				topBtn.classList.add('visible');
			} else {
				topBtn.classList.remove('visible');
			}
			
			if (scrollBottom < documentHeight - 100) {
				bottomBtn.classList.add('visible');
			} else {
				bottomBtn.classList.remove('visible');
			}
		});
	}
};

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', function() {
	Console.init();
	DB.init();
	ScrollControls.init();
	
	// Configurar console toggle
	document.getElementById('console-toggle').addEventListener('click', Console.toggle);
	
	// Carregar stats iniciais
	AgenciaManager.updateHubStats();
	
	NotificationSystem.success('Sistema Inicializado', 'Nexus Matrix v2.0 carregado com sucesso');
	
	Console.log('Sistema NEXUS v2.0 totalmente operacional', 'success');
});
