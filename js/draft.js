// ===================================================
// SURVIVOR FANTASY GAME - Draft System
// ===================================================

const MAX_PICKS = 4;

let currentFilter = 'all';

function renderDraftBoard() {
  if (!gameState) return;

  updatePickCounter();
  renderPickSlots();
  renderContestantGrid();

  // Finalize button state
  const finalizeBtn = document.getElementById('btn-finalize-draft');
  if (finalizeBtn) {
    const isDone = gameState.draftedTeam.length >= MAX_PICKS;
    finalizeBtn.disabled = !isDone;
    finalizeBtn.style.opacity = isDone ? '1' : '0.5';
  }

  // If already drafted, show banner
  const draftedBanner = document.getElementById('draft-completed-banner');
  if (draftedBanner) {
    const alreadyFinalized = gameState.draftFinalized;
    draftedBanner.classList.toggle('hidden', !alreadyFinalized);
  }
}

function updatePickCounter() {
  const picksEl = document.getElementById('picks-count');
  const maxEl = document.getElementById('picks-max');
  if (picksEl) picksEl.textContent = gameState.draftedTeam.length;
  if (maxEl) maxEl.textContent = MAX_PICKS;
}

function renderPickSlots() {
  const slotList = document.getElementById('my-picks-list');
  if (!slotList) return;

  slotList.innerHTML = '';

  for (let i = 0; i < MAX_PICKS; i++) {
    const li = document.createElement('li');
    li.className = 'pick-slot';

    const cId = gameState.draftedTeam[i];
    if (cId) {
      const c = SEASON.contestants.find(x => x.id === cId);
      li.classList.add('filled');
      li.innerHTML = `
        <span class="pick-num">#${i + 1}</span>
        <span class="pick-emoji">${c.emoji}</span>
        <div class="pick-info">
          <div class="pname">${c.name}</div>
          <div class="ptribe">${c.tribe}</div>
        </div>
        ${!gameState.draftFinalized ? `<button class="btn-remove-pick" data-id="${cId}" title="Remove" style="background:none;color:var(--danger);font-size:1.1rem;padding:4px;">✕</button>` : ''}
      `;
    } else {
      li.classList.add('empty');
      li.innerHTML = `
        <span class="pick-num">#${i + 1}</span>
        <span style="color:var(--text-muted);font-size:0.85rem;flex:1;text-align:center;">— empty slot —</span>
      `;
    }

    slotList.appendChild(li);
  }

  // Attach remove listeners
  slotList.querySelectorAll('.btn-remove-pick').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      removePick(id);
    });
  });
}

function renderContestantGrid() {
  const grid = document.getElementById('contestants-grid');
  if (!grid) return;

  let list = SEASON.contestants;

  // Apply tribe filter
  if (currentFilter === 'lairo') list = list.filter(c => c.tribe === 'Lairo');
  else if (currentFilter === 'vokai') list = list.filter(c => c.tribe === 'Vokai');

  grid.innerHTML = list.map(c => {
    const isDrafted = gameState.draftedTeam.includes(c.id);
    const isSelected = false; // We immediately add on click

    return `
      <div class="draft-card ${isDrafted ? 'drafted' : ''}"
           data-id="${c.id}"
           title="${c.name} — ${c.occupation}">
        <span class="card-emoji">${c.emoji}</span>
        <div class="card-name">${c.name}</div>
        <div class="card-occ">${c.occupation}</div>
        <span class="contestant-tribe tribe-${c.tribe.toLowerCase()}" style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:0.65rem;margin-bottom:6px;">${c.tribe}</span>
        <div style="font-size:0.65rem;color:var(--text-muted);">Age ${c.age}</div>
        ${isDrafted ? '<div class="drafted-label">PICKED</div>' : ''}
      </div>`;
  }).join('');

  // Click to pick
  grid.querySelectorAll('.draft-card:not(.drafted)').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      pickContestant(id);
    });
  });
}

function pickContestant(contestantId) {
  if (!gameState) return;
  if (gameState.draftFinalized) {
    showToast('Your draft is already finalized!', 'warning');
    return;
  }
  if (gameState.draftedTeam.length >= MAX_PICKS) {
    showToast(`You can only pick ${MAX_PICKS} survivors!`, 'warning');
    return;
  }
  if (gameState.draftedTeam.includes(contestantId)) {
    showToast('You already picked this survivor!', 'warning');
    return;
  }

  gameState.draftedTeam.push(contestantId);
  saveState();

  const c = SEASON.contestants.find(x => x.id === contestantId);
  showToast(`${c.emoji} ${c.name} added to your team!`, 'success', 2000);

  renderDraftBoard();

  if (gameState.draftedTeam.length >= MAX_PICKS) {
    showToast('Team full! Click "Finalize Draft" to lock in.', 'info', 4000);
  }
}

function removePick(contestantId) {
  if (!gameState || gameState.draftFinalized) return;
  gameState.draftedTeam = gameState.draftedTeam.filter(id => id !== contestantId);
  saveState();
  renderDraftBoard();
}

function finalizeDraft() {
  if (!gameState) return;
  if (gameState.draftedTeam.length < MAX_PICKS) {
    showToast(`Pick all ${MAX_PICKS} survivors first!`, 'warning');
    return;
  }
  if (gameState.draftFinalized) {
    showView('dashboard');
    renderDashboard();
    return;
  }

  gameState.draftFinalized = true;
  saveState();
  recalculateDraftPoints();
  updateScoreDisplay();

  const teamNames = gameState.draftedTeam.map(id => {
    const c = SEASON.contestants.find(x => x.id === id);
    return c ? c.name : '?';
  }).join(', ');

  showModal('🏆', 'Draft Complete!',
    `Your team: ${teamNames}. May the best survivor win!`,
    0,
    () => {
      showView('dashboard');
      renderDashboard();
    }
  );

  renderDraftBoard();
}

// ---- Draft Filter Buttons ----
function initDraftFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderContestantGrid();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDraftFilters();

  document.getElementById('btn-finalize-draft')?.addEventListener('click', finalizeDraft);

  document.getElementById('btn-view-dashboard')?.addEventListener('click', () => {
    showView('dashboard');
    renderDashboard();
  });
});
