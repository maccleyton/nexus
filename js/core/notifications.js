// === SISTEMA DE NOTIFICAÇÕES ===
// Toast notifications com diferentes tipos e animações

class NotificationSystem {
	constructor() {
		this.container = null;
		this.queue = [];
		this.maxVisible = 5;
	}

	init() {
		this.container = document.getElementById('notifications');
		if (!this.container) {
			this.container = document.createElement('div');
			this.container.id = 'notifications';
			document.body.appendChild(this.container);
		}
	}

	show(title, message, type = 'info', duration = 5000) {
		const notification = this.create(title, message, type);
		this.container.appendChild(notification);

		// Animar entrada
		setTimeout(() => notification.classList.add('show'), 10);

		// Auto remover
		if (duration > 0) {
			setTimeout(() => this.remove(notification), duration);
		}

		// Limitar quantidade visível
		this.limitVisible();

		// Log no console
		if (window.Console) {
			Console.log(`${type.toUpperCase()}: ${title} - ${message}`, type);
		}

		return notification;
	}

	create(title, message, type) {
		const notification = document.createElement('div');
		notification.className = `notification ${type}`;
		
		const icon = this.getIcon(type);
		
		notification.innerHTML = `
			<div class="notification-icon">${icon}</div>
			<div class="notification-content">
				<div class="notification-title">${title}</div>
				<div class="notification-message">${message}</div>
			</div>
			<button class="notification-close" onclick="Notifications.remove(this.parentElement)">×</button>
		`;

		return notification;
	}

	getIcon(type) {
		const icons = {
			success: '<i class="fas fa-check-circle"></i>',
			error: '<i class="fas fa-exclamation-circle"></i>',
			warning: '<i class="fas fa-exclamation-triangle"></i>',
			info: '<i class="fas fa-info-circle"></i>'
		};
		return icons[type] || icons.info;
	}

	remove(notification) {
		if (notification && notification.parentElement) {
			notification.classList.remove('show');
			notification.classList.add('hide');
			setTimeout(() => {
				if (notification.parentElement) {
					notification.remove();
				}
			}, 300);
		}
	}

	limitVisible() {
		const notifications = this.container.querySelectorAll('.notification');
		if (notifications.length > this.maxVisible) {
			for (let i = 0; i < notifications.length - this.maxVisible; i++) {
				this.remove(notifications[i]);
			}
		}
	}

	// Atalhos para tipos específicos
	success(title, message, duration) {
		return this.show(title, message, 'success', duration);
	}

	error(title, message, duration) {
		return this.show(title, message, 'error', duration);
	}

	warning(title, message, duration) {
		return this.show(title, message, 'warning', duration);
	}

	info(title, message, duration) {
		return this.show(title, message, 'info', duration);
	}

	// Notificação de confirmação
	confirm(title, message, onConfirm, onCancel) {
		const notification = this.create(title, message, 'warning');
		notification.classList.add('notification-confirm');
		
		const buttons = document.createElement('div');
		buttons.className = 'notification-buttons';
		buttons.innerHTML = `
			<button class="btn btn-success btn-small" onclick="Notifications.handleConfirm(this, true)">Confirmar</button>
			<button class="btn btn-danger btn-small" onclick="Notifications.handleConfirm(this, false)">Cancelar</button>
		`;
		
		notification.appendChild(buttons);
		notification._onConfirm = onConfirm;
		notification._onCancel = onCancel;
		
		this.container.appendChild(notification);
		setTimeout(() => notification.classList.add('show'), 10);
		
		return notification;
	}

	handleConfirm(button, confirmed) {
		const notification = button.closest('.notification');
		if (confirmed && notification._onConfirm) {
			notification._onConfirm();
		} else if (!confirmed && notification._onCancel) {
			notification._onCancel();
		}
		this.remove(notification);
	}

	// Limpar todas as notificações
	clearAll() {
		const notifications = this.container.querySelectorAll('.notification');
		notifications.forEach(n => this.remove(n));
	}
}

// Instância global
const Notifications = new NotificationSystem();
