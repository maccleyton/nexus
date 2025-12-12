// === SISTEMA DE MODAL ===
class ModalSystem {
	static show(title, message, buttons = []) {
		// Remover modal anterior se existir
		const existingModal = document.getElementById('modal-overlay');
		if (existingModal) existingModal.remove();
		
		const overlay = document.createElement('div');
		overlay.id = 'modal-overlay';
		overlay.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.7);
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 200;
			animation: fadeIn 0.3s ease-out;
		`;
		
		const modal = document.createElement('div');
		modal.style.cssText = `
			background: #001100;
			border: 2px solid var(--matrix-green);
			padding: 30px;
			max-width: 500px;
			width: 90%;
			border-radius: 3px;
			box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
			animation: slideIn 0.3s ease-out;
		`;
		
		const titleEl = document.createElement('h2');
		titleEl.textContent = title;
		titleEl.style.cssText = `
			color: var(--matrix-green);
			margin-bottom: 15px;
			border-bottom: 1px solid var(--matrix-dark);
			padding-bottom: 10px;
		`;
		
		const msgEl = document.createElement('p');
		msgEl.textContent = message;
		msgEl.style.cssText = `
			color: #ddd;
			margin-bottom: 20px;
			line-height: 1.5;
		`;
		
		const buttonsContainer = document.createElement('div');
		buttonsContainer.style.cssText = `
			display: flex;
			gap: 10px;
			justify-content: flex-end;
		`;
		
		// Botão padrão de fechar
		if (buttons.length === 0) {
			const closeBtn = document.createElement('button');
			closeBtn.className = 'btn';
			closeBtn.textContent = 'FECHAR';
			closeBtn.onclick = () => overlay.remove();
			buttonsContainer.appendChild(closeBtn);
		} else {
			buttons.forEach(btn => {
				const btnEl = document.createElement('button');
				btnEl.className = btn.type === 'danger' ? 'btn btn-danger' : btn.type === 'success' ? 'btn btn-success' : 'btn';
				btnEl.textContent = btn.text;
				btnEl.onclick = () => {
					btn.callback();
					overlay.remove();
				};
				buttonsContainer.appendChild(btnEl);
			});
		}
		
		modal.appendChild(titleEl);
		modal.appendChild(msgEl);
		modal.appendChild(buttonsContainer);
		overlay.appendChild(modal);
		document.body.appendChild(overlay);
		
		// Fechar ao clicar fora
		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) overlay.remove();
		});
		
		// Fechar com Esc
		const closeOnEsc = (e) => {
			if (e.key === 'Escape') {
				overlay.remove();
				document.removeEventListener('keydown', closeOnEsc);
			}
		};
		document.addEventListener('keydown', closeOnEsc);
	}
	
	static confirm(title, message, onConfirm, onCancel) {
		this.show(title, message, [
			{
				text: 'CONFIRMAR',
				type: 'success',
				callback: onConfirm
			},
			{
				text: 'CANCELAR',
				type: 'danger',
				callback: onCancel || (() => {})
			}
		]);
	}
}

// === SISTEMA DE VALIDAÇÃO E SANITIZAÇÃO ===
class ValidationSystem {
	static sanitizeInput(input) {
		if (typeof input !== 'string') return input;
		return input
			.replace(/[<>]/g, '')
			.replace(/javascript:/gi, '')
			.trim();
	}
	
	static validateEmail(email) {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}
	
	static validateCPF(cpf) {
		cpf = cpf.replace(/\D/g, '');
		if (cpf.length !== 11) return false;
		if (/^(\d)\1{10}$/.test(cpf)) return false;
		
		let sum = 0, remainder;
		for (let i = 1; i <= 9; i++) {
			sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
		}
		remainder = (sum * 10) % 11;
		if (remainder === 10 || remainder === 11) remainder = 0;
		if (remainder !== parseInt(cpf.substring(9, 10))) return false;
		
		sum = 0;
		for (let i = 1; i <= 10; i++) {
			sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
		}
		remainder = (sum * 10) % 11;
		if (remainder === 10 || remainder === 11) remainder = 0;
		if (remainder !== parseInt(cpf.substring(10, 11))) return false;
		
		return true;
	}
	
	static validateAmount(amount, min = 0, max = Infinity) {
		const num = parseFloat(amount);
		return !isNaN(num) && num >= min && num <= max;
	}
	
	static validateTransactionLimit(amount, accountType = 'regular') {
		const limits = {
			regular: 50000,
			premium: 500000,
			admin: Infinity
		};
		return amount <= (limits[accountType] || limits.regular);
	}
}

// === SISTEMA DE NOTIFICAÇÕES ===
class NotificationSystem {
	static show(title, message, type = 'info', duration = 5000) {
		let container = document.getElementById('notifications');
		if (!container) {
			container = document.createElement('div');
			container.id = 'notifications';
			document.body.appendChild(container);
		}
		const notification = document.createElement('div');
		notification.className = `notification ${type}`;
		
		const closeBtn = document.createElement('button');
		closeBtn.className = 'close';
		closeBtn.textContent = '×';
		closeBtn.onclick = () => notification.remove();
		
		const titleDiv = document.createElement('div');
		titleDiv.className = 'title';
		titleDiv.textContent = title;
		
		const messageDiv = document.createElement('div');
		messageDiv.className = 'message';
		messageDiv.textContent = message;
		
		notification.appendChild(closeBtn);
		notification.appendChild(titleDiv);
		notification.appendChild(messageDiv);
		
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
		if (!container) return; // Console não inicializado
		
		const entry = document.createElement('div');
		entry.className = `log-entry ${type}`;
		
		const time = new Date().toLocaleTimeString();
		const timeDiv = document.createElement('div');
		timeDiv.className = 'log-time';
		timeDiv.textContent = `${time}`;
		
		const msgDiv = document.createElement('div');
		msgDiv.textContent = message;
		
		entry.appendChild(timeDiv);
		entry.appendChild(msgDiv);
		
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

let matrixAnimationId;
function animateMatrix() {
	drawMatrix();
	matrixAnimationId = requestAnimationFrame(animateMatrix);
}
matrixAnimationId = requestAnimationFrame(animateMatrix);

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
				{id:1, name:"Neo", balance:1000000, pw:"123", pt:"1234", hist:[], active:true, createdAt:new Date().toISOString(), creditCards: [], loans: [], overdraft: {limit: 5000, used: 0}},
				{id:2, name:"Trinity", balance:1000000, pw:"123", pt:"1234", hist:[], active:true, createdAt:new Date().toISOString(), creditCards: [], loans: [], overdraft: {limit: 5000, used: 0}},
				{id:3, name:"Morpheus", balance:1000000, pw:"123", pt:"1234", hist:[], active:true, createdAt:new Date().toISOString(), creditCards: [], loans: [], overdraft: {limit: 5000, used: 0}},
				{id:4, name:"Smith", balance:1000000, pw:"123", pt:"1234", hist:[], active:true, createdAt:new Date().toISOString(), creditCards: [], loans: [], overdraft: {limit: 5000, used: 0}}
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
			details: typeof details === 'object' ? JSON.stringify(details) : String(details),
			user: (typeof details === 'object' && details?.user) || 'system'
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
	show(id, btnEl) {
		Console.log(`Navegando para aba: ${id}`, 'info');
		document.querySelectorAll('[id^="tab-"]').forEach(e => e.style.display = 'none');
		const view = document.getElementById('tab-'+id);
		if (!view) {
			NotificationSystem.warning('Aba inexistente', `tab-${id} não encontrada`);
			return;
		}
		view.style.display = 'block';
		document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
		if (btnEl) btnEl.classList.add('active');
		
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
			createdAt: new Date().toISOString(),
			creditCards: [],
			loans: [],
			overdraft: {limit: 5000, used: 0}
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
		
		// Validar limite de transação
		if (!ValidationSystem.validateTransactionLimit(val, 'regular')) {
			NotificationSystem.error('Limite de Transação', 'Valor excede o limite de transação permitido');
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
					// Distribuir depósito pelas denominações em ordem descrescente
					let remaining = val;
					const drawers = [...atm.drawers].sort((a,b) => b.face - a.face);
					for(let d of drawers) {
						if(remaining <= 0) break;
						const notes = Math.floor(remaining / d.face);
						if(notes > 0 && d.count + notes <= d.max) {
							d.count += notes;
							remaining -= notes * d.face;
						}
					}
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
			
		} else if(act === 'emprestimos') {
			this.loadLoans();
			const currentBalance = this.user.balance;
			area.innerHTML = `
				<div class="card">
					<h3>CENTRAL DE EMPRÉSTIMOS</h3>
					<p style="margin-bottom: 20px; font-size: 0.9rem; color: #666;">
						Saldo disponível: <span style="color: var(--matrix-green); font-weight: bold;">R$ ${currentBalance.toLocaleString('pt-BR')}</span>
					</p>
					
					<div class="card" style="border-color: var(--warn); margin-bottom: 15px;">
						<h4 style="margin-bottom: 15px; color: var(--warn);">
							<i class="fas fa-hand-holding-usd"></i> SOLICITAR EMPRÉSTIMO
						</h4>
						<p style="margin-bottom: 15px; font-size: 0.9rem;">Taxa: 2% ao mês | Limite: R$ 100.000,00</p>
						<input id="loan-amount" type="number" placeholder="VALOR DO EMPRÉSTIMO" min="1000" max="100000">
						<label style="font-size: 0.9rem; margin-bottom: 10px; display: block;">Prazo (meses):</label>
						<input id="loan-term" type="number" placeholder="12" min="3" max="60" value="12">
						<button class="btn btn-warn" onclick="IBManager.requestLoan()">SOLICITAR</button>
					</div>
					
					<!-- Lista de Empréstimos -->
					<div style="margin-top: 20px;">
						<h4 style="margin-bottom: 15px; color: var(--matrix-green);">MEUS EMPRÉSTIMOS</h4>
						<div id="loans-container"></div>
					</div>
				</div>
			`;
			
		} else if(act === 'cartoes') {
			this.loadCreditCards();
			area.innerHTML = `
				<div class="card">
					<h3>CARTÕES DE CRÉDITO</h3>
					<button class="btn btn-success" style="margin-bottom: 20px;" onclick="IBManager.requestCreditCard()">+ SOLICITAR NOVO CARTÃO</button>
					
					<!-- Lista de Cartões -->
					<div id="cards-container"></div>
				</div>
			`;
			
		} else if(act === 'relatorios') {
			area.innerHTML = IBManager.generateReport();
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
	},
	
	// Solicitar empréstimo
	requestLoan() {
		const loanAmount = parseFloat(document.getElementById('loan-amount')?.value);
		const loanTerm = parseInt(document.getElementById('loan-term')?.value) || 12;
		
		if(!loanAmount || loanAmount <= 0) {
			NotificationSystem.error('Erro de Validação', 'Por favor, insira um valor válido para empréstimo');
			return;
		}
		
		if(loanAmount > 100000) {
			NotificationSystem.error('Limite Excedido', 'Limite máximo de empréstimo é R$ 100.000,00');
			return;
		}
		
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		
		// Aplicar taxa de juros (2% ao mês)
		const monthlyRate = 0.02;
		const totalAmount = loanAmount * Math.pow(1 + monthlyRate, loanTerm);
		const monthlyPayment = totalAmount / loanTerm;
		
		const loan = {
			id: Date.now(),
			amount: loanAmount,
			totalAmount: totalAmount,
			monthlyPayment: monthlyPayment,
			remainingAmount: totalAmount,
			term: loanTerm,
			monthsRemaining: loanTerm,
			createdAt: new Date().toLocaleDateString('pt-BR'),
			status: 'ATIVO'
		};
		
		acc.loans.push(loan);
		acc.balance += loanAmount;
		
		acc.hist.push({
			desc: `EMPRÉSTIMO APROVADO`,
			v: loanAmount,
			d: new Date().toLocaleDateString('pt-BR'),
			type: 'EMPRESTIMO'
		});
		
		DB.logOperation('EMPRESTIMO_SOLICITADO', `R$ ${loanAmount.toFixed(2)} emprestados - ${loanTerm} meses`);
		DB.save();
		this.updateDash();
		this.loadLoans();
		
		NotificationSystem.success('Empréstimo Aprovado', `R$ ${loanAmount.toFixed(2)} creditados na conta`);
	},
	
	// Pagar parcela de empréstimo
	payLoanInstallment(loanId) {
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		const loan = acc.loans.find(l => l.id == loanId);
		
		if (!loan) return;
		
		if(acc.balance < loan.monthlyPayment) {
			NotificationSystem.error('Saldo Insuficiente', 'Saldo insuficiente para pagar a parcela');
			return;
		}
		
		acc.balance -= loan.monthlyPayment;
		loan.remainingAmount -= loan.monthlyPayment;
		loan.monthsRemaining--;
		
		acc.hist.push({
			desc: `PAGAMENTO EMPRÉSTIMO`,
			v: -loan.monthlyPayment,
			d: new Date().toLocaleDateString('pt-BR'),
			type: 'PGTO_EMPR'
		});
		
		if(loan.monthsRemaining <= 0) {
			loan.status = 'QUITADO';
		}
		
		DB.logOperation('PAGAMENTO_EMPRESTIMO', `R$ ${loan.monthlyPayment.toFixed(2)} pagos`);
		DB.save();
		this.updateDash();
		this.loadLoans();
		
		NotificationSystem.success('Parcela Paga', `R$ ${loan.monthlyPayment.toFixed(2)} debitados - ${loan.monthsRemaining} parcelas restantes`);
	},
	
	// Solicitar cartão de crédito
	requestCreditCard() {
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		
		// Gerar número de cartão
		const cardNumber = Math.floor(Math.random() * 10000000000000000).toString().padStart(16, '0');
		const cardCVV = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
		
		const creditCard = {
			id: Date.now(),
			number: cardNumber,
			cvv: cardCVV,
			limit: 10000,
			used: 0,
			dueDate: '15',
			createdAt: new Date().toLocaleDateString('pt-BR'),
			status: 'ATIVO',
			transactions: []
		};
		
		acc.creditCards.push(creditCard);
		
		acc.hist.push({
			desc: `CARTÃO CRÉDITO EMITIDO`,
			v: 0,
			d: new Date().toLocaleDateString('pt-BR'),
			type: 'CARTAO'
		});
		
		DB.logOperation('CARTAO_EMITIDO', `Cartão final ${cardNumber.slice(-4)} emitido com limite de R$ ${creditCard.limit.toFixed(2)}`);
		DB.save();
		
		NotificationSystem.success('Cartão Aprovado', `Cartão emitido com limite de R$ ${creditCard.limit.toFixed(2)}`);
		this.loadCreditCards();
	},
	
	// Usar cartão de crédito
	useCard(cardId, amount) {
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		const card = acc.creditCards.find(c => c.id == cardId);
		
		if(!card || card.status !== 'ATIVO') {
			NotificationSystem.error('Cartão Inválido', 'Cartão não está ativo');
			return;
		}
		
		if(card.used + amount > card.limit) {
			NotificationSystem.error('Limite Excedido', `Limite disponível: R$ ${(card.limit - card.used).toFixed(2)}`);
			return;
		}
		
		card.used += amount;
		card.transactions.push({
			amount: amount,
			date: new Date().toLocaleDateString('pt-BR'),
			description: 'Compra no débito'
		});
		
		acc.hist.push({
			desc: `COMPRA CARTÃO`,
			v: -amount,
			d: new Date().toLocaleDateString('pt-BR'),
			type: 'CARTAO'
		});
		
		DB.logOperation('COMPRA_CARTAO', `Compra de R$ ${amount.toFixed(2)} no cartão final ${card.number.slice(-4)}`);
		DB.save();
		
		NotificationSystem.success('Compra Realizada', `R$ ${amount.toFixed(2)} debitados do cartão`);
	},
	
	// Pagar fatura de cartão
	payCardBill(cardId) {
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		const card = acc.creditCards.find(c => c.id == cardId);
		
		if(!card) return;
		
		if(acc.balance < card.used) {
			NotificationSystem.error('Saldo Insuficiente', 'Saldo insuficiente para pagar a fatura');
			return;
		}
		
		const billAmount = card.used;
		acc.balance -= billAmount;
		card.used = 0;
		
		acc.hist.push({
			desc: `PAGAMENTO FATURA CARTÃO`,
			v: -billAmount,
			d: new Date().toLocaleDateString('pt-BR'),
			type: 'CARTAO'
		});
		
		DB.logOperation('PAGAMENTO_FATURA', `Fatura de R$ ${billAmount.toFixed(2)} paga`);
		DB.save();
		this.updateDash();
		this.loadCreditCards();
		
		NotificationSystem.success('Fatura Paga', `R$ ${billAmount.toFixed(2)} debitados - Fatura quitada`);
	},
	
	// Carregar empréstimos
	loadLoans() {
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		const loansContainer = document.getElementById('loans-container');
		if (!loansContainer) return;
		
		if (!acc.loans || acc.loans.length === 0) {
			loansContainer.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Nenhum empréstimo ativo</div>';
			return;
		}
		
		loansContainer.innerHTML = acc.loans.map(loan => `
			<div class="loan-item" style="background: rgba(0, 20, 0, 0.8); border: 1px solid ${loan.status === 'ATIVO' ? 'var(--warn)' : 'var(--success)'}; padding: 15px; margin-bottom: 10px; border-radius: 3px;">
				<div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
					<div style="color: ${loan.status === 'ATIVO' ? 'var(--warn)' : 'var(--success)'}; font-weight: bold;">
						EMPRÉSTIMO ${loan.status}
					</div>
					<div style="color: var(--matrix-green);">R$ ${loan.remainingAmount.toFixed(2)}</div>
				</div>
				<div style="font-size: 0.85rem; color: #999; margin-bottom: 10px;">
					<div>Valor original: R$ ${loan.amount.toFixed(2)}</div>
					<div>Parcela: R$ ${loan.monthlyPayment.toFixed(2)}</div>
					<div>Parcelas restantes: ${loan.monthsRemaining}</div>
				</div>
				${loan.status === 'ATIVO' ? `<button class="btn btn-success btn-small" onclick="IBManager.payLoanInstallment(${loan.id})">PAGAR PARCELA</button>` : '<span class="status-online">● QUITADO</span>'}
			</div>
		`).join('');
	},
	
	// Carregar cartões de crédito
	loadCreditCards() {
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		const cardsContainer = document.getElementById('cards-container');
		if (!cardsContainer) return;
		
		if (!acc.creditCards || acc.creditCards.length === 0) {
			cardsContainer.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Nenhum cartão de crédito</div>';
			return;
		}
		
		cardsContainer.innerHTML = acc.creditCards.map(card => `
			<div class="credit-card" style="background: linear-gradient(135deg, #004400 0%, #001100 100%); border: 2px solid var(--matrix-green); padding: 20px; margin-bottom: 15px; border-radius: 5px; box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);">
				<div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
					<div style="color: var(--matrix-green); font-weight: bold;">MATRIZ CARD</div>
					<div style="color: var(--success); font-size: 0.9rem;">● ${card.status}</div>
				</div>
				<div style="font-size: 1.3rem; letter-spacing: 2px; color: var(--matrix-green); font-weight: bold; margin-bottom: 10px;">
					•••• •••• •••• ${card.number.slice(-4)}
				</div>
				<div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
					<div>
						<div style="color: #666;">Limite</div>
						<div style="color: var(--matrix-green); font-weight: bold;">R$ ${card.limit.toFixed(2)}</div>
					</div>
					<div>
						<div style="color: #666;">Utilizado</div>
						<div style="color: ${card.used > 0 ? 'var(--alert)' : 'var(--success)'}; font-weight: bold;">R$ ${card.used.toFixed(2)}</div>
					</div>
					<div>
						<div style="color: #666;">Disponível</div>
						<div style="color: var(--success); font-weight: bold;">R$ ${(card.limit - card.used).toFixed(2)}</div>
					</div>
				</div>
				<div style="margin-top: 15px; display: flex; gap: 10px;">
					<button class="btn btn-success btn-small" onclick="IBManager.payCardBill(${card.id})">PAGAR FATURA</button>
				</div>
			</div>
		`).join('');
	},
	
	// Gerar relatório detalhado
	generateReport() {
		const acc = DB.data.accounts.find(a => a.id == this.user.id);
		
		// Calcular estatísticas
		const totalIncome = acc.hist.filter(h => h.v > 0).reduce((sum, h) => sum + h.v, 0);
		const totalExpense = acc.hist.filter(h => h.v < 0).reduce((sum, h) => sum + Math.abs(h.v), 0);
		const transactionCount = acc.hist.length;
		
		// Agrupar por tipo
		const byType = {};
		acc.hist.forEach(h => {
			const type = h.type || 'GERAL';
			if (!byType[type]) byType[type] = { count: 0, total: 0 };
			byType[type].count++;
			byType[type].total += Math.abs(h.v);
		});
		
		// Últimos 30 dias
		const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
		const last30Days = acc.hist.filter(h => new Date(h.d) > thirtyDaysAgo);
		
		let reportHTML = `
			<div class="card">
				<h3>RELATÓRIO FINANCEIRO DETALHADO</h3>
				
				<div class="grid-3" style="margin-bottom: 20px;">
					<div style="background: rgba(0, 255, 65, 0.1); padding: 15px; border: 1px solid var(--matrix-green); border-radius: 3px;">
						<div style="color: #666; font-size: 0.8rem;">Saldo Atual</div>
						<div style="color: var(--matrix-green); font-weight: bold; font-size: 1.5rem;">R$ ${acc.balance.toLocaleString('pt-BR')}</div>
					</div>
					<div style="background: rgba(0, 255, 136, 0.1); padding: 15px; border: 1px solid var(--success); border-radius: 3px;">
						<div style="color: #666; font-size: 0.8rem;">Receitas</div>
						<div style="color: var(--success); font-weight: bold; font-size: 1.5rem;">R$ ${totalIncome.toLocaleString('pt-BR')}</div>
					</div>
					<div style="background: rgba(255, 0, 64, 0.1); padding: 15px; border: 1px solid var(--alert); border-radius: 3px;">
						<div style="color: #666; font-size: 0.8rem;">Despesas</div>
						<div style="color: var(--alert); font-weight: bold; font-size: 1.5rem;">R$ ${totalExpense.toLocaleString('pt-BR')}</div>
					</div>
				</div>
				
				<div class="grid-2" style="margin-bottom: 20px;">
					<div style="background: rgba(0, 20, 0, 0.8); border: 1px solid var(--matrix-dark); padding: 15px; border-radius: 3px;">
						<h4 style="color: var(--matrix-green); margin-bottom: 10px;">Últimos 30 Dias</h4>
						<div style="font-size: 0.9rem;">
							<div>Transações: ${last30Days.length}</div>
							<div>Receitas: R$ ${last30Days.filter(h => h.v > 0).reduce((s, h) => s + h.v, 0).toLocaleString('pt-BR')}</div>
							<div>Despesas: R$ ${Math.abs(last30Days.filter(h => h.v < 0).reduce((s, h) => s + h.v, 0)).toLocaleString('pt-BR')}</div>
						</div>
					</div>
					
					<div style="background: rgba(0, 20, 0, 0.8); border: 1px solid var(--matrix-dark); padding: 15px; border-radius: 3px;">
						<h4 style="color: var(--matrix-green); margin-bottom: 10px;">Estatísticas Gerais</h4>
						<div style="font-size: 0.9rem;">
							<div>Total de Transações: ${transactionCount}</div>
							<div>Ticket Médio: R$ ${(totalExpense / (acc.hist.filter(h => h.v < 0).length || 1)).toLocaleString('pt-BR')}</div>
							<div>Saldo Médio: R$ ${(acc.balance).toLocaleString('pt-BR')}</div>
						</div>
					</div>
				</div>
				
				<h4 style="color: var(--matrix-green); margin-bottom: 10px;">Movimentação por Tipo</h4>
				<div style="background: rgba(0, 20, 0, 0.8); border: 1px solid var(--matrix-dark); padding: 15px; border-radius: 3px; max-height: 300px; overflow-y: auto;">
					${Object.entries(byType).map(([type, data]) => `
						<div style="padding: 8px; border-bottom: 1px solid #111; display: flex; justify-content: space-between;">
							<div>
								<div style="color: var(--matrix-green); font-weight: bold;">${type}</div>
								<div style="font-size: 0.8rem; color: #666;">${data.count} operação(ões)</div>
							</div>
							<div style="color: var(--success); font-weight: bold;">R$ ${data.total.toLocaleString('pt-BR')}</div>
						</div>
					`).join('')}
				</div>
				
				<div style="margin-top: 15px; display: flex; gap: 10px;">
					<button class="btn btn-success" onclick="IBManager.exportStatement()">EXPORTAR RELATÓRIO</button>
				</div>
			</div>
		`;
		
		return reportHTML;
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
			const maxCapacity = atm.drawers.reduce((sum, d) => sum + (d.face * d.max), 0);
			const pct = (total / maxCapacity) * 100;
			
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
	
	// Configurar console toggle com verificação
	const consoleToggle = document.getElementById('console-toggle');
	if (consoleToggle) {
		consoleToggle.addEventListener('click', () => Console.toggle());
	}
	
	// Carregar stats iniciais
	AgenciaManager.updateHubStats();
	
	NotificationSystem.success('Sistema Inicializado', 'Nexus Matrix v2.0 carregado com sucesso');
	
	Console.log('Sistema NEXUS v2.0 totalmente operacional', 'success');
});
