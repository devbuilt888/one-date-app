export const PERSONAL_EVENT_TYPES = [
  { value: 'restaurant', label: 'Restaurant date' },
  { value: 'social', label: 'Social gathering' },
  { value: 'charity', label: 'Charity event' },
];

export const PERSONAL_EVENTS_STORAGE_KEY = 'onedate:personalEvents:v2';

function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function getEventTicketStorageKey(userId) {
  return `onedate:eventTicketUsed:${userId}:${monthKey()}`;
}

/** One create per calendar month per user. */
export function hasMonthlyEventTicket(userId) {
  if (!userId) return false;
  return localStorage.getItem(getEventTicketStorageKey(userId)) !== '1';
}

export function consumeMonthlyEventTicket(userId) {
  if (!userId) return;
  localStorage.setItem(getEventTicketStorageKey(userId), '1');
}

export function readPersonalEvents() {
  try {
    const raw = localStorage.getItem(PERSONAL_EVENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writePersonalEvents(events) {
  localStorage.setItem(PERSONAL_EVENTS_STORAGE_KEY, JSON.stringify(events));
}

export function addPersonalEvent(event) {
  const list = readPersonalEvents();
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  list.unshift({
    ...event,
    id,
    createdAt: new Date().toISOString(),
  });
  writePersonalEvents(list);
  return id;
}

export function getPersonalEventById(id) {
  return readPersonalEvents().find((e) => e.id === id) || null;
}

export function getEventDisplayTitle(ev) {
  if (!ev) return '';
  if (ev.title && String(ev.title).trim()) return ev.title.trim();
  return `${ev.hostName || 'Someone'}'s plan`;
}

const DEMO_HOST_IDS = ['demo-host-alex', 'demo-host-jordan', 'demo-host-sam'];

export function ensureDemoPersonalEvents() {
  let list = readPersonalEvents();
  if (list.length > 0) return;
  const base = Date.now();
  list = [
    {
      id: `demo-evt-${base}-1`,
      hostUserId: DEMO_HOST_IDS[0],
      hostName: 'Alex',
      title: 'I want a date to try a new Indian restaurant in town',
      approximateLocation: 'Downtown — within 2 mi',
      eventType: 'restaurant',
      description: 'Looking for someone who likes spice-level honesty and sharing appetizers.',
      datetime: new Date(base + 86400000 * 2).toISOString(),
      createdAt: new Date(base - 86400000).toISOString(),
    },
    {
      id: `demo-evt-${base}-2`,
      hostUserId: DEMO_HOST_IDS[1],
      hostName: 'Jordan',
      title: "Be my date to my sister's wedding?",
      approximateLocation: 'Orlando',
      eventType: 'social',
      description: 'Semi-formal, need a plus-one who can handle a loud family.',
      datetime: new Date(base + 86400000 * 5).toISOString(),
      createdAt: new Date(base - 43200000).toISOString(),
    },
    {
      id: `demo-evt-${base}-3`,
      hostUserId: DEMO_HOST_IDS[2],
      hostName: 'Sam',
      title: 'Date at the beach cleanup event',
      approximateLocation: 'Daytona Beach',
      eventType: 'charity',
      description: 'Morning volunteer shift, then walk the strip for coffee.',
      datetime: new Date(base + 86400000 * 9).toISOString(),
      createdAt: new Date(base - 7200000).toISOString(),
    },
  ];
  writePersonalEvents(list);
}

export function labelForEventType(value) {
  return PERSONAL_EVENT_TYPES.find((t) => t.value === value)?.label || value;
}
