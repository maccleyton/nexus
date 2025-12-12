// === SISTEMA DE ROTAS ===
// Gerenciamento de navegação entre views

class RouterSystem {
	constructor() {
		this.currentView = 'hub';
		this.history = [];
		this.maxHistory = 50;
	}

	init() {
		console.log('[Router] Sistema de rotas inicializado');
		this.go('hub');
	}

	go(viewId) {
		// Validar view
		const viewElement = document.getElementById(`view-${viewId}`);
		if (!viewElement) {
			console.error(`[Router] View não encontrada: ${viewId}`);
			return false;
		}

		// Remover active de todas as views
		document.querySelectorAll('.view-section').forEach(view => {
			view.classList.remove('active');
		});

		// Ativar view solicitada
		viewElement.classList.add('active');

		// Atualizar navegação
		this.updateNavigation(viewId);

		// Adicionar ao histórico
		this.addToHistory(viewId);

		// Atualizar view atual
		this.currentView = viewId;

		// Callbacks específicas por view
		this.onViewChange(viewId);

		// Log
		if (window.Console) {
			Console.log(`Navegando para: ${viewId}`, 'info');
		}

		return true;
	}

	updateNavigation(viewId) {
		// Atualizar botões da navegação
		document.querySelectorAll('nav button').forEach(btn => {
			btn.classList.remove('active');
		});

		// Encontrar e ativar botão correspondente
		const navButton = document.querySelector(`nav button[onclick*="${viewId}"]`);
		if (navButton) {
			navButton.classList.add('active');
		}
	}

	addToHistory(viewId) {
		this.history.push({
			view: viewId,
			timestamp: new Date().toISOString()
		});

		// Limitar histórico
		if (this.history.length > this.maxHistory) {
			this.history = this.history.slice(-this.maxHistory);
		}
	}

	onViewChange(viewId) {
		// Callbacks específicas quando muda de view
		switch(viewId) {
			case 'hub':
				if (window.AgenciaManager) {
					AgenciaManager.updateHubStats();
				}
				break;
			
			case 'agencia':
				// Verificar se está logado
				if (document.getElementById('admin-content').style.display === 'block') {
					if (window.AgenciaManager) {
						AgenciaManager.init();
					}
				}
				break;
			
			case 'internetbanking':
				// Verificar se está logado
				if (window.IBManager && IBManager.user) {
					IBManager.updateDash();
				}
				break;
			
			case 'monitor':
				if (window.MonitorManager) {
					MonitorManager.update();
				}
				break;
		}
	}

	back() {
		if (this.history.length > 1) {
			// Remover view atual
			this.history.pop();
			// Ir para anterior
			const previous = this.history[this.history.length - 1];
			this.go(previous.view);
		}
	}

	getHistory() {
		return this.history;
	}

	getCurrentView() {
		return this.currentView;
	}
}

// Instância global
const Router = new RouterSystem();
