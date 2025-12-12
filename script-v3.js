// === BANCO NEXUS v3.0 - Sistema Bancário Completo ===
// Versão melhorada e expandida com novos módulos

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
	Console.init();
	DB.init();
	Notifications.init();
	Router.init();
	
	// Atualizar investimentos periodicamente
	setInterval(() => {
		if (DB.data) {
			DB.updateInvestmentValues();
		}
	}, 60000); // A cada minuto
	
	Console.log('Sistema NEXUS v3.0 inicializado com sucesso', 'success');
});

// Continuar com o código existente do script.js...
// (Manter todo o código que já funciona)
