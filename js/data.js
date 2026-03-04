// Survivor Fantasy Game - Data
// Season 39: Island of the Idols

const SEASON = {
  name: "Survivor: Island of the Idols",
  number: 39,
  location: "Fiji",
  totalWeeks: 14,
  contestants: [
    { id: 1,  name: "Tommy Sheehan",    tribe: "Lairo",   age: 26, occupation: "4th Grade Teacher",   emoji: "🏆", eliminated: null,  isWinner: true  },
    { id: 2,  name: "Dean Kowalski",    tribe: "Lairo",   age: 28, occupation: "Tech Sales",           emoji: "🎯", eliminated: 14,   isWinner: false },
    { id: 3,  name: "Janet Carbin",     tribe: "Vokai",   age: 59, occupation: "Chief Lifeguard",      emoji: "🌊", eliminated: 13,   isWinner: false },
    { id: 4,  name: "Noura Salman",     tribe: "Vokai",   age: 36, occupation: "Entrepreneur",         emoji: "🔥", eliminated: 12,   isWinner: false },
    { id: 5,  name: "Lauren Beck",      tribe: "Vokai",   age: 28, occupation: "Nanny",                emoji: "💎", eliminated: 11,   isWinner: false },
    { id: 6,  name: "Dan Spilo",        tribe: "Vokai",   age: 48, occupation: "Talent Manager",       emoji: "🎭", eliminated: 11,   isWinner: false },
    { id: 7,  name: "Karishma Patel",   tribe: "Lairo",   age: 37, occupation: "Personal Injury Att.", emoji: "⚖️", eliminated: 10,   isWinner: false },
    { id: 8,  name: "Elaine Stott",     tribe: "Lairo",   age: 41, occupation: "Factory Worker",       emoji: "🦁", eliminated: 9,    isWinner: false },
    { id: 9,  name: "Aaron Meredith",   tribe: "Lairo",   age: 36, occupation: "Fitness Trainer",      emoji: "💪", eliminated: 8,    isWinner: false },
    { id: 10, name: "Missy Byrd",       tribe: "Lairo",   age: 24, occupation: "Air Force Vet",        emoji: "✈️", eliminated: 7,    isWinner: false },
    { id: 11, name: "Elizabeth Beisel", tribe: "Lairo",   age: 26, occupation: "Olympic Swimmer",      emoji: "🏊", eliminated: 7,    isWinner: false },
    { id: 12, name: "Kellee Kim",       tribe: "Vokai",   age: 29, occupation: "MBA Student",          emoji: "📚", eliminated: 6,    isWinner: false },
    { id: 13, name: "Jack Nichting",    tribe: "Vokai",   age: 23, occupation: "Grad Student",         emoji: "🎓", eliminated: 5,    isWinner: false },
    { id: 14, name: "Jamal Shipman",    tribe: "Vokai",   age: 33, occupation: "College Director",     emoji: "🌟", eliminated: 5,    isWinner: false },
    { id: 15, name: "Jason Linden",     tribe: "Vokai",   age: 32, occupation: "Jackhammer Operator",  emoji: "🔨", eliminated: 4,    isWinner: false },
    { id: 16, name: "Molly Byman",      tribe: "Vokai",   age: 27, occupation: "Recruiting Manager",   emoji: "💼", eliminated: 3,    isWinner: false },
    { id: 17, name: "Vince Moua",       tribe: "Lairo",   age: 27, occupation: "Admissions Counselor", emoji: "🌸", eliminated: 2,    isWinner: false },
    { id: 18, name: "Ronnie Bardah",    tribe: "Lairo",   age: 35, occupation: "Professional Poker",   emoji: "🃏", eliminated: 1,    isWinner: false },
  ]
};

// Week-by-week elimination results (who was voted off each week)
const ELIMINATION_ORDER = [
  { week: 1,  eliminated: 18, immunityWinner: 9,  note: "First tribal of the season" },
  { week: 2,  eliminated: 17, immunityWinner: 3,  note: "Tribe swap shakeup" },
  { week: 3,  eliminated: 16, immunityWinner: 1,  note: "Social game factors in" },
  { week: 4,  eliminated: 15, immunityWinner: 4,  note: "Alliances form" },
  { week: 5,  eliminated: 14, immunityWinner: 2,  note: "Double elimination week" },
  { week: 5,  eliminated: 13, immunityWinner: 2,  note: "Second boot of double ep" },
  { week: 6,  eliminated: 12, immunityWinner: 8,  note: "Merge episode drama" },
  { week: 7,  eliminated: 10, immunityWinner: 1,  note: "Double boot" },
  { week: 7,  eliminated: 11, immunityWinner: 1,  note: "Second double boot" },
  { week: 8,  eliminated: 9,  immunityWinner: 5,  note: "Idol played wrong" },
  { week: 9,  eliminated: 8,  immunityWinner: 1,  note: "Numbers dwindle" },
  { week: 10, eliminated: 7,  immunityWinner: 4,  note: "Blindside" },
  { week: 11, eliminated: 6,  immunityWinner: 3,  note: "Dan removed by producers" },
  { week: 12, eliminated: 5,  immunityWinner: 1,  note: "Immunity run" },
  { week: 13, eliminated: 3,  immunityWinner: 1,  note: "Firemaking challenge" },
  { week: 14, eliminated: 4,  immunityWinner: 1,  note: "Finale" },
  { week: 14, eliminated: 2,  immunityWinner: 1,  note: "Runner-up" },
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
    question: "What was the twist in Survivor: Island of the Idols (Season 39)?",
    options: ["Returning legends mentored players", "Fans vs Favorites", "Blood vs Water", "Edge of Extinction"],
    correct: 0,
    difficulty: "medium"
  },
  {
    question: "Who are the 'Legends' on Island of the Idols?",
    options: ["Ozzy and Cirie", "Boston Rob and Sandra", "Malcolm and Parvati", "Rupert and Russell"],
    correct: 1,
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

// Memory Match pairs (survivor + season)
const MEMORY_PAIRS = [
  { id: "a", type: "player", content: "Richard Hatch",   match: "A" },
  { id: "b", type: "season", content: "Borneo (S1)",      match: "A" },
  { id: "c", type: "player", content: "Sandra",           match: "B" },
  { id: "d", type: "season", content: "Pearl Islands",    match: "B" },
  { id: "e", type: "player", content: "Boston Rob",       match: "C" },
  { id: "f", type: "season", content: "Redemption Island",match: "C" },
  { id: "g", type: "player", content: "Tony Vlachos",     match: "D" },
  { id: "h", type: "season", content: "Cagayan (S28)",    match: "D" },
  { id: "i", type: "player", content: "Parvati Shallow",  match: "E" },
  { id: "j", type: "season", content: "Micronesia (S16)", match: "E" },
  { id: "k", type: "player", content: "Kim Spradlin",     match: "F" },
  { id: "l", type: "season", content: "One World (S24)",  match: "F" },
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
