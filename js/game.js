// ===================================================
// SURVIVOR FANTASY GAME - Core Game Engine
// ===================================================

const STORAGE_KEY = 'survivorFantasyGame';

// Default game state
function createDefaultState(playerName) {
  return {
    playerName,
    draftedTeam: [],          // Array of contestant IDs
    weeklyPredictions: {},    // { "week-N": { bootPick: id, winnerPick: id, locked: bool } }
    challengeScores: {},      // { challengeId: { score, completed } }
    pointsBreakdown: {
      draft: 0,
      predictions: 0,
      challenges: 0,
    },
    totalScore: 0,
    currentWeek: 1,
    completedChallenges: [],
    resultsRevealed: [],      // Weeks where results have been shown
    createdAt: Date.now(),
    lastUpdated: Date.now(),
    // Leaderboard: simulate other players
    leaderboard: generateFakePlayers(),
  };
}

// Generate simulated opponent players for leaderboard
function generateFakePlayers() {
  const names = [
    'OutwitFan99', 'TribalQueen', 'JungleSurvivor', 'RobHasAPodcast',
    'IslandStrategist', 'FireMaker', 'PagonggKing', 'ImmunityWinner'
  ];
  return names.map((name, i) => ({
    name,
    score: Math.floor(Math.random() * 180) + 20,
    draft: Math.floor(Math.random() * 60) + 10,
    predictions: Math.floor(Math.random() * 80) + 5,
    challenges: Math.floor(Math.random() * 40),
    isBot: true,
  }));
}

// ---- State Management ----

let gameState = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      gameState = JSON.parse(raw);
      return true;
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return false;
}

function saveState() {
  if (!gameState) return;
  gameState.lastUpdated = Date.now();
  gameState.totalScore =
    gameState.pointsBreakdown.draft +
    gameState.pointsBreakdown.predictions +
    gameState.pointsBreakdown.challenges;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function initNewGame(playerName) {
  gameState = createDefaultState(playerName);
  saveState();
}

function clearGame() {
  localStorage.removeItem(STORAGE_KEY);
  gameState = null;
}

// ---- Scoring Engine ----

function recalculateDraftPoints() {
  if (!gameState || !gameState.draftedTeam.length) return;

  let total = 0;
  const week = gameState.currentWeek;

  gameState.draftedTeam.forEach(cId => {
    const contestant = SEASON.contestants.find(c => c.id === cId);
    if (!contestant) return;

    // Points per week survived
    const elimWeek = contestant.eliminated;
    const weeksAlive = elimWeek ? Math.min(elimWeek - 1, week - 1) : week - 1;
    total += weeksAlive * SCORING.TEAM_MEMBER_ALIVE;

    // Immunity wins (use elimination order data)
    const immunityWins = ELIMINATION_ORDER.filter(e => e.immunityWinner === cId && e.week <= week).length;
    total += immunityWins * SCORING.TEAM_IMMUNITY_WIN;

    // Won the season
    if (contestant.isWinner && (!elimWeek || week >= 14)) {
      total += SCORING.TEAM_WINS_SEASON;
    }
  });

  gameState.pointsBreakdown.draft = total;
  saveState();
}

function recalculatePredictionPoints() {
  if (!gameState) return;

  let total = 0;

  Object.entries(gameState.weeklyPredictions).forEach(([weekKey, pred]) => {
    if (!pred.locked) return;

    const weekNum = parseInt(weekKey.replace('week-', ''));
    if (weekNum >= gameState.currentWeek) return; // Only score past weeks

    const actualElim = ELIMINATION_ORDER.find(e => e.week === weekNum);
    if (!actualElim) return;

    // Boot prediction
    if (pred.bootPick === actualElim.eliminated) {
      total += SCORING.CORRECT_BOOT;
    }

    // Winner prediction (if week is past and season over, check full winner)
    if (weekNum <= gameState.currentWeek) {
      const winner = SEASON.contestants.find(c => c.isWinner);
      if (winner && pred.winnerPick === winner.id) {
        total += SCORING.CORRECT_WINNER_PICK;
      }
    }
  });

  gameState.pointsBreakdown.predictions = total;
  saveState();
}

function awardChallengePoints(challengeId, score, isFirstTime) {
  if (!gameState) return;

  const existing = gameState.challengeScores[challengeId];
  const prevBest = existing ? existing.score : 0;

  gameState.challengeScores[challengeId] = {
    score: Math.max(score, prevBest),
    completedAt: Date.now(),
  };

  // Only count once for completion bonus, but always take best score
  let points = 0;
  if (!existing || existing.score < score) {
    points = score;
  }

  if (isFirstTime && !gameState.completedChallenges.includes(challengeId)) {
    gameState.completedChallenges.push(challengeId);
    points += SCORING.CHALLENGE_COMPLETE;
  }

  // Recalculate total challenge points from all challenges
  let totalChallengePoints = 0;
  Object.values(gameState.challengeScores).forEach(cs => {
    totalChallengePoints += cs.score;
  });
  gameState.pointsBreakdown.challenges = totalChallengePoints;

  saveState();
  return points;
}

// ---- Week Management ----

function advanceWeek() {
  if (!gameState) return;
  if (gameState.currentWeek >= SEASON.totalWeeks) return;

  gameState.currentWeek++;
  recalculateDraftPoints();
  recalculatePredictionPoints();
  saveState();

  return gameState.currentWeek;
}

function getEliminatedThisWeek(week) {
  const elims = ELIMINATION_ORDER.filter(e => e.week === week);
  return elims.map(e => SEASON.contestants.find(c => c.id === e.eliminated)).filter(Boolean);
}

function getRemainingContestants(upToWeek) {
  const w = upToWeek || gameState.currentWeek;
  const eliminatedIds = ELIMINATION_ORDER
    .filter(e => e.week < w)
    .map(e => e.eliminated);
  return SEASON.contestants.filter(c => !eliminatedIds.includes(c.id));
}

function getContestantStatus(contestantId) {
  const c = SEASON.contestants.find(x => x.id === contestantId);
  if (!c) return 'unknown';
  if (c.isWinner) return 'winner';
  if (c.eliminated && c.eliminated < gameState.currentWeek) return 'eliminated';
  return 'alive';
}

// ---- Leaderboard ----

function getLeaderboard() {
  if (!gameState) return [];

  const playerEntry = {
    name: gameState.playerName + ' (You)',
    score: gameState.totalScore,
    draft: gameState.pointsBreakdown.draft,
    predictions: gameState.pointsBreakdown.predictions,
    challenges: gameState.pointsBreakdown.challenges,
    isBot: false,
    isMe: true,
  };

  const allPlayers = [playerEntry, ...gameState.leaderboard];
  allPlayers.sort((a, b) => b.score - a.score);
  return allPlayers;
}

function getPlayerRank() {
  const lb = getLeaderboard();
  const idx = lb.findIndex(p => p.isMe);
  return idx + 1;
}

// ---- Prediction State ----

function lockVotes(week, bootPick, winnerPick) {
  if (!gameState) return false;

  const key = `week-${week}`;
  gameState.weeklyPredictions[key] = {
    bootPick,
    winnerPick,
    locked: true,
    lockedAt: Date.now(),
  };

  saveState();
  return true;
}

function getVoteForWeek(week) {
  if (!gameState) return null;
  return gameState.weeklyPredictions[`week-${week}`] || null;
}

function checkLastWeekPredictions() {
  const lastWeek = gameState.currentWeek - 1;
  if (lastWeek < 1) return null;

  const pred = getVoteForWeek(lastWeek);
  if (!pred) return null;

  const actualElim = ELIMINATION_ORDER.find(e => e.week === lastWeek);
  if (!actualElim) return null;

  const bootCorrect = pred.bootPick === actualElim.eliminated;
  const winner = SEASON.contestants.find(c => c.isWinner);
  const winnerCorrect = winner && pred.winnerPick === winner.id;

  return { bootCorrect, winnerCorrect, actualElimId: actualElim.eliminated };
}

// ---- UI Navigation ----

const views = ['landing', 'draft', 'dashboard', 'vote', 'challenges', 'standings'];

function showView(viewName) {
  // Hide all views
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.remove('active');
  });

  // Show target
  const target = document.getElementById(`view-${viewName}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update nav active state
  document.querySelectorAll('.nav-links [data-view]').forEach(link => {
    link.classList.toggle('active', link.dataset.view === viewName);
  });

  // Show/hide navbar
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.style.display = viewName === 'landing' ? 'none' : 'flex';
  }
}

// ---- Toast Notifications ----

function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '🔥'}</span> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---- Modal ----

function showModal(icon, title, message, ptsEarned, onClose) {
  const overlay = document.getElementById('result-overlay');
  if (!overlay) return;

  overlay.querySelector('.modal-icon').textContent = icon;
  overlay.querySelector('.modal-title').textContent = title;
  overlay.querySelector('.modal-message').textContent = message;

  const ptsEl = overlay.querySelector('.points-flash');
  if (ptsEarned !== null && ptsEarned !== undefined) {
    ptsEl.textContent = `+${ptsEarned} pts`;
    ptsEl.style.display = 'block';
  } else {
    ptsEl.style.display = 'none';
  }

  overlay.classList.add('show');

  const closeBtn = overlay.querySelector('.modal-close');
  closeBtn.onclick = () => {
    overlay.classList.remove('show');
    if (onClose) onClose();
  };
}

// ---- Score Display Update ----

function updateScoreDisplay() {
  if (!gameState) return;

  const total = gameState.totalScore;
  const els = document.querySelectorAll('.score-badge');
  els.forEach(el => el.textContent = `⚡ ${total} pts`);

  // Update breakdown displays
  const draftEl = document.getElementById('score-draft');
  const predEl = document.getElementById('score-pred');
  const chalEl = document.getElementById('score-chal');
  const totalEl = document.getElementById('score-total');
  const rankEl = document.getElementById('player-rank');

  if (draftEl) draftEl.textContent = gameState.pointsBreakdown.draft;
  if (predEl) predEl.textContent = gameState.pointsBreakdown.predictions;
  if (chalEl) chalEl.textContent = gameState.pointsBreakdown.challenges;
  if (totalEl) totalEl.textContent = total;
  if (rankEl) rankEl.textContent = `#${getPlayerRank()}`;
}

// ---- App Initialization ----

function initApp() {
  const hasState = loadState();

  if (hasState && gameState && gameState.playerName) {
    // Returning player: skip landing, go to dashboard
    showView('dashboard');
    renderDashboard();
    updateScoreDisplay();
  } else {
    // New player: show landing
    showView('landing');
  }
}

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  initApp();

  // Landing form submit
  const landingForm = document.getElementById('landing-form');
  if (landingForm) {
    landingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('player-name-input');
      const name = nameInput.value.trim();
      if (!name) {
        nameInput.style.borderColor = 'var(--danger)';
        return;
      }
      initNewGame(name);
      showView('draft');
      renderDraftBoard();
      updateScoreDisplay();
      showToast(`Welcome to Survivor Fantasy, ${name}!`, 'success');
    });
  }

  // Nav links
  document.querySelectorAll('.nav-links [data-view]').forEach(link => {
    link.addEventListener('click', () => {
      const view = link.dataset.view;
      showView(view);
      if (view === 'dashboard') renderDashboard();
      if (view === 'vote') renderVoteScreen();
      if (view === 'challenges') renderChallengeHub();
      if (view === 'standings') renderStandings();
      updateScoreDisplay();
    });
  });

  // Dashboard quick action buttons
  document.getElementById('btn-goto-draft')?.addEventListener('click', () => {
    showView('draft');
    renderDraftBoard();
  });

  document.getElementById('btn-goto-vote')?.addEventListener('click', () => {
    showView('vote');
    renderVoteScreen();
  });

  document.getElementById('btn-goto-challenges')?.addEventListener('click', () => {
    showView('challenges');
    renderChallengeHub();
  });

  document.getElementById('btn-goto-standings')?.addEventListener('click', () => {
    showView('standings');
    renderStandings();
  });

  // Week advance button
  document.getElementById('btn-advance-week')?.addEventListener('click', () => {
    if (!gameState) return;
    if (gameState.currentWeek >= SEASON.totalWeeks) {
      showToast('The season has ended!', 'warning');
      return;
    }
    const newWeek = advanceWeek();
    renderDashboard();
    updateScoreDisplay();
    showToast(`Advanced to Week ${newWeek}! Scores updated.`, 'success');
  });

  // Reset game
  document.getElementById('btn-reset-game')?.addEventListener('click', () => {
    if (confirm('Reset your game? All progress will be lost.')) {
      clearGame();
      showView('landing');
    }
  });
});

// ---- Dashboard Render ----

function renderDashboard() {
  if (!gameState) return;

  recalculateDraftPoints();
  recalculatePredictionPoints();
  updateScoreDisplay();

  // Week info
  const weekEl = document.getElementById('current-week');
  if (weekEl) weekEl.textContent = gameState.currentWeek;

  const playerNameEl = document.getElementById('dashboard-player-name');
  if (playerNameEl) playerNameEl.textContent = gameState.playerName;

  // My Team display
  const teamContainer = document.getElementById('my-team-grid');
  if (teamContainer) {
    if (!gameState.draftedTeam.length) {
      teamContainer.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">
          <span style="font-size:2rem">🔥</span>
          <p style="margin-top:12px">You haven't drafted your team yet!</p>
          <button class="btn-tribal mt-20" onclick="showView('draft'); renderDraftBoard();">Draft Your Team</button>
        </div>`;
    } else {
      teamContainer.innerHTML = gameState.draftedTeam.map(cId => {
        const c = SEASON.contestants.find(x => x.id === cId);
        if (!c) return '';
        const status = getContestantStatus(cId);
        const tribeClass = `tribe-${c.tribe.toLowerCase()}`;
        return `
          <div class="team-member-card ${status}">
            <span class="draft-pts-badge">${getContestantDraftPoints(cId)} pts</span>
            <span class="contestant-emoji">${c.emoji}</span>
            <div class="contestant-name">${c.name}</div>
            <span class="contestant-tribe ${tribeClass}">${c.tribe}</span>
            <div class="contestant-status status-${status}">
              ${status === 'alive' ? '✅ Still in' : status === 'winner' ? '🏆 Winner!' : `❌ Week ${c.eliminated}`}
            </div>
          </div>`;
      }).join('');
    }
  }

  // Last week results
  const lastResults = checkLastWeekPredictions();
  const resultsEl = document.getElementById('last-week-results');
  if (resultsEl && lastResults) {
    const elim = SEASON.contestants.find(c => c.id === lastResults.actualElimId);
    resultsEl.innerHTML = `
      <div class="result-row">
        <span class="result-outcome ${lastResults.bootCorrect ? 'outcome-correct' : 'outcome-wrong'}">
          ${lastResults.bootCorrect ? '✅ Correct' : '❌ Wrong'}
        </span>
        <span>Boot pick — ${elim ? elim.name : '?'} was eliminated</span>
        <span class="pts-earned">${lastResults.bootCorrect ? `+${SCORING.CORRECT_BOOT}` : '0'} pts</span>
      </div>
      <div class="result-row">
        <span class="result-outcome ${lastResults.winnerCorrect ? 'outcome-correct' : 'outcome-wrong'}">
          ${lastResults.winnerCorrect ? '✅ Correct' : '❌ Wrong'}
        </span>
        <span>Winner prediction</span>
        <span class="pts-earned">${lastResults.winnerCorrect ? `+${SCORING.CORRECT_WINNER_PICK}` : '0'} pts</span>
      </div>`;
    resultsEl.closest('.results-card')?.classList.remove('hidden');
  } else if (resultsEl) {
    resultsEl.closest('.results-card')?.classList.add('hidden');
  }
}

function getContestantDraftPoints(contestantId) {
  const c = SEASON.contestants.find(x => x.id === contestantId);
  if (!c || !gameState) return 0;

  const week = gameState.currentWeek;
  const elimWeek = c.eliminated;
  const weeksAlive = elimWeek ? Math.min(elimWeek - 1, week - 1) : week - 1;
  let pts = weeksAlive * SCORING.TEAM_MEMBER_ALIVE;

  const immunityWins = ELIMINATION_ORDER.filter(e => e.immunityWinner === contestantId && e.week < week).length;
  pts += immunityWins * SCORING.TEAM_IMMUNITY_WIN;
  if (c.isWinner && week >= 14) pts += SCORING.TEAM_WINS_SEASON;

  return pts;
}
