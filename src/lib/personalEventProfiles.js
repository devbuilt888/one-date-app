export const DECOY_PROFILES = [
  {
    id: 'decoy-riley',
    displayName: 'Riley',
    age: 27,
    bio: 'Foodie, weekend hikes, and good playlists.',
    photoUrl: '/images/users/emmaWilson.jpeg',
    isDecoy: true,
  },
  {
    id: 'decoy-casey',
    displayName: 'Casey',
    age: 29,
    bio: 'Coffee first, plans later. Love trying new spots.',
    photoUrl: '/images/users/sarahJohnson.jpeg',
    isDecoy: true,
  },
  {
    id: 'decoy-morgan',
    displayName: 'Morgan',
    age: 26,
    bio: 'Charity runs and trivia nights.',
    photoUrl: '/images/users/avaDavis.jpeg',
    isDecoy: true,
  },
  {
    id: 'decoy-jamie',
    displayName: 'Jamie',
    age: 31,
    bio: 'Live music, long walks, and spontaneous day trips.',
    photoUrl: '/images/users/oliviaBrown.jpeg',
    isDecoy: true,
  },
  {
    id: 'decoy-taylor',
    displayName: 'Taylor',
    age: 24,
    bio: 'Bookstores, board games, and brunch enthusiast.',
    photoUrl: '/images/users/emmaWilson.jpeg',
    isDecoy: true,
  },
];

export function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function profileFromDbRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    displayName: row.display_name || 'Someone',
    age: row.age || '—',
    bio: row.bio || 'No bio yet.',
    photoUrl: row.photo_urls?.[0] || '/images/users/emmaWilson.jpeg',
    isDecoy: false,
  };
}

export function hostProfileFromEvent(event) {
  return {
    id: event.hostUserId,
    displayName: event.hostName || 'Event host',
    age: '—',
    bio: event.description || 'Hosting a personal event on OneDate.',
    photoUrl: '/images/users/sarahJohnson.jpeg',
    isDecoy: false,
    isHost: true,
  };
}

export function pickDecoyProfiles(count, excludeIds = []) {
  const excluded = new Set(excludeIds);
  return shuffleArray(DECOY_PROFILES.filter((profile) => !excluded.has(profile.id))).slice(0, count);
}

export function buildPickerProfiles(realProfiles, decoyCount, excludeIds = []) {
  const decoys = pickDecoyProfiles(decoyCount, excludeIds);
  return shuffleArray([...realProfiles, ...decoys]);
}
