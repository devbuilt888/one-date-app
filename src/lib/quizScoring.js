const QUIZ_VALUE_TO_RESULT = {
  'hogwarts-house': {
    brave: 'Gryffindor',
    dueling: 'Gryffindor',
    protector: 'Gryffindor',
    loyal: 'Hufflepuff',
    common_room: 'Hufflepuff',
    heart: 'Hufflepuff',
    curious: 'Ravenclaw',
    library: 'Ravenclaw',
    planner: 'Ravenclaw',
    ambitious: 'Slytherin',
    secret_plan: 'Slytherin',
    power_move: 'Slytherin',
  },
  'ideal-vacation': {
    slow: 'Slow & Scenic',
    beach: 'Beach Escape',
    food: 'Foodie Getaway',
    balanced: 'Balanced Explorer',
    city: 'City Break',
    people: 'Social Trip',
    packed: 'Action-Packed',
    mountains: 'Mountain Adventure',
    adventure: 'Adventure Seeker',
    countryside: 'Countryside Retreat',
    aesthetic: 'Picture-Perfect',
  },
  'twilight-character': {
    mysterious: 'Edward Cullen',
    all_in: 'Edward Cullen',
    speed: 'Edward Cullen',
    warm: 'Carlisle Cullen',
    steady: 'Carlisle Cullen',
    mind: 'Carlisle Cullen',
    intense: 'Bella Swan',
    dramatic: 'Bella Swan',
    strength: 'Bella Swan',
    funny: 'Alice Cullen',
    playful: 'Alice Cullen',
    future: 'Alice Cullen',
  },
  'love-language': {
    words: 'Words of Affirmation',
    conversation: 'Words of Affirmation',
    compliments: 'Words of Affirmation',
    time: 'Quality Time',
    attention: 'Quality Time',
    plans: 'Quality Time',
    gifts: 'Receiving Gifts',
    gesture: 'Receiving Gifts',
    surprises: 'Receiving Gifts',
    help: 'Acts of Service',
    acts: 'Acts of Service',
    touch: 'Physical Touch',
  },
  'marvel-hero': {
    leadership: 'Captain America',
    save_city: 'Captain America',
    iconic: 'Captain America',
    intelligence: 'Iron Man',
    invent: 'Iron Man',
    relatable: 'Iron Man',
    heart: 'Black Widow',
    protect_people: 'Black Widow',
    enigmatic: 'Black Widow',
    resilience: 'Thor',
    cosmic: 'Thor',
    chaotic: 'Star-Lord',
    mission: 'Star-Lord',
    public_image: 'Star-Lord',
  },
  'disney-princess': {
    freedom: 'Ariel',
    ocean: 'Ariel',
    independence: 'Ariel',
    belonging: 'Cinderella',
    kindness: 'Cinderella',
    ballroom: 'Cinderella',
    adventure: 'Merida',
    curiosity: 'Merida',
    forest: 'Merida',
    purpose: 'Mulan',
    grit: 'Mulan',
    castle: 'Mulan',
    dream: 'Mulan',
    strength_style: 'Ariel',
    perfect_scene: 'Cinderella',
  },
  'star-wars': {
    calm: 'Luke Skywalker',
    light: 'Luke Skywalker',
    jedi: 'Luke Skywalker',
    bold: 'Han Solo',
    adventure: 'Han Solo',
    pilot: 'Han Solo',
    strategic: 'Leia Organa',
    gray: 'Leia Organa',
    captain: 'Leia Organa',
    rebellious: 'Lando Calrissian',
    power: 'Darth Vader',
    smuggler: 'Lando Calrissian',
    approach: 'Luke Skywalker',
    side: 'Luke Skywalker',
    crew_role: 'Han Solo',
  },
  'dating-style': {
    me: 'Bold Connector',
    banter: 'Bold Connector',
    fun: 'Bold Connector',
    mutual: 'Thoughtful Matcher',
    depth: 'Thoughtful Matcher',
    grounded: 'Thoughtful Matcher',
    them: 'Gentle Romantic',
    consistency: 'Gentle Romantic',
    soft: 'Gentle Romantic',
    spark: 'Passion Seeker',
    driven: 'Passion Seeker',
    chemistry: 'Passion Seeker',
    ideal_match: 'Thoughtful Matcher',
    first_move: 'Bold Connector',
  },
};

const toResultKey = (label) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const computeQuizResult = (quizId, answers = {}) => {
  const mapping = QUIZ_VALUE_TO_RESULT[quizId];
  if (!mapping) {
    return { resultLabel: 'Completed', resultKey: 'completed' };
  }

  const counts = {};
  Object.values(answers).forEach((value) => {
    const result = mapping[value];
    if (result) {
      counts[result] = (counts[result] || 0) + 1;
    }
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const resultLabel = sorted[0]?.[0] || 'Completed';

  return {
    resultLabel,
    resultKey: toResultKey(resultLabel),
  };
};
