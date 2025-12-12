// === DATABASE CORE ===
// Gerenciamento centralizado de dados com localStorage

class Database {
	constructor() {
		this.key = 'nexus_db_v3';
		this.data = null;
	}

	init() {
		console.log('[DB] Inicializando banco de dados...');
		const stored = localStorage.getItem(this.key);
		this.data = stored ? JSON.parse(stored) : this.seed();
		this.save();
		console.log('[DB] Banco de dados carregado com sucesso');
		return this.data;
	}

	save() {
		localStorage.setItem(this.key, JSON.stringify(this.data));
	}

	seed() {
		console.log('[DB] Criando estrutura inicial de dados...');
		return {
			config: {
				systemVersion: '3.0.0',
				totalSystemCash: 5000000,
				lastBackup: new Date().toISOString(),
				interestRates: {
					loan: 2.5, // % ao mês
					overdraft: 8.0, // % ao mês
					savings: 0.5 // % ao mês
				}
			},
			treasury: {
				vaultA: 1250000,
				vaultB: 1250000,
				total: 2500000
			},
			humanCashier: 10000,
			atms: {
				atmA: this.createAtm(3000, 'large'),
				atmB: this.createAtm(3000, 'large'),
				atmC: this.createAtm(1800, 'small'),
				atmD: this.createAtm(1800, 'small')
			},
			accounts: [
				this.createAccount(1, 'Neo Anderson', 50000),
				this.createAccount(2, 'Trinity', 75000),
				this.createAccount(3, 'Morpheus', 100000),
				this.createAccount(4, 'Agent Smith', 25000)
			],
			cards: [],
			loans: [],
			investments: [],
			systemLogs: [],
			transactions: []
		};
	}

	createAtm(capacity, type) {
		return {
			type: type,
			status: 'online',
			lastMaintenance: new Date().toISOString(),
			drawers: [
				{ face: 200, count: Math.floor(capacity * 0.2), max: capacity },
				{ face: 100, count: Math.floor(capacity * 0.3), max: capacity },
				{ face: 50, count: Math.floor(capacity * 0.3), max: capacity },
				{ face: 20, count: Math.floor(capacity * 0.2), max: capacity }
			],
			genericDrawer: { count: 0, max: capacity }
		};
	}

	createAccount(id, name, initialBalance = 0) {
		return {
			id: id,
			name: name,
			balance: initialBalance,
			passwordWeb: '123',
			passwordTransaction: '1234',
			active: true,
			createdAt: new Date().toISOString(),
			history: [],
			overdraft: {
				enabled: false,
				limit: 0,
				used: 0
			},
			creditScore: Math.floor(Math.random() * 400) + 600 // 600-1000
		};
	}

	// === OPERAÇÕES DE CONTA ===
	getAccount(id) {
		return this.data.accounts.find(a => a.id == id);
	}

	getActiveAccounts() {
		return this.data.accounts.filter(a => a.active);
	}

	updateAccount(id, updates) {
		const account = this.getAccount(id);
		if (account) {
			Object.assign(account, updates);
			this.save();
			return true;
		}
		return false;
	}

	addTransaction(accountId, transaction) {
		const account = this.getAccount(accountId);
		if (account) {
			transaction.timestamp = new Date().toISOString();
			transaction.id = Date.now() + Math.random();
			account.history.push(transaction);
			this.data.transactions.push({
				...transaction,
				accountId: accountId,
				accountName: account.name
			});
			this.save();
			return true;
		}
		return false;
	}

	// === OPERAÇÕES DE CARTÃO ===
	createCard(accountId, cardData) {
		const card = {
			id: Date.now(),
			accountId: accountId,
			number: this.generateCardNumber(),
			brand: cardData.brand || 'Visa',
			limit: cardData.limit || 5000,
			used: 0,
			dueDay: cardData.dueDay || 10,
			status: 'active',
			createdAt: new Date().toISOString(),
			transactions: []
		};
		this.data.cards.push(card);
		this.save();
		return card;
	}

	generateCardNumber() {
		const prefix = '5199'; // Nexus Bank
		let number = prefix;
		for (let i = 0; i < 12; i++) {
			number += Math.floor(Math.random() * 10);
		}
		return number;
	}

	getAccountCards(accountId) {
		return this.data.cards.filter(c => c.accountId == accountId && c.status === 'active');
	}

	// === OPERAÇÕES DE EMPRÉSTIMO ===
	createLoan(accountId, loanData) {
		const loan = {
			id: Date.now(),
			accountId: accountId,
			amount: loanData.amount,
			installments: loanData.installments,
			rate: loanData.rate,
			installmentValue: loanData.installmentValue,
			paidInstallments: 0,
			status: 'active',
			createdAt: new Date().toISOString(),
			nextDueDate: this.calculateNextDueDate()
		};
		this.data.loans.push(loan);
		this.save();
		return loan;
	}

	calculateNextDueDate() {
		const date = new Date();
		date.setMonth(date.getMonth() + 1);
		return date.toISOString();
	}

	getAccountLoans(accountId) {
		return this.data.loans.filter(l => l.accountId == accountId && l.status === 'active');
	}

	// === OPERAÇÕES DE INVESTIMENTO ===
	createInvestment(accountId, investmentData) {
		const investment = {
			id: Date.now(),
			accountId: accountId,
			type: investmentData.type,
			amount: investmentData.amount,
			rate: investmentData.rate,
			startDate: new Date().toISOString(),
			maturityDate: investmentData.maturityDate,
			status: 'active',
			currentValue: investmentData.amount
		};
		this.data.investments.push(investment);
		this.save();
		return investment;
	}

	getAccountInvestments(accountId) {
		return this.data.investments.filter(i => i.accountId == accountId && i.status === 'active');
	}

	updateInvestmentValues() {
		// Atualiza valores dos investimentos baseado em taxas
		this.data.investments.forEach(inv => {
			if (inv.status === 'active') {
				const daysPassed = Math.floor((Date.now() - new Date(inv.startDate)) / (1000 * 60 * 60 * 24));
				const monthlyRate = inv.rate / 100;
				const dailyRate = monthlyRate / 30;
				inv.currentValue = inv.amount * Math.pow(1 + dailyRate, daysPassed);
			}
		});
		this.save();
	}

	// === LOGS DO SISTEMA ===
	log(operation, details, user = 'system') {
		const logEntry = {
			id: Date.now(),
			timestamp: new Date().toISOString(),
			operation: operation,
			details: details,
			user: user
		};
		
		this.data.systemLogs.push(logEntry);
		
		// Limita a 1000 logs
		if (this.data.systemLogs.length > 1000) {
			this.data.systemLogs = this.data.systemLogs.slice(-1000);
		}
		
		this.save();
		return logEntry;
	}

	getLogs(limit = 50) {
		return this.data.systemLogs.slice(-limit).reverse();
	}

	// === BACKUP E RESTORE ===
	export() {
		return JSON.stringify(this.data, null, 2);
	}

	import(jsonData) {
		try {
			const data = JSON.parse(jsonData);
			this.data = data;
			this.save();
			return true;
		} catch (error) {
			console.error('[DB] Erro ao importar dados:', error);
			return false;
		}
	}

	// === ESTATÍSTICAS ===
	getStats() {
		const accounts = this.getActiveAccounts();
		const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
		const totalCards = this.data.cards.filter(c => c.status === 'active').length;
		const totalLoans = this.data.loans.filter(l => l.status === 'active').length;
		const totalInvestments = this.data.investments.filter(i => i.status === 'active').length;
		
		return {
			totalAccounts: accounts.length,
			totalBalance: totalBalance,
			totalCards: totalCards,
			totalLoans: totalLoans,
			totalInvestments: totalInvestments,
			totalTransactions: this.data.transactions.length
		};
	}
}

// Exportar instância única
const DB = new Database();
