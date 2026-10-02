import { personalEventsDb } from './supabase';

export const PERSONAL_EVENT_TYPES = [
  { value: 'restaurant', label: 'Restaurant date' },
  { value: 'social', label: 'Social gathering' },
  { value: 'charity', label: 'Charity event' },
];

export const PERSONAL_EVENTS_STORAGE_KEY = 'onedate:personalEvents:v2';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value) {
  return typeof value === 'string' && UUID_RE.test(value);
}

/** True when the event exists in Supabase (not local demo placeholders). */
export function isPersistedPersonalEvent(event) {
  if (!event?.id || !event?.hostUserId) return false;
  return isUuid(event.id) && isUuid(event.hostUserId);
}

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

export function mapDbPersonalEvent(row) {
  if (!row) return null;
  return {
    id: row.id,
    hostUserId: row.host_user_id,
    hostName: row.host_name || row.host?.display_name || 'Someone',
    title: row.title,
    approximateLocation: row.approximate_location,
    eventType: row.event_type,
    description: row.description,
    datetime: row.event_datetime,
    createdAt: row.created_at,
  };
}

/** Load events from Supabase and cache in localStorage for the rest of the app. */
export async function syncPersonalEventsFromDb() {
  const { data, error } = await personalEventsDb.getAll();
  if (error) {
    console.error('Failed to sync personal events from database:', error);
    return readPersonalEvents();
  }

  if (!data?.length) {
    return readPersonalEvents();
  }

  const mapped = data.map(mapDbPersonalEvent);
  writePersonalEvents(mapped);
  return mapped;
}

export async function addPersonalEvent(event) {
  const list = readPersonalEvents();
  const localId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const record = {
    ...event,
    id: localId,
    createdAt: new Date().toISOString(),
  };
  list.unshift(record);
  writePersonalEvents(list);

  const { data, error } = await personalEventsDb.save(event);
  if (error) {
    console.error('Failed to save personal event to database:', error);
    return record;
  }

  if (data) {
    const synced = mapDbPersonalEvent(data);
    const updated = readPersonalEvents().map((item) =>
      item.id === localId ? synced : item
    );
    writePersonalEvents(updated);
    return synced;
  }

  return record;
}

export function getPersonalEventById(id) {
  return readPersonalEvents().find((e) => e.id === id) || null;
}

export function getDismissedEventsStorageKey(userId) {
  return `onedate:dismissedPersonalEvents:${userId}`;
}

export function readDismissedPersonalEventIds(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(getDismissedEventsStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function dismissPersonalEvent(userId, eventId) {
  if (!userId || !eventId) return;
  const current = readDismissedPersonalEventIds(userId);
  if (current.includes(eventId)) return;
  localStorage.setItem(
    getDismissedEventsStorageKey(userId),
    JSON.stringify([...current, eventId])
  );
}

export function getEventDisplayTitle(ev) {
  if (!ev) return '';
  if (ev.title && String(ev.title).trim()) return ev.title.trim();
  return `${ev.hostName || 'Someone'}'s plan`;
}

export function labelForEventType(value) {
  return PERSONAL_EVENT_TYPES.find((t) => t.value === value)?.label || value;
}
