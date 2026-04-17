export const QUIZ_STORAGE_PREFIX = 'onedate:quizResults';

export const quizDefinitions = [
  {
    id: 'hogwarts-house',
    title: 'Hogwarts House',
    subtitle: 'Find out which Hogwarts house you belong to!',
    badge: '🏰 Harry Potter',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    completionMessage: 'Your Hogwarts energy has been revealed.',
    questions: [
      {
        id: 'trait',
        question: 'Which trait matters most to you?',
        options: [
          { value: 'brave', label: 'Bravery', description: 'Lead with courage and bold choices.' },
          { value: 'loyal', label: 'Loyalty', description: 'Stand by your people no matter what.' },
          { value: 'curious', label: 'Curiosity', description: 'Learn everything and ask why.' },
          { value: 'ambitious', label: 'Ambition', description: 'Aim high and make things happen.' },
        ],
      },
      {
        id: 'school_day',
        question: 'Pick your ideal Hogwarts afternoon.',
        options: [
          { value: 'dueling', label: 'Dueling practice', description: 'Fast reflexes and adrenaline.' },
          { value: 'common_room', label: 'Common room hangout', description: 'Warm, social, and familiar.' },
          { value: 'library', label: 'Library deep dive', description: 'Books, secrets, and strategy.' },
          { value: 'secret_plan', label: 'A mysterious side quest', description: 'A little dramatic, a little iconic.' },
        ],
      },
      {
        id: 'friend_role',
        question: 'What role do you naturally play in a group?',
        options: [
          { value: 'protector', label: 'Protector', description: 'You step up when it counts.' },
          { value: 'heart', label: 'Heart of the group', description: 'You keep everyone together.' },
          { value: 'planner', label: 'Planner', description: 'You think three steps ahead.' },
          { value: 'power_move', label: 'Power mover', description: 'You influence the room with confidence.' },
        ],
      },
    ],
  },
  {
    id: 'ideal-vacation',
    title: 'Ideal Vacation',
    subtitle: 'Discover your perfect vacation destination!',
    badge: '✈️ Travel',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    completionMessage: 'Your dream escape is taking shape.',
    questions: [
      {
        id: 'pace',
        question: 'What pace sounds best for a trip?',
        options: [
          { value: 'slow', label: 'Slow and scenic', description: 'Wander, relax, and soak it in.' },
          { value: 'balanced', label: 'A little of everything', description: 'Explore by day, unwind by night.' },
          { value: 'packed', label: 'Packed itinerary', description: 'I want every hour to count.' },
        ],
      },
      {
        id: 'setting',
        question: 'Choose your favorite backdrop.',
        options: [
          { value: 'beach', label: 'Beach', description: 'Sun, ocean, and laid-back energy.' },
          { value: 'city', label: 'City', description: 'Food, fashion, and endless things to do.' },
          { value: 'mountains', label: 'Mountains', description: 'Fresh air and big views.' },
          { value: 'countryside', label: 'Countryside', description: 'Charming, quiet, and romantic.' },
        ],
      },
      {
        id: 'travel_priority',
        question: 'What makes a trip unforgettable?',
        options: [
          { value: 'food', label: 'Amazing food', description: 'I travel stomach-first.' },
          { value: 'people', label: 'The people', description: 'Shared memories make the trip.' },
          { value: 'adventure', label: 'Adventure', description: 'I want stories to tell later.' },
          { value: 'aesthetic', label: 'Beautiful places', description: 'I love visually stunning moments.' },
        ],
      },
    ],
  },
  {
    id: 'twilight-character',
    title: 'Twilight Character',
    subtitle: 'Which Twilight character are you?',
    badge: '🌙 Twilight',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    completionMessage: 'Your Twilight aura has been matched.',
    questions: [
      {
        id: 'energy',
        question: 'What vibe do you give off first?',
        options: [
          { value: 'mysterious', label: 'Mysterious', description: 'Quiet, magnetic, hard to read.' },
          { value: 'warm', label: 'Warm', description: 'Comforting and easy to trust.' },
          { value: 'intense', label: 'Intense', description: 'Strong feelings, strong presence.' },
          { value: 'funny', label: 'Funny', description: 'You lighten the mood naturally.' },
        ],
      },
      {
        id: 'romance_style',
        question: 'Your romance style is closest to...',
        options: [
          { value: 'all_in', label: 'All in', description: 'When I care, I care deeply.' },
          { value: 'steady', label: 'Steady and protective', description: 'Reliable and grounded.' },
          { value: 'dramatic', label: 'Dramatic and passionate', description: 'High stakes, big feelings.' },
          { value: 'playful', label: 'Playful', description: 'Flirty, fun, and spontaneous.' },
        ],
      },
      {
        id: 'superpower',
        question: 'Pick a supernatural advantage.',
        options: [
          { value: 'speed', label: 'Super speed', description: 'Fast moves, fast decisions.' },
          { value: 'mind', label: 'Mind-reading', description: 'Understand people instantly.' },
          { value: 'strength', label: 'Strength', description: 'Power and protection.' },
          { value: 'future', label: 'Future visions', description: 'See what could happen next.' },
        ],
      },
    ],
  },
  {
    id: 'love-language',
    title: 'Love Language',
    subtitle: 'Discover your love language!',
    badge: '💕 Relationships',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    completionMessage: 'Your love language profile is saved.',
    questions: [
      {
        id: 'feel_closest',
        question: 'When do you feel most appreciated?',
        options: [
          { value: 'words', label: 'When someone says it', description: 'Words mean a lot to me.' },
          { value: 'time', label: 'When someone makes time', description: 'Presence matters most.' },
          { value: 'gifts', label: 'When someone brings something thoughtful', description: 'Small gestures feel big.' },
          { value: 'help', label: 'When someone helps me', description: 'Support speaks loudly.' },
        ],
      },
      {
        id: 'date_memory',
        question: 'What part of a great date stays with you?',
        options: [
          { value: 'conversation', label: 'The conversation', description: 'The emotional connection.' },
          { value: 'attention', label: 'The focused attention', description: 'Feeling chosen and present.' },
          { value: 'gesture', label: 'A thoughtful gesture', description: 'Something sweet and specific.' },
          { value: 'touch', label: 'A warm hug or touch', description: 'Comfort and closeness.' },
        ],
      },
      {
        id: 'show_care',
        question: 'How do you usually show care?',
        options: [
          { value: 'compliments', label: 'Compliments', description: 'I say what I admire.' },
          { value: 'plans', label: 'Making plans', description: 'I carve out time.' },
          { value: 'surprises', label: 'Little surprises', description: 'I love thoughtful details.' },
          { value: 'acts', label: 'Doing helpful things', description: 'I show up in practical ways.' },
        ],
      },
    ],
  },
  {
    id: 'marvel-hero',
    title: 'Marvel Hero',
    subtitle: 'Which Marvel superhero are you?',
    badge: '🦸 Marvel',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    completionMessage: 'Your hero profile is now locked in.',
    questions: [
      {
        id: 'strength',
        question: 'What kind of strength defines you?',
        options: [
          { value: 'leadership', label: 'Leadership', description: 'You rally people around a goal.' },
          { value: 'intelligence', label: 'Intelligence', description: 'You solve the impossible.' },
          { value: 'heart', label: 'Heart', description: 'Compassion drives your choices.' },
          { value: 'resilience', label: 'Resilience', description: 'You keep going no matter what.' },
        ],
      },
      {
        id: 'mission',
        question: 'What kind of mission would you choose?',
        options: [
          { value: 'save_city', label: 'Save the city', description: 'Big scale, big stakes.' },
          { value: 'protect_people', label: 'Protect your people', description: 'Personal and meaningful.' },
          { value: 'invent', label: 'Build the solution', description: 'Fix it with creativity.' },
          { value: 'cosmic', label: 'Go cosmic', description: 'The weirder the adventure, the better.' },
        ],
      },
      {
        id: 'public_image',
        question: 'How would the world see you?',
        options: [
          { value: 'iconic', label: 'Iconic', description: 'A symbol people look up to.' },
          { value: 'relatable', label: 'Relatable', description: 'Powerful, but still human.' },
          { value: 'enigmatic', label: 'Enigmatic', description: 'Hard to predict, hard to forget.' },
          { value: 'chaotic', label: 'A little chaotic', description: 'Unexpected, but effective.' },
        ],
      },
    ],
  },
  {
    id: 'disney-princess',
    title: 'Disney Princess',
    subtitle: 'Which Disney princess are you?',
    badge: '👑 Disney',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    completionMessage: 'Your princess energy has been revealed.',
    questions: [
      {
        id: 'dream',
        question: 'What drives you most?',
        options: [
          { value: 'freedom', label: 'Freedom', description: 'I want room to choose my own path.' },
          { value: 'belonging', label: 'Belonging', description: 'Connection and home matter most.' },
          { value: 'adventure', label: 'Adventure', description: 'I crave something beyond ordinary.' },
          { value: 'purpose', label: 'Purpose', description: 'I want to do something meaningful.' },
        ],
      },
      {
        id: 'strength_style',
        question: 'Your strength feels most like...',
        options: [
          { value: 'kindness', label: 'Kindness', description: 'Soft but powerful.' },
          { value: 'grit', label: 'Grit', description: 'I push through hard things.' },
          { value: 'curiosity', label: 'Curiosity', description: 'I grow by exploring.' },
          { value: 'independence', label: 'Independence', description: 'I trust myself first.' },
        ],
      },
      {
        id: 'perfect_scene',
        question: 'Choose your perfect movie moment.',
        options: [
          { value: 'ballroom', label: 'A magical ballroom', description: 'Elegant and unforgettable.' },
          { value: 'ocean', label: 'A scene by the sea', description: 'Dreamy, open, and emotional.' },
          { value: 'forest', label: 'A forest adventure', description: 'Mystical and alive.' },
          { value: 'castle', label: 'A castle breakthrough', description: 'A major glow-up moment.' },
        ],
      },
    ],
  },
  {
    id: 'star-wars',
    title: 'Star Wars',
    subtitle: 'Which Star Wars character are you?',
    badge: '⭐ Star Wars',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    completionMessage: 'Your galactic alignment is saved.',
    questions: [
      {
        id: 'approach',
        question: 'How do you handle pressure?',
        options: [
          { value: 'calm', label: 'Stay calm', description: 'Focus and discipline first.' },
          { value: 'bold', label: 'Act boldly', description: 'Trust instinct and move.' },
          { value: 'strategic', label: 'Think strategically', description: 'Plan before the leap.' },
          { value: 'rebellious', label: 'Break the rules a little', description: 'If it works, it works.' },
        ],
      },
      {
        id: 'side',
        question: 'What pulls you most?',
        options: [
          { value: 'light', label: 'Hope and balance', description: 'You lead with principle.' },
          { value: 'gray', label: 'A little gray area', description: 'You follow nuance over rules.' },
          { value: 'adventure', label: 'Adventure', description: 'The mission matters most.' },
          { value: 'power', label: 'Power', description: 'You like strong outcomes and control.' },
        ],
      },
      {
        id: 'crew_role',
        question: 'What role would you take on a starship?',
        options: [
          { value: 'pilot', label: 'Pilot', description: 'Fast reflexes, big confidence.' },
          { value: 'jedi', label: 'Force user', description: 'Intuition, training, and presence.' },
          { value: 'captain', label: 'Captain', description: 'Lead the crew through chaos.' },
          { value: 'smuggler', label: 'Wildcard smuggler', description: 'Charm, hustle, and improvisation.' },
        ],
      },
    ],
  },
  {
    id: 'dating-style',
    title: 'Dating Style',
    subtitle: "What's your dating personality?",
    badge: '💘 Dating',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    completionMessage: 'Your dating style has been saved.',
    questions: [
      {
        id: 'first_move',
        question: 'Who usually makes the first move?',
        options: [
          { value: 'me', label: 'Usually me', description: 'I like to lead with interest.' },
          { value: 'mutual', label: 'Mutual vibe', description: 'I wait for clear energy from both sides.' },
          { value: 'them', label: 'Usually them', description: 'I open up once I feel safe.' },
        ],
      },
      {
        id: 'chemistry',
        question: 'What creates chemistry fastest for you?',
        options: [
          { value: 'banter', label: 'Great banter', description: 'If we laugh, I notice.' },
          { value: 'depth', label: 'Emotional depth', description: 'I like real conversation early.' },
          { value: 'consistency', label: 'Consistency', description: 'Reliability is attractive.' },
          { value: 'spark', label: 'Immediate spark', description: 'I know it when I feel it.' },
        ],
      },
      {
        id: 'ideal_match',
        question: 'Your best match would probably be...',
        options: [
          { value: 'grounded', label: 'Grounded', description: 'Calm, secure, and thoughtful.' },
          { value: 'fun', label: 'Fun and outgoing', description: 'Social, playful, and magnetic.' },
          { value: 'driven', label: 'Driven', description: 'Ambitious and inspiring.' },
          { value: 'soft', label: 'Soft and warm', description: 'Gentle, caring, and easy to be around.' },
        ],
      },
    ],
  },
];

export const getQuizDefinition = (quizId) =>
  quizDefinitions.find((quiz) => quiz.id === quizId);

export const getQuizStorageKey = (userId, quizId) => {
  const safeUserId = userId || 'guest';
  return `${QUIZ_STORAGE_PREFIX}:${safeUserId}:${quizId}`;
};

export const saveQuizResult = (userId, quizId, answers) => {
  try {
    const key = getQuizStorageKey(userId, quizId);
    localStorage.setItem(
      key,
      JSON.stringify({
        answers,
        completedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    console.error('Failed to save quiz result:', error);
  }
};

export const readQuizResult = (userId, quizId) => {
  try {
    const key = getQuizStorageKey(userId, quizId);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read quiz result:', error);
    return null;
  }
};
