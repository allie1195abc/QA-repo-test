// Survivor Fantasy Game - Data
// Season 50: In the Hands of the Fans (2026)

const SEASON = {
  name: "Survivor: In the Hands of the Fans",
  number: 50,
  location: "Fiji",
  totalWeeks: 14,
  contestants: [
    // ── CILA TRIBE (orange) ──────────────────────────────────────
    { id: 1,  name: "Joe Hunter",             tribe: "Cila",  age: 46, occupation: "Fire Captain",          emoji: "🚒", eliminated: null, isWinner: false, prevSeasons: "S49"            },
    { id: 2,  name: "Savannah Louie",         tribe: "Cila",  age: 31, occupation: "Marketing Specialist",  emoji: "🌺", eliminated: null, isWinner: false, prevSeasons: "S49 (winner)"   },
    { id: 3,  name: "Christian Hubicki",      tribe: "Cila",  age: 39, occupation: "Robotics Professor",    emoji: "🤖", eliminated: null, isWinner: false, prevSeasons: "S37"            },
    { id: 4,  name: "Cirie Fields",           tribe: "Cila",  age: 55, occupation: "Registered Nurse",      emoji: "💊", eliminated: null, isWinner: false, prevSeasons: "S4/16/20/34"    },
    { id: 5,  name: "Ozzy Lusth",             tribe: "Cila",  age: 43, occupation: "Music Venue Owner",     emoji: "🎸", eliminated: null, isWinner: false, prevSeasons: "S13/16/23/34"   },
    { id: 6,  name: "Emily Flippen",          tribe: "Cila",  age: 30, occupation: "Investment Analyst",    emoji: "📈", eliminated: null, isWinner: false, prevSeasons: "S45"            },
    { id: 7,  name: "Jenna Lewis-Dougherty", tribe: "Cila",  age: 47, occupation: "Realtor",               emoji: "🏠", eliminated: null, isWinner: false, prevSeasons: "S1/8"           },
    { id: 8,  name: "Rick Devens",            tribe: "Cila",  age: 40, occupation: "TV News Anchor",        emoji: "📺", eliminated: null, isWinner: false, prevSeasons: "S38"            },
    // ── KALO TRIBE (blue) ───────────────────────────────────────
    { id: 9,  name: "Jonathan Young",         tribe: "Kalo",  age: 32, occupation: "Beach Service Owner",   emoji: "🏖️", eliminated: null, isWinner: false, prevSeasons: "S42"            },
    { id: 10, name: "Dee Valladares",         tribe: "Kalo",  age: 28, occupation: "Entrepreneur",          emoji: "💼", eliminated: null, isWinner: false, prevSeasons: "S45 (winner)"   },
    { id: 11, name: "Mike White",             tribe: "Kalo",  age: 54, occupation: "Writer/Director",       emoji: "🎬", eliminated: null, isWinner: false, prevSeasons: "S37"            },
    { id: 12, name: "Kamilla Karthigesu",     tribe: "Kalo",  age: 31, occupation: "Software Engineer",     emoji: "💻", eliminated: null, isWinner: false, prevSeasons: "S47"            },
    { id: 13, name: "Charlie Davis",          tribe: "Kalo",  age: 27, occupation: "Attorney",              emoji: "⚖️", eliminated: null, isWinner: false, prevSeasons: "S46"            },
    { id: 14, name: "Tiffany Ervin",          tribe: "Kalo",  age: 34, occupation: "Artist/Creative Prod.", emoji: "🎨", eliminated: null, isWinner: false, prevSeasons: "S41"            },
    { id: 15, name: "Chrissy Hofbeck",        tribe: "Kalo",  age: 54, occupation: "Actuary",               emoji: "🔢", eliminated: null, isWinner: false, prevSeasons: "S35"            },
    { id: 16, name: "Coach Wade",             tribe: "Kalo",  age: 53, occupation: "Soccer Coach/Musician", emoji: "⚽", eliminated: null, isWinner: false, prevSeasons: "S18/20/23"      },
    // ── VATU TRIBE (pink) ───────────────────────────────────────
    { id: 17, name: "Colby Donaldson",        tribe: "Vatu",  age: 51, occupation: "Rancher/Welder",        emoji: "🤠", eliminated: null, isWinner: false, prevSeasons: "S2/20"          },
    { id: 18, name: "Genevieve Mushaluk",     tribe: "Vatu",  age: 34, occupation: "Lawyer",                emoji: "👩‍⚖️", eliminated: null, isWinner: false, prevSeasons: "S47"            },
    { id: 19, name: "Rizo Velovic",           tribe: "Vatu",  age: 26, occupation: "Tech Sales",            emoji: "📱", eliminated: null, isWinner: false, prevSeasons: "S49"            },
    { id: 20, name: "Angelina Keeley",        tribe: "Vatu",  age: 35, occupation: "Entrepreneur",          emoji: "🧠", eliminated: null, isWinner: false, prevSeasons: "S37"            },
    { id: 21, name: "Q Burdette",             tribe: "Vatu",  age: 31, occupation: "Real Estate Broker",    emoji: "🏡", eliminated: null, isWinner: false, prevSeasons: "S46"            },
    { id: 22, name: "Stephenie LaGrossa",     tribe: "Vatu",  age: 45, occupation: "Pharmaceutical Sales",  emoji: "💪", eliminated: null, isWinner: false, prevSeasons: "S10/20"         },
    { id: 23, name: "Aubry Bracco",           tribe: "Vatu",  age: 39, occupation: "Marketing Director",    emoji: "🌟", eliminated: null, isWinner: false, prevSeasons: "S32/34"         },
    { id: 24, name: "Kyle Fraser",            tribe: "Vatu",  age: 31, occupation: "Landscaper",            emoji: "🌿", eliminated: null, isWinner: false, prevSeasons: "S48 (winner)"   },
  ]
};

// Week-by-week elimination results
// Season 50 premiered Feb 25, 2026 — update as episodes air!
// Format: { week, eliminated: contestantId, immunityWinner: contestantId, note }
const ELIMINATION_ORDER = [
  // Add results here as episodes air, e.g.:
  // { week: 1, eliminated: 16, immunityWinner: 5, note: "First boot of S50" },
];

// Trivia Questions (Survivor history)
const TRIVIA_QUESTIONS = [
  {
    question: "Who was the first-ever Survivor winner?",
    options: ["Richard Hatch", "Rudy Boesch", "Susan Hawk", "Kelly Wiglesworth"],
    correct: 0,
    difficulty: "easy"
  },
  {
    question: "What is the iconic phrase said when someone is eliminated at tribal council?",
    options: ["Game over", "The tribe has spoken", "You're out", "Vote is final"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "Which season is considered by fans as 'The Greatest Season Ever'?",
    options: ["Borneo", "Panama", "Micronesia", "Cagayan"],
    correct: 2,
    difficulty: "medium"
  },
  {
    question: "What is a 'Hidden Immunity Idol' used for?",
    options: ["Win an extra vote", "Nullify votes against you", "Send someone to Exile Island", "Win a reward challenge"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "Who holds the record for most days played on Survivor?",
    options: ["Boston Rob", "Sandra Diaz-Twine", "Ozzy Lusth", "Tai Trang"],
    correct: 2,
    difficulty: "hard"
  },
  {
    question: "What does 'FTC' stand for in Survivor?",
    options: ["Final Tribal Camp", "Final Tribal Council", "First Tribal Challenge", "Final Tally Count"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "Which player won Survivor twice?",
    options: ["Boston Rob", "Tony Vlachos", "Sandra Diaz-Twine", "Kim Spradlin"],
    correct: 2,
    difficulty: "medium"
  },
  {
    question: "What is the name of the twist where two tribes become one?",
    options: ["Merge", "Swap", "Unify", "Consolidation"],
    correct: 0,
    difficulty: "easy"
  },
  {
    question: "In which season did Boston Rob finally win?",
    options: ["Amazon", "All Stars", "Redemption Island", "Heroes vs Villains"],
    correct: 2,
    difficulty: "medium"
  },
  {
    question: "What is 'Ponderosa'?",
    options: ["A challenge location", "Where jury members stay", "A type of idol", "The host's booth"],
    correct: 1,
    difficulty: "medium"
  },
  {
    question: "Who hosts Survivor?",
    options: ["Ryan Seacrest", "Jeff Probst", "Phil Keoghan", "Tom Bergeron"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "What is a 'Fire Token' introduced in Season 40?",
    options: ["A currency to buy advantages", "A special idol", "A reward challenge prize", "A vote steal"],
    correct: 0,
    difficulty: "medium"
  },
  {
    question: "Which Survivor season featured 'Winners at War'?",
    options: ["Season 38", "Season 39", "Season 40", "Season 41"],
    correct: 2,
    difficulty: "medium"
  },
  {
    question: "What is a 'Purple Rock' draw in Survivor?",
    options: ["A random elimination tiebreaker", "A type of idol", "A challenge obstacle", "A reward twist"],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "What does 'Exile Island' allow players to do?",
    options: ["Vote twice", "Search for a hidden idol", "Skip tribal council", "Earn extra food"],
    correct: 1,
    difficulty: "medium"
  },
  {
    question: "What is the theme/subtitle of Survivor Season 50?",
    options: ["Winners at War", "In the Hands of the Fans", "Island of the Idols", "Edge of Extinction"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "How many contestants started Season 50?",
    options: ["18", "20", "22", "24"],
    correct: 3,
    difficulty: "medium"
  },
  {
    question: "What does winning immunity guarantee?",
    options: ["A reward", "Safety from tribal council", "An extra vote", "An idol clue"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "What is the 'Edge of Extinction'?",
    options: ["A challenge island", "Where eliminated players wait for a chance to return", "A final immunity challenge", "An idol type"],
    correct: 1,
    difficulty: "medium"
  },
  {
    question: "How many players are typically on the jury that votes for the winner?",
    options: ["5", "7", "9", "Varies by season"],
    correct: 3,
    difficulty: "hard"
  }
];

// Memory Match pairs — S50 cast members matched to their first winning/notable season
const MEMORY_PAIRS = [
  { id: "a", type: "player", content: "Cirie Fields",        match: "A" },
  { id: "b", type: "season", content: "Panama (S11)",        match: "A" },
  { id: "c", type: "player", content: "Ozzy Lusth",          match: "B" },
  { id: "d", type: "season", content: "Cook Islands (S13)",  match: "B" },
  { id: "e", type: "player", content: "Colby Donaldson",     match: "C" },
  { id: "f", type: "season", content: "Australia (S2)",      match: "C" },
  { id: "g", type: "player", content: "Mike White",          match: "D" },
  { id: "h", type: "season", content: "David v Goliath (S37)",match: "D"},
  { id: "i", type: "player", content: "Dee Valladares",      match: "E" },
  { id: "j", type: "season", content: "S45 Winner 🏆",       match: "E" },
  { id: "k", type: "player", content: "Coach Wade",          match: "F" },
  { id: "l", type: "season", content: "Tocantins (S18)",     match: "F" },
];

// Puzzle words (scrambled Survivor tribal/location words)
const PUZZLE_WORDS = [
  { scrambled: "ABCILTR",    answer: "TRIBAL",    hint: "Where the vote happens" },
  { scrambled: "LCIUCNOD",   answer: "COUNCIL",   hint: "Tribal _____" },
  { scrambled: "UITYNMIM",   answer: "IMMUNITY",  hint: "Win this to stay safe" },
  { scrambled: "LLINAACE",   answer: "ALLIANCE",  hint: "Working together" },
  { scrambled: "SIDNIDLE",   answer: "BLINDSIDE", hint: "When no one saw it coming" },
  { scrambled: "IJULBEEJP",  answer: "JEFF",      hint: "The host's first name" },
  { scrambled: "STOBRAHT",   answer: "OUTWIT",    hint: "Outwit, ___, Outlast" },
  { scrambled: "EVUSIRVRO",  answer: "SURVIVOR",  hint: "Name of the show" },
  { scrambled: "DOLI",       answer: "IDOL",      hint: "Hidden ___" },
  { scrambled: "YRJU",       answer: "JURY",      hint: "They vote for the winner" },
];

// Scoring constants
const SCORING = {
  CORRECT_BOOT:        15,
  CORRECT_WINNER_PICK:  5,
  CHALLENGE_WIN:       10,
  CHALLENGE_COMPLETE:   3,
  TEAM_MEMBER_ALIVE:    2,
  TEAM_IMMUNITY_WIN:    5,
  TEAM_WINS_SEASON:    50,
};
