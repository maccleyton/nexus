Cleyton, bora deixar esse “Banco Nexus — Mainframe Matrix v2.0” com cara de produto pronto? Abaixo está um relatório completo e priorizado com **diagnóstico**, **melhorias** e **novas funções** que podemos incluir. Eu foquei em segurança, robustez, performance, acessibilidade, UX e organização do código.

> Obs.: notei que o `index.html` está mais para um rascunho textual do que um HTML funcional, e há várias referências no JS/CSS a elementos que não aparecem nele — isso explica por que muita coisa não renderiza/interfaceia. [\[index | HTML\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/index.html), [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

***

## 1) Sumário executivo (prioridades)

**Top 10 melhorias rápidas (impacto alto / esforço baixo):**

1.  **Corrigir uso de `event` global** em `Tabs.show()` — passar o evento ou usar `this` do botão; hoje pode quebrar em alguns navegadores. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
2.  **Sanitizar/escapar conteúdo**: `NotificationSystem.show()` e outras áreas usam `innerHTML` com dados que podem vir de usuários (nome de conta, mensagens); trocar por `textContent`/template seguro para evitar XSS. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
3.  **Fix no `DB.logOperation()`**: fallback está incorreto (`details.user 'system'`); usar `details?.user || 'system'`. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
4.  **Checar existência de elementos** antes de usar `getElementById(...).addEventListener(...)` (ex.: `console-toggle`) para evitar erros quando o HTML não tem o componente. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
5.  **Unificar media queries duplicadas em `style.css`** (`@media (max-width: 1400px)` aparece duas vezes) e resolver conflitos. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)
6.  **Migrar o Matrix Rain para `requestAnimationFrame`** (suave e eficiente) e adaptar ao `resize`. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
7.  **Corrigir cálculo de capacidade no monitor** (a fórmula de `pct` usa `count * max` indevidamente). [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
8.  **Criar um HTML-base** com os IDs/estruturas que o JS espera (`#app`, `#console-panel`, `#lock-screen`, inputs de login, grids etc.). [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js), [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)
9.  **Melhorar o algoritmo de saque/deposito** nos ATMs (distribuição por denominações tanto no saque quanto no depósito) e refletir no cofre/humanCashier corretamente. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
10. **Adicionar “prefers-reduced-motion”** na CSS para acessibilidade (reduzir animações para quem precisa). [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)

***

## 2) Diagnóstico detalhado

### 2.1. HTML & estrutura de DOM

*   O `index.html` entregue parece ser um texto com cabeçalhos/linhas, sem marcação real de elementos (`<div id="app">`, `<aside>`, etc.). O JS e a CSS referenciam dezenas de IDs e classes que não existem no HTML atual (ex.: `#matrix-canvas`, `#console-panel`, `#console-toggle`, `#lock-screen`, `#admin-user`, `#admin-pass`, `#admin-content`, `#notifications`, diversas views e grids). Precisamos criar um **esqueleto HTML consistente** com o layout esperado. [\[index | HTML\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/index.html), [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js), [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)

### 2.2. JavaScript (robustez, bugs e organização)

*   **Tabs**: `Tabs.show(id)` usa `event.target` sem receber `event`. Em ambientes estritos, isso quebra. O ideal é ter `Tabs.show(id, ev)` ou usar delegação com `this`. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   **XSS/HTML injection**: `NotificationSystem.show()` faz `innerHTML` com `title`/`message`. Se algum campo do usuário entrar ali (como nome de conta), é um vetor de XSS. Preferir `textContent` e construir DOM via `createElement`. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   **Log fallback**: `DB.logOperation(..., details)` tem `user: details.user 'system'` — isso é um bug de fallback. Deve ser `details?.user || 'system'`. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   **Monitor “capacidade”**: em `Router.updateMonitor()`, `pct` calcula `total / (atm.drawers.reduce(...))`, mas usa uma expressão equivocada com `d.count * d.max`. O denominador de capacidade deveria somar `d.max * d.face` (capacidade máxima em valor) ou `d.max` se quisermos apenas contagem de cédulas. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   **Algoritmo de depósito**: depósito via ATM soma apenas no primeiro gaveteiro `atm.drawers[0]` com `Math.floor(val/100)` — isso ignora outras denominações e não atualiza cofre/humanCashier. Precisamos **distribuir por notas** e refletir a origem/destino do cash (tesouraria vs ATM vs humano). [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   **Erros silenciosos de DOM**: Há vários `document.getElementById(...).value` e `.addEventListener(...)` que assumem existir; com o `index.html` atual, pode lançar `TypeError`. Devemos padronizar **verificação de elementos** e logs de alerta ao inicializar. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   **Matrix rain**: roda com `setInterval(drawMatrix, 50)` — trocar por `requestAnimationFrame` para melhor sincronização e eficiência. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   **Uso de `confirm`/`prompt`**: funcional, mas pobre em UX (bloqueia o thread, experiência inconsistente). Melhor migrar para modais customizados com confirmação clara. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

### 2.3. CSS (layout, acessibilidade e consistência)

*   **Media queries duplicadas**: `@media (max-width: 1400px)` está duplicada e com regras diferentes; unificar para evitar conflitos. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)
*   **Foco/teclado**: inputs e botões têm estilos de foco, mas seria bom `:focus-visible` e maior contraste para acessibilidade. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)
*   **Redução de movimentos**: animações intensas (flicker, pulse, glow) — implementar `@media (prefers-reduced-motion: reduce)` para desativar/amenizar. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)
*   **Scroll buttons posicionamento fixo**: alocam `right: 360px` assumindo console aberto; responsivo já ajusta, mas podemos **calcular dinamicamente** baseado no estado do console. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)

### 2.4. Segurança & dados

*   **Credenciais hardcoded**: `AdminAuth.login()` aceita `nexus/0099` e `cosmos/0099`, e as contas têm senhas fracas (`123`/`1234`). Isso serve para demo, mas **não é seguro**. Autenticação deve ser no backend com hashing (Argon2/bcrypt), rate limit e logs. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   **LocalStorage**: o “DB” usa `localStorage`. Para uma simulação está ok, mas qualquer dado sensível não deve ficar no client puro. Se ficar, **encrypt** e/ou migrar para **IndexedDB** com versionamento, ou melhor: persistência em backend. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   **Injection**: em `Tabs.loadLogs()` e outros, concatenamos strings com dados que podem ser manipuláveis (ex.: nome de entidade). Trocar para criação de elementos e `textContent`. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   **Export/Import**: boas funções de backup, porém aceitar qualquer `.json` e substituir `DB.data` sem validação de schema pode corromper estado. Precisamos de **validação** (schema JSON) e “safe import” com **migrações** por `systemVersion`. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

### 2.5. UX & acessibilidade

*   **Modais** em vez de `confirm/prompt`,
*   **Teclado**: navegar nos terminais e ações via teclas (Tab, Enter, Esc).
*   **Mensagens**: feedbacks com títulos/descrições consistentes; hoje já existem notificações, mas podemos **agrupar por contexto** (admin, ATM, cliente) para clareza. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

### 2.6. Arquitetura & organização

*   Código está em um único `script.js` com vários “Managers” globais. Sugestão: **modularizar** (ES Modules) por domínio: `db.js`, `auth.js`, `atm.js`, `accounts.js`, `ib.js`, `ui.js`, `router.js`, `console.js`, `notifications.js`. Melhor ainda com **TypeScript** para tipagem e evitar erros de runtime. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

***

## 3) Melhorias com exemplos (patches)

### 3.1. Corrigir `Tabs.show()` (sem usar `event` global)



```js
// script.js (patch)
const Tabs = {
  show(id, btnEl) {
    Console.log(`Navegando para aba: ${id}`, 'info');
    document.querySelectorAll('[id^="tab-"]').forEach(e => e.style.display = 'none');
    const view = document.getElementById('tab-' + id);
    if (!view) {
      NotificationSystem.warning('Aba inexistente', `tab-${id} não encontrada`);
      return;
    }
    view.style.display = 'block';

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    if (id === 'logs') this.loadLogs();
  },
  // ...
};
```

### 3.2. Notificações seguras (sem XSS)

```js
class NotificationSystem {
  static show(title, message, type = 'info', duration = 5000) {
    const container = document.getElementById('notifications');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => notification.remove();

    const titleEl = document.createElement('div');
    titleEl.className = 'title';
    titleEl.textContent = title;

    const msgEl = document.createElement('div');
    msgEl.className = 'message';
    msgEl.textContent = message;

    notification.append(closeBtn, titleEl, msgEl);
    container.appendChild(notification);

    setTimeout(() => notification.remove(), duration);
    Console.log(`${type.toUpperCase()}: ${title} - ${message}`, type);
  }
  // ...
}
```

> Substitui `innerHTML` por criação de elementos e `textContent`. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

### 3.3. Fallback correto no log

```js
// DB.logOperation - patch
logOperation(operation, details) {
  const log = {
    timestamp: new Date().toISOString(),
    operation,
    details,
    user: (details && details.user) || 'system'
  };
  // resto igual...
}
```

> Corrige o bug de fallback de usuário. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

### 3.4. Matrix Rain com `requestAnimationFrame`

```js
let rafId;
function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00ff41';
  ctx.font = `${fontSize}px monospace`;
  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i] += 0.5 + Math.random() * 0.5;
  }
  rafId = requestAnimationFrame(drawMatrix);
}
rafId = requestAnimationFrame(drawMatrix);
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth; 
  canvas.height = window.innerHeight;
});
```

> Troca o `setInterval` por `requestAnimationFrame`. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

### 3.5. Capacidade correta no monitor

```js
// Router.updateMonitor - patch do cálculo
const maxValue = atm.drawers.reduce((sum, d) => sum + (d.max * d.face), 0);
const pct = (total / maxValue) * 100;
```

> Usa “valor máximo” por denominação em vez de `count * max`. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

### 3.6. Saque e depósito por denominações (ATM)

```js
// Saque (greedy) já existe; vamos ajustar depósito
function depositToATM(atm, amount) {
  const faces = atm.drawers.map(d => d.face).sort((a,b) => b-a); // 100,50,20,10
  let remaining = Math.floor(amount); // inteiros no ATM
  for (const face of faces) {
    const drawer = atm.drawers.find(d => d.face === face);
    const canAdd = Math.min(Math.floor(remaining / face), drawer.max - drawer.count);
    if (canAdd > 0) {
      drawer.count += canAdd;
      remaining -= canAdd * face;
    }
  }
  return remaining === 0;
}
```

> Distribui por todas as gavetas e respeita `max`. Ajustar os efeitos colaterais na tesouraria (`vault`) de acordo com a origem do dinheiro. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

### 3.7. HTML-base mínimo (exemplo de esqueleto)



> Este esqueleto inclui os IDs e regiões que o JS/CSS esperam, para evitar `null`/`TypeError`. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js), [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)

***

## 4) Novas funções (além do que já existe)

### 4.1. **Perfis & Roles**

*   Perfis: **Admin**, **Operador (Caixa)**, **Cliente** — com permissões distintas (e menus que se adaptam).
*   Autenticação por **módulo** (ainda que simulada): senhas **não** hardcoded, exigir troca na primeira entrada. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

### 4.2. **Conciliação & Auditoria**

*   Painel de **conciliação**: comparar “cofre + caixas + ATMs” vs “soma de saldos das contas” e destacar divergências.
*   **Auditoria de ATM**: histórico por gaveta (reabastecimento, alívio, manutenção), export em CSV/JSON. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

### 4.3. **Investimentos realistas**

*   Simulador de **CDB pós/prefixado**, **Tesouro**, **Fundos**, com **carência**, **IR** e marcação a mercado.
*   **Tabela Price/SAC** e **conversor de taxas** (pré, pós, híbridas) — liga com seu projeto de fórmulas financeiras. (Podemos acoplar módulo standalone).

> Integra bem com suas metas mencionadas nos projetos de cálculo/finanças.

### 4.4. **Agendamentos/Boletos**

*   **Agendar pagamentos/transferências**, com filas e execução simulada por “cron”.
*   Validação de **código de barras** de boletos (estrutura/dígito verificador — simulado).

### 4.5. **PWA & Offline-first**

*   **Service Worker** para cache dos assets, páginas e backup local.
*   Tela de **estado offline** + fila de operações armazenadas (apenas simulação).

### 4.6. **Internacionalização (i18n)**

*   Dicionário de strings e toggle PT/EN — útil se você quiser demo público.

### 4.7. **Logs avançados**

*   Níveis: `INFO/WARN/ERROR/SUCCESS`, filtros, busca, export em **CSV**, retenção com rotação (limite por tamanho/tempo). [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

### 4.8. **Testes**

*   Unit tests (ex.: algoritmo de saque por denominações, validações de contas, import/export).
*   Smoke tests de inicialização do app (existência dos elementos-chave).

***

## 5) Organização do código (proposta)

**Estrutura sugerida:**

    /src
      /core
        db.js        (localStorage/IndexedDB + schema + migrações)
        auth.js      (Admin/Operador/Cliente, mock + políticas)
        router.js    (views e navegação)
      /domain
        atm.js       (algoritmos de saque/depósito, capacidade, manutenção)
        accounts.js  (CRUD de entidades, senhas, status)
        ib.js        (Internet Banking + PIX/boletos/investimentos)
      /ui
        notifications.js
        console.js
        components/  (modais, cards, tabelas)
      index.html
      style.css
      main.js        (bootstrap: init Console, DB, Router, ScrollControls)

> Essa modularização tornará manutenção e testes muito mais simples; hoje tudo está concentrado em `script.js`. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

***

## 6) Backlog priorizado

**Milestone 1 – Robustez & segurança (hoje → 2 dias)**

*   [ ] Esqueleto HTML completo (views/IDs esperados). [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js), [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)
*   [ ] Patches: `Tabs.show`, `NotificationSystem`, `DB.logOperation` fallback. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   [ ] Checagens de `getElementById` + logs de aviso. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   [ ] Media queries unificadas e `prefers-reduced-motion`. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)

**Milestone 2 – ATM & dados (2–3 dias)**

*   [ ] Saque/depósito por denominações com limites e impacto correto na tesouraria/caixa. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   [ ] Conciliação básica (sumários + divergências). [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   [ ] Validação do `importData` com schema.

**Milestone 3 – UX & i18n (2 dias)**

*   [ ] Modais padrão para confirmar/alterar senhas/encerrar contas. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
*   [ ] Acessibilidade (foco, teclas, ARIA). [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)
*   [ ] Dicionário i18n (PT/EN).

**Milestone 4 – Investimentos & relatórios (3–4 dias)**

*   [ ] Módulo de investimentos realistas (CDB pós/prefixado, IR, carência).
*   [ ] Export de relatórios (JSON/CSV) de operações/ATMs.

***

## 7) Observações específicas por arquivo

*   **index.html**: carece de elementos que `script.js` e `style.css` esperam — precisamos criar as seções e IDs citados (lock screen, admin content, notificações, console lateral, views de hub/agência/terminais/IB/monitor). [\[index | HTML\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/index.html), [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js), [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)
*   **style.css**: excelente identidade visual “Matrix”, mas há duplicidade de media query e muitas animações — incluir `prefers-reduced-motion` e revisar a responsividade do painel do console e dos botões de scroll. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)
*   **script.js**: arquitetura em “Managers” é clara, com logs e notificações integrados; corrigir os pontos de segurança, fallback, cálculo do monitor, UX dos prompts e robustez de DOM, além de modularizar para facilitar evolução. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

***

## 8) Próximos passos (posso já entregar)

Se você quiser, eu já posso:

1.  **Gerar um `index.html` completo** com todas as views e elementos necessários, conectando ao seu CSS/JS. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js), [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/style.css)
2.  **Aplicar os patches** (Tabs/Notificações/Log/Monitor/Matrix Rain) diretamente no `script.js`. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)
3.  **Adicionar o algoritmo de depósito por denominação** e ajustar efeitos no cofre/caixa. [\[banco365-m...epoint.com\]](https://banco365-my.sharepoint.com/personal/cleytonmacedo_bb_com_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/script.js)

> Me diz se você prefere que eu gere o **HTML-base** agora (com layout e placeholders), ou se quer que eu comece pelos **patches JS** primeiro. Também posso alinhar o módulo de **investimentos** com as suas fórmulas (SAC/PRICE, pré/pós/híbridas, carência, IR) para ficar compatível com o teu projeto maior.

---

Perfeito, Cleyton! Abaixo estão **trechos de código comentados** (com termos técnicos em inglês e a tradução entre parênteses) para **cada ponto** que levantei. A ideia é você poder **copiar–colar** ou usar como **patch** — todos os exemplos estão pensados para encaixar no seu projeto atual (mesmo que você ainda vá ajustar o `index.html`).

> Dica: mantenha estes snippets em arquivos separados de rascunho (`_patches`) e vá aplicando ponto a ponto.\
> Obs.: comentários bilingues nos blocos: **EN** (English) / **PT-BR** (Português).

***

## A) HTML base — esqueleto mínimo de elementos esperados

Cria a estrutura que o seu `script.js` e o `style.css` referenciam (IDs, views, console, notificações, lock screen etc.).



***

## B) CSS — melhorias (unificação, acessibilidade, redução de movimento)

### B.1. Unificar `@media (max-width: 1400px)` (evitar duplicidade)

```css
/* style.css (patch) */
/* EN: Unified breakpoint styles for <=1400px
   PT-BR: Estilos unificados para telas <= 1400px */
@media (max-width: 1400px) {
  main {
    margin-right: 0;
    width: 100%;
  }

  /* EN: Console panel slides from top for narrow screens
     PT-BR: Console desliza de cima em telas estreitas */
  #console-panel {
    transform: translateY(-100%);
    width: 100%;
  }
  #console-panel.active {
    transform: translateY(0);
  }

  /* EN: Notifications adapt to full width on narrow screens
     PT-BR: Notificações ocupam largura completa em telas estreitas */
  #notifications {
    right: 10px;
    left: 10px;
    max-width: none;
  }

  /* EN: Scroll buttons near right edge
     PT-BR: Botões de rolagem perto da borda direita */
  .scroll-btn {
    right: 10px;
  }
}
```

### B.2. Acessibilidade: `:focus-visible` com alto contraste

```css
/* EN: Strong focus ring for keyboard users
   PT-BR: Realce de foco forte para usuários de teclado */
:focus-visible {
  outline: 2px solid var(--matrix-green);
  outline-offset: 3px;
  box-shadow: 0 0 0 4px rgba(0,255,65,0.25);
}
```

### B.3. Redução de movimento: `prefers-reduced-motion`

```css
/* EN: Respect users who prefer reduced motion
   PT-BR: Respeita usuários que preferem menos animação */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

***

## C) JavaScript — correções e melhorias

### C.1. `Tabs.show()` sem `event` global

```js
// script.js (patch Tabs)
// EN: Accept the triggering element to toggle 'active' class
// PT-BR: Aceita o elemento que disparou para alternar a classe 'active'
const Tabs = {
  show(id, btnEl) {
    Console.log(`Navegando para aba: ${id}`, 'info');

    // Hide all tab views
    document.querySelectorAll('[id^="tab-"]').forEach(e => e.style.display = 'none');

    // Show requested view (with defensive check)
    const view = document.getElementById('tab-' + id);
    if (!view) {
      NotificationSystem.warning('Aba inexistente', `tab-${id} não encontrada`);
      return;
    }
    view.style.display = 'block';

    // Toggle active class on buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    // Specific actions per tab
    if (id === 'logs') this.loadLogs();
  },

  loadLogs() {
    const container = document.getElementById('system-logs');
    if (!container) return;
    const logs = DB.data.systemLogs.slice(-50).reverse();
    if (logs.length === 0) {
      container.textContent = 'Nenhum log encontrado';
      return;
    }
    container.innerHTML = logs.map(log => `
      <div class="card">
        <div><strong>${new Date(log.timestamp).toLocaleString()}</strong> — ${log.user || 'system'}</div>
        <div>${log.operation}</div>
        <div>${String(log.details).replace(/[<>&]/g, s => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[s]))}</div>
      </div>
    `).join('');
  }
};
```

> Observação: na hora de montar `innerHTML`, **escape** básico de `<`, `>`, `&` para evitar injeções quando precisar concatenar strings.

***

### C.2. Notificações seguras (sem `innerHTML` não sanitizado)

```js
// script.js (patch NotificationSystem)
// EN: Build DOM nodes with textContent to avoid XSS
// PT-BR: Constrói nós de DOM com textContent para evitar XSS
class NotificationSystem {
  static show(title, message, type = 'info', duration = 5000) {
    const container = document.getElementById('notifications');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Fechar notificação (close notification)');
    closeBtn.textContent = '×';
    closeBtn.onclick = () => notification.remove();

    const titleEl = document.createElement('div');
    titleEl.className = 'title';
    titleEl.textContent = title;

    const msgEl = document.createElement('div');
    msgEl.className = 'message';
    msgEl.textContent = message;

    notification.append(closeBtn, titleEl, msgEl);
    container.appendChild(notification);

    // Auto-remove
    window.setTimeout(() => {
      if (notification.parentElement) notification.remove();
    }, duration);

    Console.log(`${type.toUpperCase()}: ${title} - ${message}`, type);
  }
  static success(title, message) { this.show(title, message, 'success'); }
  static error(title, message)   { this.show(title, message, 'error'); }
  static warning(title, message) { this.show(title, message, 'warning'); }
  static info(title, message)    { this.show(title, message, 'info'); }
}
```

***

### C.3. Fallback correto do usuário em `DB.logOperation`

```js
// script.js (patch DB.logOperation)
// EN: Safe user fallback (details?.user || 'system')
// PT-BR: Fallback seguro de usuário (details?.user || 'system')
logOperation(operation, details) {
  const log = {
    timestamp: new Date().toISOString(),
    operation,
    details,
    user: (details && details.user) || 'system'
  };
  this.data.systemLogs.push(log);
  if (this.data.systemLogs.length > 1000) {
    this.data.systemLogs = this.data.systemLogs.slice(-1000);
  }
  this.save();
  Console.log(`${operation}: ${typeof details === 'string' ? details : JSON.stringify(details)}`, 'info');
}
```

***

### C.4. Checar existência de elementos antes de usar

```js
// script.js (inicialização com checks)
// EN: Defensive DOM checks to avoid TypeError when element is missing
// PT-BR: Checagens defensivas de DOM para evitar TypeError quando faltam elementos
document.addEventListener('DOMContentLoaded', () => {
  Console.init();
  DB.init();
  ScrollControls.init();

  const toggleBtn = document.getElementById('console-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', Console.toggle);
  } else {
    NotificationSystem.warning('Console', 'Botão de toggle não encontrado (console-toggle)');
  }

  // Update hub stats if view exists
  if (document.getElementById('hub-total')) {
    AgenciaManager.updateHubStats();
  }

  NotificationSystem.success('Sistema Inicializado', 'Nexus Matrix v2.0 carregado com sucesso');
  Console.log('Sistema NEXUS v2.0 totalmente operacional', 'success');
});
```

***

### C.5. Matrix rain com `requestAnimationFrame`

```js
// script.js (patch Matrix Rain)
// EN: Use requestAnimationFrame for smoother animations and better performance
// PT-BR: Usa requestAnimationFrame para animação mais suave e melhor desempenho
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$@#%<>/\\{}+-=*';
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1).map(() => Math.random() * canvas.height);

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00ff41';
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    // Reset drop
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;

    // Speed with slight random
    drops[i] += 0.5 + Math.random() * 0.5;
  }
  requestAnimationFrame(drawMatrix);
}

// EN: Recompute columns/drops if fontSize or canvas change drastically
// PT-BR: Recalcula colunas/gotas se o fontSize ou canvas mudar muito
window.addEventListener('resize', () => {
  columns = Math.floor(canvas.width / fontSize);
  drops = Array(columns).fill(1).map(() => Math.random() * canvas.height);
});

requestAnimationFrame(drawMatrix);
```

***

### C.6. Monitor — cálculo de capacidade correto

```js
// script.js (patch Router.updateMonitor - apenas o cálculo)
// EN: capacity percentage based on VALUE (max notes * face value)
// PT-BR: percentual de capacidade baseado em VALOR (max * face)
updateMonitor() {
  const statusContainer = document.getElementById('terminals-status');
  if (!statusContainer) return;
  statusContainer.innerHTML = '';

  Object.keys(DB.data.atms).forEach(id => {
    const atm = DB.data.atms[id];
    const totalValue = AgenciaManager.getAtmTotal(atm);
    const maxValue = atm.drawers.reduce((sum, d) => sum + (d.max * d.face), 0);
    const pct = maxValue > 0 ? (totalValue / maxValue) * 100 : 0;

    statusContainer.innerHTML += `
      <div class="card">
        <strong>NÓ_${id.replace('atm','')}</strong><br/>
        Total: R$ ${totalValue.toLocaleString('pt-BR')}<br/>
        ● ${atm.status.toUpperCase()}<br/>
        ${pct.toFixed(1)}% capacidade (valor)
      </div>
    `;
  });

  const activityContainer = document.getElementById('recent-activity');
  if (!activityContainer) return;
  const recentLogs = DB.data.systemLogs.slice(-10).reverse();
  activityContainer.innerHTML = recentLogs.length === 0
    ? 'Nenhuma atividade recente'
    : recentLogs.map(log => `
        <div class="card">
          <div><strong>${log.operation}</strong></div>
          <div>${new Date(log.timestamp).toLocaleString()}</div>
          <div>${String(log.details)}</div>
        </div>
      `).join('');
}
```

***

### C.7. Depósito em ATM por denominações (e ajuste de cofres)

```js
// script.js (funções auxiliares para ATM)
// EN: Distribute deposit across drawers respecting max limits
// PT-BR: Distribui depósito entre gavetas respeitando limites máximos
function depositToATM(atm, amountInt) {
  // EN: ATMs accept integer cash amounts only
  // PT-BR: ATMs aceitam apenas valores inteiros em dinheiro
  let remaining = Math.floor(amountInt);
  // Sort faces high->low: 100,50,20,10
  const facesDesc = [...new Set(atm.drawers.map(d => d.face))].sort((a,b) => b-a);

  for (const face of facesDesc) {
    const drawer = atm.drawers.find(d => d.face === face);
    const capacityLeft = drawer.max - drawer.count;
    const notes = Math.min(Math.floor(remaining / face), capacityLeft);
    if (notes > 0) {
      drawer.count += notes;
      remaining -= notes * face;
    }
  }
  return remaining === 0; // true if fully deposited
}

// EN: Hook in AtendimentoManager.execute() for "deposito"
// PT-BR: Engate no AtendimentoManager.execute() para "depósito"
if (type === 'deposito') {
  acc.balance += val;
  if (this.curr === 'caixa') {
    // EN: Human cashier increases physical cash
    // PT-BR: Caixa humano aumenta o dinheiro físico
    DB.data.humanCashier += val;
  } else {
    const atm = DB.data.atms[this.curr];
    const ok = depositToATM(atm, val);
    if (!ok) {
      // EN: If drawers are full or remainder cannot be stored, revert account change
      // PT-BR: Se gavetas lotadas ou sobra não armazenável, reverte mudança na conta
      acc.balance -= val;
      NotificationSystem.error('Erro no depósito', 'Terminal sem capacidade para aceitar o valor inteiro');
      return;
    }
  }
  acc.hist.push({ desc: `DEPÓSITO ${this.curr}`, v: val, d: new Date().toLocaleDateString('pt-BR'), terminal: this.curr });
  operationSuccess = true;
  operationDetails = `Depósito R$ ${val.toFixed(2)} via ${this.curr}`;
}
```

> Nota: Em **cenário real**, depósitos no ATM não aumentam o **vault** no mesmo instante; você pode modelar que o valor **fica no ATM** até o **alívio/retirada** para o cofre (`vault`).

***

### C.8. Import/export com **validação de schema** e **migração por versão**

```js
// script.js (validação simples de schema)
// EN: Minimal JSON schema validation to avoid corrupt imports
// PT-BR: Validação mínima de schema JSON para evitar importações corrompidas
function validateDBSchema(data) {
  if (typeof data !== 'object' || data === null) return false;
  const requiredTop = ['config','treasury','humanCashier','atms','accounts','systemLogs'];
  for (const k of requiredTop) if (!(k in data)) return false;

  // Config checks
  if (typeof data.config?.systemVersion !== 'string') return false;
  if (!Number.isFinite(data.config?.totalSystemCash)) return false;

  // Treasury checks
  if (!Number.isFinite(data.treasury?.vault)) return false;

  // ATMs structure check
  if (typeof data.atms !== 'object') return false;
  for (const id of Object.keys(data.atms)) {
    const atm = data.atms[id];
    if (!Array.isArray(atm.drawers)) return false;
    for (const d of atm.drawers) {
      if (!Number.isFinite(d.face) || !Number.isInteger(d.count) || !Number.isInteger(d.max)) return false;
    }
  }

  // Accounts
  if (!Array.isArray(data.accounts)) return false;
  for (const a of data.accounts) {
    if (!Number.isInteger(a.id) || typeof a.name !== 'string') return false;
    if (!Number.isFinite(a.balance)) return false;
  }

  // Logs
  if (!Array.isArray(data.systemLogs)) return false;

  return true;
}

// EN: Migrate old versions to current schema
// PT-BR: Migra versões antigas para o schema atual
function migrateDBIfNeeded(data) {
  const v = data.config?.systemVersion || '1.0';
  // Example migration steps
  if (v === '1.0') {
    // add missing fields, rename keys, etc.
    data.config.systemVersion = '2.0';
  }
  return data;
}

// AdminManager.importData (patch)
importData() {
  Console.log('Importação de dados iniciada', 'warning');
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e2 => {
      try {
        const data = JSON.parse(e2.target.result);
        if (!validateDBSchema(data)) {
          throw new Error('Schema inválido');
        }
        const migrated = migrateDBIfNeeded(data);
        DB.data = migrated;
        DB.save();
        Console.log('Dados importados com sucesso', 'success');
        NotificationSystem.success('Importação Concluída', 'Dados restaurados do backup');
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
```

***

### C.9. Modais customizados no lugar de `confirm/prompt`



```js
// script.js (Modal util)
// EN: Simple modal utility (resolve Promise on OK/Cancel)
// PT-BR: Utilitário simples de modal (resolve Promessa em OK/Cancelar)
const Modal = {
  open({ title, message, inputs = [] }) {
    return new Promise(resolve => {
      const el = document.getElementById('modal');
      const t = document.getElementById('modal-title');
      const m = document.getElementById('modal-message');
      const box = document.getElementById('modal-inputs');
      const ok = document.getElementById('modal-ok');
      const cancel = document.getElementById('modal-cancel');

      if (!el || !t || !m || !box || !ok || !cancel) return resolve(null);

      t.textContent = title || 'Confirmação';
      m.textContent = message || '';
      box.innerHTML = '';
      const values = {};

      inputs.forEach(inp => {
        const wrap = document.createElement('div');
        const lab = document.createElement('label');
        lab.textContent = inp.label;
        const field = document.createElement('input');
        field.type = inp.type || 'text';
        field.value = inp.value || '';
        field.id = inp.id;
        field.oninput = () => { values[inp.id] = field.value; };
        wrap.append(lab, field);
        box.append(wrap);
        values[inp.id] = field.value;
      });

      const close = (result) => { el.style.display = 'none'; resolve(result); };

      ok.onclick = () => close({ ok: true, values });
      cancel.onclick = () => close({ ok: false });
      el.style.display = 'block';
    });
  }
};

// EX: Uso para alterar senhas (replace prompt/confirm)
async function changePasswords(id) {
  const acc = DB.data.accounts.find(a => a.id == id);
  const res = await Modal.open({
    title: `Alterar senhas para ${acc.name}`,
    message: 'Informe as novas chaves (WEB e TRANS).',
    inputs: [
      { id: 'pw', label: 'Senha WEB', type: 'text', value: acc.pw },
      { id: 'pt', label: 'Senha TRANS (PIN)', type: 'text', value: acc.pt }
    ]
  });
  if (!res || !res.ok) return;

  const { pw, pt } = res.values;
  if (!pw?.trim() || !pt?.trim()) {
    NotificationSystem.error('Erro de Validação', 'Senhas não podem estar vazias');
    return;
  }
  acc.pw = pw.trim();
  acc.pt = pt.trim();
  DB.logOperation('SENHAS_ALTERADAS', `Chaves alteradas para entidade ${acc.name} (ID: ${id})`);
  DB.save();
  AgenciaManager.renderAccounts();
  NotificationSystem.success('Senhas Alteradas', 'Chaves de acesso atualizadas com sucesso');
}
```

***

### C.10. Botões de scroll com posição dinâmica (dependendo do console)

```js
// script.js (ScrollControls dynamic position)
// EN: Adjust scroll button position based on console panel visibility
// PT-BR: Ajusta posição dos botões de rolagem conforme visibilidade do console
const ScrollControls = {
  init() {
    const topBtn = document.createElement('button');
    topBtn.className = 'scroll-btn scroll-to-top';
    topBtn.textContent = '↑';
    topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const bottomBtn = document.createElement('button');
    bottomBtn.className = 'scroll-btn scroll-to-bottom';
    bottomBtn.textContent = '↓';
    bottomBtn.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    document.body.appendChild(topBtn);
    document.body.appendChild(bottomBtn);

    const adjust = () => {
      const consoleActive = document.getElementById('console-panel')?.classList.contains('active');
      // EN: If console active on large screens, keep right offset ~360px; else 10px
      // PT-BR: Com console ativo em telas grandes, offset ~360px; senão 10px
      const right = (consoleActive && window.innerWidth > 1400) ? '360px' : '10px';
      topBtn.style.right = right;
      bottomBtn.style.right = right;
    };

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const scrollBottom = window.pageYOffset + window.innerHeight;
      const h = document.body.scrollHeight;
      topBtn.classList.toggle('visible', scrollTop > 100);
      bottomBtn.classList.toggle('visible', scrollBottom < h - 100);
    });

    // EN: Re-adjust on resize and console toggle
    // PT-BR: Reajusta no resize e ao alternar console
    window.addEventListener('resize', adjust);
    const toggleBtn = document.getElementById('console-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', adjust);
    adjust();
  }
};
```

***

## D) Acessibilidade e teclado — atalhos básicos

```js
// script.js (A11y: keyboard)
// EN: Keyboard shortcuts for terminal UI
// PT-BR: Atalhos de teclado para interface de terminal
document.addEventListener('keydown', (ev) => {
  // EN: ESC to close terminal
  // PT-BR: ESC fecha terminal
  if (ev.key === 'Escape') {
    if (document.getElementById('terminal-interface')?.style.display === 'block') {
      AtendimentoManager.closeTerminal();
    }
  }

  // EN: Enter triggers operation when focus in terminal area
  // PT-BR: Enter executa operação quando em foco na área do terminal
  if (ev.key === 'Enter') {
    if (document.getElementById('terminal-interface')?.style.display === 'block') {
      AtendimentoManager.execute();
    }
  }
});
```

***

## E) Segurança — não hardcode, “hash” simulado e limitação de tentativas

> Mesmo em simulação, evite credenciais fixas e limite tentativas.

```js
// script.js (AdminAuth melhorado - demo)
// EN: Simulated password hashing using Web Crypto API (SHA-256)
// PT-BR: Hash simulado de senha usando Web Crypto API (SHA-256)
async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
}

const AdminAuth = {
  // EN: Example admin users with hashed passwords (store securely in real apps)
  // PT-BR: Exemplo de admins com senhas hasheadas (em apps reais, armazenar seguro no backend)
  admins: [
    { user: 'nexus',   passHash: null }, // to be set at first login / configured
    { user: 'cosmos',  passHash: null }
  ],
  attempts: 0,
  lockedUntil: 0,

  async setDefaultPasswords() {
    // EN: One-time setup (simulate) | PT-BR: Setup inicial (simulado)
    this.admins[0].passHash = await sha256('0099');
    this.admins[1].passHash = await sha256('0099');
  },

  async login() {
    // rate limit
    const now = Date.now();
    if (now < this.lockedUntil) {
      NotificationSystem.error('Bloqueado', 'Muitas tentativas. Aguarde 30s.');
      return;
    }

    const u = document.getElementById('admin-user')?.value || '';
    const p = document.getElementById('admin-pass')?.value || '';
    const passHash = await sha256(p);

    const admin = this.admins.find(a => a.user === u && a.passHash === passHash);
    if (admin) {
      this.attempts = 0;
      document.getElementById('lock-screen').style.display = 'none';
      document.getElementById('admin-content').style.display = 'block';
      AgenciaManager.init();
      AdminManager.updateMetrics();
      NotificationSystem.success('Acesso Autorizado', `Usuário ${u} conectado ao mainframe`);
    } else {
      this.attempts++;
      NotificationSystem.error('Acesso Negado', 'Credenciais inválidas');
      document.getElementById('admin-error').textContent = 'ACESSO NEGADO';
      if (this.attempts >= 5) {
        this.lockedUntil = Date.now() + 30000; // 30s
        NotificationSystem.warning('Proteção', 'Bloqueio temporário após 5 tentativas.');
      }
    }
  },

  logout() {
    NotificationSystem.warning('Sessão Encerrada', 'Usuário desconectado do mainframe');
    document.getElementById('lock-screen').style.display = 'flex';
    document.getElementById('admin-content').style.display = 'none';
    document.getElementById('admin-pass').value = '';
  }
};

// EN/PT-BR: initialize default hashed passwords (demo)
AdminAuth.setDefaultPasswords();
```

***

## F) Testes unitários simples (lógica de ATM)

```js
// script.js (mini-tests - executar em dev)
// EN: Quick assertions for depositToATM and getAtmTotal
// PT-BR: Asserções rápidas para depositToATM e getAtmTotal
(function miniTests() {
  const testATM = { drawers: [
    { face:100, count:0, max:10 },
    { face:50,  count:0, max:10 },
    { face:20,  count:0, max:10 },
    { face:10,  count:0, max:10 }
  ]};

  // deposit 380 => 3x100, 1x50, 1x20, 1x10
  const ok = depositToATM(testATM, 380);
  console.assert(ok, 'Depósito deve ser possível');
  console.assert(testATM.drawers[0].count === 3, '3 notas de 100');
  console.assert(testATM.drawers[1].count === 1, '1 nota de 50');
  console.assert(testATM.drawers[2].count === 1, '1 nota de 20');
  console.assert(testATM.drawers[3].count === 1, '1 nota de 10');
})();
```

***

# Como aplicar na prática (roteiro rápido)

1.  **Crie/ajuste o `index.html`** com o esqueleto (Seção A).
2.  **Aplique os patches de CSS** (Seção B) — unificação + acessibilidade + redução de movimento.
3.  **Aplique os patches de JS**:
    *   `Tabs.show` (C.1),
    *   `NotificationSystem` (C.2),
    *   `DB.logOperation` (C.3),
    *   Checks de inicialização (C.4),
    *   Matrix rain (C.5),
    *   Monitor capacidade (C.6),
    *   Depósito por denominações (C.7),
    *   Import schema/migração (C.8),
    *   Modal util (C.9),
    *   Scroll dinâmico (C.10).
4.  **Opcional**: Autenticação com “hash” e proteção de tentativas (Seção E).
5.  **Teste** localmente (Seção F) e faça pequenos commits por patch.

Se quiser, eu posso **gerar uma versão consolidada** dos arquivos (`index.html`, `style.css`, `script.js`) já com todas as melhorias aplicadas. Você prefere que eu entregue **arquivos completos** ou continuar com esses **patches** ponto a ponto?
