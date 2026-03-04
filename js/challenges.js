// ===================================================
// SURVIVOR FANTASY GAME - Mini Challenges
// ===================================================

// Challenge definitions
const CHALLENGES = [
  {
    id: 'trivia-easy',
    title: 'Survivor Trivia',
    subtitle: 'Island Basics',
    icon: '🧠',
    type: 'trivia',
    difficulty: 'easy',
    maxPts: 50,
    timeLimit: 20,  // seconds per question
    questionCount: 5,
    description: 'Test your Survivor knowledge! 5 questions about the show\'s history and rules.',
    filter: q => q.difficulty === 'easy',
  },
  {
    id: 'trivia-hard',
    title: 'Expert Trivia',
    subtitle: 'Superfan Challenge',
    icon: '🔥',
    type: 'trivia',
    difficulty: 'hard',
    maxPts: 100,
    timeLimit: 15,
    questionCount: 10,
    description: '10 tough questions for true Survivor superfans. Can you outwit them all?',
    filter: q => ['medium', 'hard'].includes(q.difficulty),
  },
  {
    id: 'memory',
    title: 'Memory Match',
    subtitle: 'Survivor Legends',
    icon: '🃏',
    type: 'memory',
    difficulty: 'medium',
    maxPts: 80,
    timeLimit: 60,  // total seconds
    description: 'Match Survivor legends to their winning seasons. Flip cards to find pairs!',
    filter: null,
  },
  {
    id: 'puzzle',
    title: 'Word Scramble',
    subtitle: 'Tribal Terminology',
    icon: '🔤',
    type: 'puzzle',
    difficulty: 'medium',
    maxPts: 70,
    timeLimit: 30,  // per word
    wordCount: 5,
    description: 'Unscramble Survivor words and tribal terminology. Think fast!',
    filter: null,
  },
];

// Active challenge state
let activeChallenge = null;

// ---- Challenge Hub Render ----

function renderChallengeHub() {
  const grid = document.getElementById('challenge-hub-grid');
  if (!grid || !gameState) return;

  grid.innerHTML = CHALLENGES.map(ch => {
    const completed = gameState.completedChallenges.includes(ch.id);
    const bestScore = gameState.challengeScores[ch.id]?.score || 0;
    return `
      <div class="challenge-card ${completed ? 'completed-once' : ''}" data-challenge="${ch.id}">
        <span class="challenge-icon">${ch.icon}</span>
        <div class="challenge-title">${ch.title}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;">${ch.subtitle}</div>
        <div class="challenge-desc">${ch.description}</div>
        <div class="challenge-meta">
          <span class="difficulty-badge diff-${ch.difficulty}">${ch.difficulty}</span>
          <span class="max-pts">Up to <strong>${ch.maxPts} pts</strong></span>
          ${completed ? `<span class="best-score">Best: <strong>${bestScore} pts</strong></span>` : ''}
        </div>
        ${completed ? '<div style="margin-top:12px;font-size:0.75rem;color:var(--success);">✅ Completed — replay for fun!</div>' : ''}
      </div>`;
  }).join('');

  grid.querySelectorAll('.challenge-card').forEach(card => {
    card.addEventListener('click', () => {
      const chId = card.dataset.challenge;
      startChallenge(chId);
    });
  });
}

// ---- Start Challenge ----

function startChallenge(challengeId) {
  const ch = CHALLENGES.find(c => c.id === challengeId);
  if (!ch) return;

  activeChallenge = {
    ...ch,
    startTime: Date.now(),
    score: 0,
    currentIndex: 0,
    questions: [],
  };

  // Hide hub, show active challenge area
  document.getElementById('challenge-hub-section').classList.add('hidden');
  document.getElementById('challenge-active-section').classList.remove('hidden');

  if (ch.type === 'trivia') startTrivia(ch);
  else if (ch.type === 'memory') startMemory(ch);
  else if (ch.type === 'puzzle') startPuzzle(ch);
}

function exitChallenge() {
  activeChallenge = null;
  document.getElementById('challenge-hub-section').classList.remove('hidden');
  document.getElementById('challenge-active-section').classList.add('hidden');
  renderChallengeHub();
}

// ==========================================
// TRIVIA CHALLENGE
// ==========================================

let triviaState = null;
let triviaTimer = null;

function startTrivia(ch) {
  // Pick questions
  let pool = TRIVIA_QUESTIONS.filter(ch.filter);
  pool = shuffleArray(pool).slice(0, ch.questionCount);

  triviaState = {
    questions: pool,
    currentIdx: 0,
    score: 0,
    correct: 0,
    timeLeft: ch.timeLimit,
    answered: false,
  };

  renderTriviaQuestion();
}

function renderTriviaQuestion() {
  const container = document.getElementById('challenge-active-section');
  const ch = activeChallenge;
  const q = triviaState.questions[triviaState.currentIdx];
  const qNum = triviaState.currentIdx + 1;
  const total = triviaState.questions.length;

  container.innerHTML = `
    <div class="challenge-active">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <button class="btn-secondary" id="btn-exit-challenge">← Exit</button>
        <div style="font-family:var(--font-display);font-size:1rem;color:var(--fire-yellow);">${ch.icon} ${ch.title}</div>
        <div style="font-size:0.9rem;color:var(--text-muted);">${triviaState.score} pts</div>
      </div>

      <div class="challenge-progress">
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${((qNum-1)/total)*100}%"></div>
        </div>
        <div class="timer-display" id="trivia-timer">${triviaState.timeLeft}</div>
      </div>

      <div class="question-card">
        <div class="question-num">Question ${qNum} of ${total}</div>
        <div class="question-text">${q.question}</div>
      </div>

      <div class="answer-grid">
        ${q.options.map((opt, i) => `
          <button class="answer-btn" data-idx="${i}">${opt}</button>
        `).join('')}
      </div>
    </div>`;

  // Exit button
  container.querySelector('#btn-exit-challenge').addEventListener('click', exitChallenge);

  // Answer buttons
  container.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (triviaState.answered) return;
      const chosen = parseInt(btn.dataset.idx);
      handleTriviaAnswer(chosen);
    });
  });

  startTriviaTimer();
}

function startTriviaTimer() {
  clearInterval(triviaTimer);
  triviaState.timeLeft = activeChallenge.timeLimit;
  triviaState.answered = false;

  triviaTimer = setInterval(() => {
    triviaState.timeLeft--;
    const timerEl = document.getElementById('trivia-timer');
    if (timerEl) {
      timerEl.textContent = triviaState.timeLeft;
      timerEl.classList.toggle('urgent', triviaState.timeLeft <= 5);
    }

    if (triviaState.timeLeft <= 0) {
      clearInterval(triviaTimer);
      if (!triviaState.answered) {
        // Auto-wrong on timeout
        handleTriviaAnswer(-1);
      }
    }
  }, 1000);
}

function handleTriviaAnswer(chosenIdx) {
  if (triviaState.answered) return;
  triviaState.answered = true;
  clearInterval(triviaTimer);

  const q = triviaState.questions[triviaState.currentIdx];
  const correct = chosenIdx === q.correct;
  const timeBonus = Math.floor((triviaState.timeLeft / activeChallenge.timeLimit) * 5);
  const pointsForQ = correct ? (10 + timeBonus) : 0;

  triviaState.score += pointsForQ;
  if (correct) triviaState.correct++;

  // Update UI
  const btns = document.querySelectorAll('.answer-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === chosenIdx) btn.classList.add('wrong');
  });

  // Show feedback briefly then next
  setTimeout(() => {
    triviaState.currentIdx++;
    if (triviaState.currentIdx < triviaState.questions.length) {
      renderTriviaQuestion();
    } else {
      endTrivia();
    }
  }, 1200);
}

function endTrivia() {
  clearInterval(triviaTimer);
  const ch = activeChallenge;
  const score = Math.min(triviaState.score, ch.maxPts);
  const firstTime = !gameState.completedChallenges.includes(ch.id);

  awardChallengePoints(ch.id, score, firstTime);
  updateScoreDisplay();

  const container = document.getElementById('challenge-active-section');
  const pct = Math.round((triviaState.correct / triviaState.questions.length) * 100);

  container.innerHTML = `
    <div class="challenge-active" style="text-align:center;padding:40px 20px;">
      <div style="font-size:4rem;margin-bottom:20px;">${pct >= 70 ? '🏆' : pct >= 40 ? '⚡' : '🔥'}</div>
      <h2 style="font-family:var(--font-display);color:var(--fire-yellow);font-size:1.8rem;margin-bottom:8px;">
        ${pct >= 70 ? 'Immunity Earned!' : pct >= 40 ? 'Solid Effort!' : 'Keep Practicing!'}
      </h2>
      <p style="color:var(--text-muted);margin-bottom:24px;">
        ${triviaState.correct} / ${triviaState.questions.length} correct (${pct}%)
      </p>
      <div class="points-flash">+${score} pts</div>
      ${firstTime ? `<div style="color:var(--success);font-size:0.85rem;margin:8px 0;">+${SCORING.CHALLENGE_COMPLETE} bonus pts for first completion!</div>` : ''}
      <div style="display:flex;gap:12px;justify-content:center;margin-top:30px;">
        <button class="btn-tribal" id="btn-retry-trivia">🔄 Try Again</button>
        <button class="btn-primary" id="btn-back-hub" style="width:auto;padding:12px 24px;">Back to Challenges</button>
      </div>
    </div>`;

  document.getElementById('btn-retry-trivia').addEventListener('click', () => {
    startTrivia(ch);
  });
  document.getElementById('btn-back-hub').addEventListener('click', exitChallenge);

  showToast(`Trivia complete! +${score} points earned!`, 'success');
}

// ==========================================
// MEMORY MATCH CHALLENGE
// ==========================================

let memoryState = null;
let memoryTimer = null;

function startMemory(ch) {
  const pairs = shuffleArray([...MEMORY_PAIRS]);
  const cards = shuffleArray([...pairs]);

  memoryState = {
    cards: cards.map(c => ({ ...c, flipped: false, matched: false })),
    flipped: [],       // indices of currently face-up unmatched cards
    matched: 0,
    moves: 0,
    score: 0,
    timeLeft: ch.timeLimit,
    locked: false,
  };

  renderMemoryGame(ch);
  startMemoryTimer(ch);
}

function renderMemoryGame(ch) {
  const container = document.getElementById('challenge-active-section');
  const totalPairs = MEMORY_PAIRS.length / 2;

  container.innerHTML = `
    <div class="challenge-active">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <button class="btn-secondary" id="btn-exit-challenge">← Exit</button>
        <div style="font-family:var(--font-display);font-size:1rem;color:var(--fire-yellow);">${ch.icon} ${ch.title}</div>
        <div class="timer-display" id="memory-timer">${memoryState.timeLeft}s</div>
      </div>

      <div style="text-align:center;margin-bottom:16px;color:var(--text-muted);font-size:0.85rem;">
        Pairs: <strong style="color:var(--fire-yellow);">${memoryState.matched / 2} / ${totalPairs}</strong>
        &nbsp;|&nbsp; Moves: <strong>${memoryState.moves}</strong>
      </div>

      <div class="memory-grid" id="memory-grid" style="grid-template-columns:repeat(4,1fr);">
        ${memoryState.cards.map((card, i) => `
          <div class="memory-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}"
               data-index="${i}">
            <div class="memory-card-inner">
              <div class="memory-card-back">🔥</div>
              <div class="memory-card-front">
                <span>${card.content}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;

  container.querySelector('#btn-exit-challenge').addEventListener('click', () => {
    clearInterval(memoryTimer);
    exitChallenge();
  });

  container.querySelectorAll('.memory-card').forEach(card => {
    card.addEventListener('click', () => {
      if (memoryState.locked) return;
      const idx = parseInt(card.dataset.index);
      flipMemoryCard(idx, ch);
    });
  });
}

function startMemoryTimer(ch) {
  clearInterval(memoryTimer);
  memoryTimer = setInterval(() => {
    memoryState.timeLeft--;
    const timerEl = document.getElementById('memory-timer');
    if (timerEl) {
      timerEl.textContent = `${memoryState.timeLeft}s`;
      timerEl.classList.toggle('urgent', memoryState.timeLeft <= 10);
    }
    if (memoryState.timeLeft <= 0) {
      clearInterval(memoryTimer);
      endMemory(ch);
    }
  }, 1000);
}

function flipMemoryCard(idx, ch) {
  const card = memoryState.cards[idx];
  if (card.flipped || card.matched) return;
  if (memoryState.flipped.length >= 2) return;

  card.flipped = true;
  memoryState.flipped.push(idx);

  // Re-render card
  const cardEl = document.querySelector(`.memory-card[data-index="${idx}"]`);
  if (cardEl) cardEl.classList.add('flipped');

  if (memoryState.flipped.length === 2) {
    memoryState.moves++;
    memoryState.locked = true;

    const [i1, i2] = memoryState.flipped;
    const c1 = memoryState.cards[i1];
    const c2 = memoryState.cards[i2];

    if (c1.match === c2.match) {
      // Match!
      setTimeout(() => {
        c1.matched = true;
        c2.matched = true;
        memoryState.flipped = [];
        memoryState.matched += 2;
        memoryState.locked = false;

        document.querySelector(`.memory-card[data-index="${i1}"]`)?.classList.add('matched');
        document.querySelector(`.memory-card[data-index="${i2}"]`)?.classList.add('matched');

        // Update pair count
        const totalPairs = MEMORY_PAIRS.length / 2;
        const pairCount = document.querySelector('.memory-grid + div, .challenge-active div');

        if (memoryState.matched === memoryState.cards.length) {
          clearInterval(memoryTimer);
          endMemory(ch);
        } else {
          renderMemoryGame(ch);
          startMemoryTimer(ch);
          // Restore timer value
          memoryTimer; // already started fresh
        }
      }, 500);
    } else {
      // No match — flip back
      setTimeout(() => {
        c1.flipped = false;
        c2.flipped = false;
        memoryState.flipped = [];
        memoryState.locked = false;

        document.querySelector(`.memory-card[data-index="${i1}"]`)?.classList.remove('flipped');
        document.querySelector(`.memory-card[data-index="${i2}"]`)?.classList.remove('flipped');
      }, 900);
    }
  }
}

function endMemory(ch) {
  clearInterval(memoryTimer);
  const totalPairs = MEMORY_PAIRS.length / 2;
  const matchedPairs = memoryState.matched / 2;
  const accuracy = matchedPairs / totalPairs;
  const timeBonus = Math.floor((memoryState.timeLeft / ch.timeLimit) * 20);
  const score = Math.min(Math.floor(accuracy * ch.maxPts) + timeBonus, ch.maxPts);
  const firstTime = !gameState.completedChallenges.includes(ch.id);

  awardChallengePoints(ch.id, score, firstTime);
  updateScoreDisplay();

  const container = document.getElementById('challenge-active-section');
  container.innerHTML = `
    <div class="challenge-active" style="text-align:center;padding:40px 20px;">
      <div style="font-size:4rem;margin-bottom:20px;">${accuracy === 1 ? '🧠' : accuracy >= 0.5 ? '🃏' : '🔥'}</div>
      <h2 style="font-family:var(--font-display);color:var(--fire-yellow);font-size:1.8rem;margin-bottom:8px;">
        ${accuracy === 1 ? 'Perfect Memory!' : 'Challenge Complete!'}
      </h2>
      <p style="color:var(--text-muted);margin-bottom:8px;">
        Matched ${matchedPairs} of ${totalPairs} pairs in ${memoryState.moves} moves
      </p>
      <div class="points-flash">+${score} pts</div>
      ${firstTime ? `<div style="color:var(--success);font-size:0.85rem;margin:8px 0;">+${SCORING.CHALLENGE_COMPLETE} bonus pts for first completion!</div>` : ''}
      <div style="display:flex;gap:12px;justify-content:center;margin-top:30px;">
        <button class="btn-tribal" id="btn-retry-memory">🔄 Play Again</button>
        <button class="btn-primary" id="btn-back-hub" style="width:auto;padding:12px 24px;">Back to Challenges</button>
      </div>
    </div>`;

  document.getElementById('btn-retry-memory').addEventListener('click', () => startMemory(ch));
  document.getElementById('btn-back-hub').addEventListener('click', exitChallenge);

  showToast(`Memory challenge done! +${score} pts!`, 'success');
}

// ==========================================
// WORD SCRAMBLE PUZZLE
// ==========================================

let puzzleState = null;
let puzzleTimer = null;

function startPuzzle(ch) {
  const words = shuffleArray([...PUZZLE_WORDS]).slice(0, ch.wordCount);

  puzzleState = {
    words,
    currentIdx: 0,
    score: 0,
    correct: 0,
    hintsUsed: 0,
    timeLeft: ch.timeLimit,
  };

  renderPuzzleWord(ch);
}

function renderPuzzleWord(ch) {
  clearInterval(puzzleTimer);
  const container = document.getElementById('challenge-active-section');
  const word = puzzleState.words[puzzleState.currentIdx];
  const wordNum = puzzleState.currentIdx + 1;
  const total = puzzleState.words.length;

  container.innerHTML = `
    <div class="challenge-active">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <button class="btn-secondary" id="btn-exit-challenge">← Exit</button>
        <div style="font-family:var(--font-display);font-size:1rem;color:var(--fire-yellow);">${ch.icon} ${ch.title}</div>
        <div style="font-size:0.9rem;color:var(--text-muted);">${wordNum}/${total}</div>
      </div>

      <div class="challenge-progress">
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${((wordNum-1)/total)*100}%"></div>
        </div>
        <div class="timer-display" id="puzzle-timer">${puzzleState.timeLeft}</div>
      </div>

      <div class="puzzle-container">
        <div style="text-align:center;color:var(--text-muted);font-size:0.85rem;margin-bottom:10px;">
          Unscramble this Survivor word:
        </div>
        <div class="scrambled-word">${word.scrambled}</div>
        <div class="word-hint">"${word.hint}"</div>

        <div class="puzzle-input-row">
          <input type="text" class="puzzle-input" id="puzzle-input"
                 placeholder="TYPE YOUR ANSWER"
                 maxlength="12"
                 autocomplete="off"
                 autocorrect="off"
                 autocapitalize="characters"
                 spellcheck="false">
          <button class="btn-tribal" id="btn-submit-puzzle" style="white-space:nowrap;">Submit</button>
        </div>

        <div class="puzzle-hints-used">Hints used: ${puzzleState.hintsUsed} (−5 pts each)</div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button class="btn-secondary" id="btn-hint-puzzle">💡 Hint (−5 pts)</button>
          <button class="btn-secondary" id="btn-skip-puzzle">⏭ Skip</button>
        </div>
      </div>

      <div style="text-align:center;margin-top:20px;font-size:0.85rem;color:var(--text-muted);">
        Score so far: <strong style="color:var(--fire-yellow);">${puzzleState.score} pts</strong>
      </div>
    </div>`;

  const input = document.getElementById('puzzle-input');

  container.querySelector('#btn-exit-challenge').addEventListener('click', () => {
    clearInterval(puzzleTimer);
    exitChallenge();
  });

  document.getElementById('btn-submit-puzzle').addEventListener('click', () => {
    submitPuzzleAnswer(ch, input.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitPuzzleAnswer(ch, input.value);
  });

  document.getElementById('btn-hint-puzzle').addEventListener('click', () => {
    puzzleState.hintsUsed++;
    const hintLen = Math.ceil(word.answer.length / 2);
    input.value = word.answer.slice(0, hintLen);
    input.focus();
    const hintEl = document.querySelector('.puzzle-hints-used');
    if (hintEl) hintEl.textContent = `Hints used: ${puzzleState.hintsUsed} (−5 pts each)`;
  });

  document.getElementById('btn-skip-puzzle').addEventListener('click', () => {
    clearInterval(puzzleTimer);
    nextPuzzleWord(ch, 0);
  });

  input.focus();

  // Start timer
  puzzleState.timeLeft = ch.timeLimit;
  puzzleTimer = setInterval(() => {
    puzzleState.timeLeft--;
    const timerEl = document.getElementById('puzzle-timer');
    if (timerEl) {
      timerEl.textContent = puzzleState.timeLeft;
      timerEl.classList.toggle('urgent', puzzleState.timeLeft <= 5);
    }
    if (puzzleState.timeLeft <= 0) {
      clearInterval(puzzleTimer);
      nextPuzzleWord(ch, 0);
    }
  }, 1000);
}

function submitPuzzleAnswer(ch, value) {
  clearInterval(puzzleTimer);
  const word = puzzleState.words[puzzleState.currentIdx];
  const userAnswer = value.trim().toUpperCase();
  const correct = userAnswer === word.answer;

  const input = document.getElementById('puzzle-input');
  if (input) {
    input.classList.add(correct ? 'correct' : 'wrong');
    input.disabled = true;
  }

  if (correct) {
    const timeBonus = Math.floor((puzzleState.timeLeft / ch.timeLimit) * 10);
    const hintPenalty = puzzleState.hintsUsed * 5;
    const pts = Math.max(0, 15 + timeBonus - hintPenalty);
    puzzleState.correct++;
    puzzleState.score += pts;
    showToast(`✅ Correct! +${pts} pts`, 'success', 1500);
  } else {
    showToast(`❌ The answer was "${word.answer}"`, 'info', 1500);
  }

  setTimeout(() => nextPuzzleWord(ch, correct ? 1 : 0), 1500);
}

function nextPuzzleWord(ch, wasCorrect) {
  clearInterval(puzzleTimer);
  puzzleState.currentIdx++;
  puzzleState.hintsUsed = 0;

  if (puzzleState.currentIdx < puzzleState.words.length) {
    renderPuzzleWord(ch);
  } else {
    endPuzzle(ch);
  }
}

function endPuzzle(ch) {
  clearInterval(puzzleTimer);
  const score = Math.min(puzzleState.score, ch.maxPts);
  const firstTime = !gameState.completedChallenges.includes(ch.id);

  awardChallengePoints(ch.id, score, firstTime);
  updateScoreDisplay();

  const container = document.getElementById('challenge-active-section');
  const pct = Math.round((puzzleState.correct / puzzleState.words.length) * 100);

  container.innerHTML = `
    <div class="challenge-active" style="text-align:center;padding:40px 20px;">
      <div style="font-size:4rem;margin-bottom:20px;">${pct >= 80 ? '🔤' : '🔥'}</div>
      <h2 style="font-family:var(--font-display);color:var(--fire-yellow);font-size:1.8rem;margin-bottom:8px;">
        Puzzle Complete!
      </h2>
      <p style="color:var(--text-muted);margin-bottom:8px;">
        ${puzzleState.correct} / ${puzzleState.words.length} correct (${pct}%)
      </p>
      <div class="points-flash">+${score} pts</div>
      ${firstTime ? `<div style="color:var(--success);font-size:0.85rem;margin:8px 0;">+${SCORING.CHALLENGE_COMPLETE} bonus for first completion!</div>` : ''}
      <div style="display:flex;gap:12px;justify-content:center;margin-top:30px;">
        <button class="btn-tribal" id="btn-retry-puzzle">🔄 Play Again</button>
        <button class="btn-primary" id="btn-back-hub" style="width:auto;padding:12px 24px;">Back to Challenges</button>
      </div>
    </div>`;

  document.getElementById('btn-retry-puzzle').addEventListener('click', () => startPuzzle(ch));
  document.getElementById('btn-back-hub').addEventListener('click', exitChallenge);

  showToast(`Puzzle done! +${score} pts!`, 'success');
}

// ---- Utility ----
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
