// ===================================================
// SURVIVOR FANTASY GAME - Weekly Voting & Predictions
// ===================================================

let currentBootPick = null;
let currentWinnerPick = null;

function renderVoteScreen() {
  if (!gameState) return;

  const week = gameState.currentWeek;
  const remaining = getRemainingContestants(week);
  const existingVote = getVoteForWeek(week);

  // Update header
  const weekLabel = document.getElementById('tribal-week-label');
  if (weekLabel) weekLabel.textContent = `Week ${week} — Tribal Council`;

  const weekDesc = document.getElementById('tribal-week-desc');
  if (weekDesc) {
    const elim = ELIMINATION_ORDER.find(e => e.week === week);
    weekDesc.textContent = elim ? elim.note : 'Who will be voted out tonight?';
  }

  // Restore existing picks if any
  currentBootPick = existingVote?.bootPick || null;
  currentWinnerPick = existingVote?.winnerPick || null;

  renderBootVoteList(remaining);
  renderWinnerVoteList(remaining);
  updateVoteSubmitState(existingVote);
  renderPreviousResults();
}

function renderBootVoteList(remaining) {
  const list = document.getElementById('boot-vote-list');
  if (!list) return;

  list.innerHTML = remaining.map(c => {
    const checked = currentBootPick === c.id;
    return `
      <li class="vote-option ${checked ? 'checked' : ''}" data-id="${c.id}" data-type="boot">
        <div class="vote-radio-circle"></div>
        <span class="v-emoji">${c.emoji}</span>
        <div>
          <div class="v-name">${c.name}</div>
          <div class="v-tribe">${c.tribe} • ${c.occupation}</div>
        </div>
      </li>`;
  }).join('');

  list.querySelectorAll('.vote-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const id = parseInt(opt.dataset.id);
      currentBootPick = id;
      list.querySelectorAll('.vote-option').forEach(o => o.classList.remove('checked'));
      opt.classList.add('checked');
      updateVoteSubmitState(null);
    });
  });
}

function renderWinnerVoteList(remaining) {
  const list = document.getElementById('winner-vote-list');
  if (!list) return;

  list.innerHTML = remaining.map(c => {
    const checked = currentWinnerPick === c.id;
    return `
      <li class="vote-option ${checked ? 'checked' : ''}" data-id="${c.id}" data-type="winner">
        <div class="vote-radio-circle"></div>
        <span class="v-emoji">${c.emoji}</span>
        <div>
          <div class="v-name">${c.name}</div>
          <div class="v-tribe">${c.tribe}</div>
        </div>
      </li>`;
  }).join('');

  list.querySelectorAll('.vote-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const id = parseInt(opt.dataset.id);
      currentWinnerPick = id;
      list.querySelectorAll('.vote-option').forEach(o => o.classList.remove('checked'));
      opt.classList.add('checked');
      updateVoteSubmitState(null);
    });
  });
}

function updateVoteSubmitState(existingVote) {
  const submitBtn = document.getElementById('btn-submit-votes');
  const lockedMsg = document.getElementById('vote-locked-msg');
  const ptsPreview = document.getElementById('vote-pts-preview');

  if (!submitBtn) return;

  if (existingVote?.locked) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.textContent = '✅ Votes Submitted';
    if (lockedMsg) lockedMsg.classList.remove('hidden');
  } else {
    const ready = currentBootPick !== null && currentWinnerPick !== null;
    submitBtn.disabled = !ready;
    submitBtn.style.opacity = ready ? '1' : '0.5';
    submitBtn.textContent = ready ? '🔥 Cast Your Vote' : 'Select Both Picks';
    if (lockedMsg) lockedMsg.classList.add('hidden');
  }

  // Points preview
  if (ptsPreview) {
    ptsPreview.textContent = `Correct boot pick = +${SCORING.CORRECT_BOOT} pts | Correct winner pick = +${SCORING.CORRECT_WINNER_PICK} pts/week`;
  }
}

function submitVotes() {
  if (!currentBootPick || !currentWinnerPick) {
    showToast('Select both picks before submitting!', 'warning');
    return;
  }

  const week = gameState.currentWeek;
  const existing = getVoteForWeek(week);
  if (existing?.locked) {
    showToast('Your votes are already locked in!', 'warning');
    return;
  }

  const success = lockVotes(week, currentBootPick, currentWinnerPick);
  if (!success) return;

  const bootName = SEASON.contestants.find(c => c.id === currentBootPick)?.name;
  const winnerName = SEASON.contestants.find(c => c.id === currentWinnerPick)?.name;

  showModal(
    '🗳️',
    'Votes Cast!',
    `Boot pick: ${bootName}\nWinner pick: ${winnerName}\n\nResults will be revealed after the episode!`,
    null,
    () => renderVoteScreen()
  );

  renderVoteScreen();
  showToast('Your predictions are locked in!', 'success');
}

function renderPreviousResults() {
  const section = document.getElementById('vote-results-section');
  if (!section) return;

  const week = gameState.currentWeek;
  const results = [];

  // Show results for all past weeks where we have predictions
  for (let w = 1; w < week; w++) {
    const pred = getVoteForWeek(w);
    if (!pred) continue;

    const actualElim = ELIMINATION_ORDER.find(e => e.week === w);
    if (!actualElim) continue;

    const bootCorrect = pred.bootPick === actualElim.eliminated;
    const elimContestant = SEASON.contestants.find(c => c.id === actualElim.eliminated);
    const pickedContestant = SEASON.contestants.find(c => c.id === pred.bootPick);
    const winner = SEASON.contestants.find(c => c.isWinner);
    const winnerCorrect = winner && pred.winnerPick === winner.id;

    results.push({
      week: w,
      bootCorrect,
      winnerCorrect,
      elimName: elimContestant?.name || '?',
      pickedName: pickedContestant?.name || '?',
      bootPts: bootCorrect ? SCORING.CORRECT_BOOT : 0,
      winnerPts: winnerCorrect ? SCORING.CORRECT_WINNER_PICK : 0,
    });
  }

  if (!results.length) {
    section.innerHTML = `
      <div class="results-card">
        <h3>📋 Previous Results</h3>
        <p style="color:var(--text-muted);font-size:0.9rem;">No results yet. Advance weeks on the dashboard to see outcomes!</p>
      </div>`;
    return;
  }

  section.innerHTML = `
    <div class="results-card">
      <h3>📋 Previous Results</h3>
      <div>
        ${results.map(r => `
          <div style="border-bottom:1px solid rgba(255,255,255,0.05);padding:12px 0;">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">
              Week ${r.week}
            </div>
            <div class="result-row">
              <span class="result-outcome ${r.bootCorrect ? 'outcome-correct' : 'outcome-wrong'}">
                ${r.bootCorrect ? '✅' : '❌'}
              </span>
              <span style="flex:1;font-size:0.85rem;">
                Boot: You picked <strong>${r.pickedName}</strong> — was <strong>${r.elimName}</strong>
              </span>
              <span class="pts-earned">${r.bootPts > 0 ? `+${r.bootPts}` : '0'} pts</span>
            </div>
            <div class="result-row">
              <span class="result-outcome ${r.winnerCorrect ? 'outcome-correct' : 'outcome-wrong'}">
                ${r.winnerCorrect ? '✅' : '❌'}
              </span>
              <span style="flex:1;font-size:0.85rem;">Winner prediction this week</span>
              <span class="pts-earned">${r.winnerPts > 0 ? `+${r.winnerPts}` : '0'} pts</span>
            </div>
          </div>
        `).join('')}
        <div style="padding-top:12px;text-align:right;">
          <strong style="color:var(--fire-yellow);">
            Total prediction pts: ${results.reduce((s, r) => s + r.bootPts + r.winnerPts, 0)}
          </strong>
        </div>
      </div>
    </div>`;
}

function renderStandings() {
  if (!gameState) return;

  const lb = getLeaderboard();

  // Podium (top 3)
  const podium = document.getElementById('standings-podium');
  if (podium && lb.length >= 3) {
    const top3 = [lb[1], lb[0], lb[2]]; // 2nd, 1st, 3rd for visual podium
    const medals = ['🥈', '🥇', '🥉'];
    podium.innerHTML = top3.map((p, i) => `
      <div class="podium-place">
        <div style="font-size:1.8rem;margin-bottom:6px;">${medals[i]}</div>
        <div class="podium-block">${i === 1 ? '1' : i === 0 ? '2' : '3'}</div>
        <div class="podium-name">${p.name.replace(' (You)', '')}</div>
        <div class="podium-score">${p.score} pts</div>
      </div>`).join('');
  }

  // Full leaderboard table
  const tableBody = document.getElementById('leaderboard-body');
  if (tableBody) {
    tableBody.innerHTML = lb.map((p, i) => {
      const rank = i + 1;
      const isMe = p.isMe;
      return `
        <tr>
          <td class="rank-cell rank-${rank <= 3 ? rank : ''}">${rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : rank}</td>
          <td class="player-cell ${isMe ? 'you' : ''}">${isMe ? '⭐ ' : ''}${p.name}</td>
          <td class="pts-cell">${p.score}</td>
          <td class="sub-pts">${p.draft}</td>
          <td class="sub-pts">${p.predictions}</td>
          <td class="sub-pts">${p.challenges}</td>
        </tr>`;
    }).join('');
  }

  // Season cast status
  const seasonGrid = document.getElementById('season-cast-grid');
  if (seasonGrid) {
    const week = gameState.currentWeek;
    const eliminatedIds = ELIMINATION_ORDER
      .filter(e => e.week < week)
      .map(e => e.eliminated);

    seasonGrid.innerHTML = SEASON.contestants
      .sort((a, b) => (a.eliminated || 99) - (b.eliminated || 99))
      .map(c => {
        const isElim = eliminatedIds.includes(c.id);
        const isWinner = c.isWinner && week >= 14;
        const isDrafted = gameState.draftedTeam.includes(c.id);

        return `
          <div class="season-contestant ${isElim ? 'eliminated-c' : isWinner ? 'winner-c' : 'in-game'}">
            <span style="font-size:2rem;">${c.emoji}</span>
            <div style="font-size:0.75rem;font-weight:700;margin-top:6px;">${c.name}</div>
            <span class="contestant-tribe tribe-${c.tribe.toLowerCase()}" style="font-size:0.65rem;padding:2px 6px;border-radius:8px;display:inline-block;margin:4px 0;">${c.tribe}</span>
            ${isWinner ? '<div style="color:var(--immunity-gold);font-size:0.7rem;">🏆 Winner</div>' : ''}
            ${isElim ? `<div class="elim-ep">Eliminated Wk ${c.eliminated}</div>` : ''}
            ${isDrafted ? '<div style="color:var(--fire-yellow);font-size:0.65rem;">⭐ Your Pick</div>' : ''}
          </div>`;
      }).join('');
  }
}

// Wire up vote submit button
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-submit-votes')?.addEventListener('click', submitVotes);
});
