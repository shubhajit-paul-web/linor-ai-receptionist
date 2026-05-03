const DAY_ORDER = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const SUNDAY_FIRST = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const DEFAULT_TIMEZONE = 'America/Los_Angeles';

export const TIMEZONE_OPTIONS = [
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'Europe/London',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Australia/Sydney',
];

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

function isValidDay(value) {
  return DAY_ORDER.includes(value);
}

function isValidTime(value) {
  return typeof value === 'string' && TIME_PATTERN.test(value);
}

function clampTime(value, fallback) {
  return isValidTime(value) ? value : fallback;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toZonedDate(date, timezone) {
  return new Date(new Date(date).toLocaleString('en-US', { timeZone: timezone }));
}

function getDateKeyForZonedDate(date, timezone) {
  return toDateKey(toZonedDate(date, timezone));
}

function sortRanges(ranges) {
  return [...ranges].sort((a, b) => parseMinutes(a.start) - parseMinutes(b.start));
}

function normalizeSlots(rawSlots) {
  return sortRanges(
    (rawSlots ?? []).map((slot) => ({
      id: slot?.id ?? createId('slot'),
      start: clampTime(slot?.start, '09:00'),
      end: clampTime(slot?.end, '17:00'),
    }))
  );
}

function normalizeLegacyArray(legacy) {
  const map = new Map(
    legacy
      .filter((row) => isValidDay(row?.day))
      .map((row) => [
        row.day,
        {
          day: row.day,
          enabled: Boolean(row.open),
          slots: row.open
            ? normalizeSlots([
                { start: clampTime(row.from, '09:00'), end: clampTime(row.to, '17:00') },
              ])
            : [],
        },
      ])
  );

  return {
    timezone: DEFAULT_TIMEZONE,
    weekly: DAY_ORDER.map((day) => {
      if (map.has(day)) return map.get(day);
      const defaultConfig = createDefaultWorkingHoursConfig();
      return defaultConfig.weekly.find((row) => row.day === day);
    }),
    breaks: [],
    overrides: [],
  };
}

function normalizeWeekly(rawWeekly) {
  const defaults = createDefaultWorkingHoursConfig().weekly;
  const map = new Map(
    (rawWeekly ?? [])
      .filter((row) => isValidDay(row?.day))
      .map((row) => [
        row.day,
        {
          day: row.day,
          enabled: typeof row.enabled === 'boolean' ? row.enabled : Boolean(row.open),
          slots: normalizeSlots(
            Array.isArray(row.slots)
              ? row.slots
              : row.open
                ? [{ start: row.from, end: row.to }]
                : []
          ),
        },
      ])
  );

  return DAY_ORDER.map((day) => {
    if (map.has(day)) return map.get(day);
    return defaults.find((row) => row.day === day);
  });
}

function normalizeBreaks(rawBreaks) {
  return (rawBreaks ?? [])
    .filter((item) => isValidDay(item?.day))
    .map((item) => ({
      id: item.id ?? createId('break'),
      day: item.day,
      label: typeof item.label === 'string' ? item.label.slice(0, 40) : '',
      start: clampTime(item.start, '12:00'),
      end: clampTime(item.end, '13:00'),
    }));
}

function normalizeOverrides(rawOverrides) {
  return (rawOverrides ?? [])
    .map((item) => ({
      id: item?.id ?? createId('override'),
      date: DATE_PATTERN.test(item?.date ?? '') ? item.date : '',
      type: item?.type === 'custom' ? 'custom' : 'closed',
      note: typeof item?.note === 'string' ? item.note.slice(0, 120) : '',
      slots: normalizeSlots(item?.slots),
    }))
    .filter((item) => item.date)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function getEffectiveSlots(config, dayName, dateKey) {
  const override = (config.overrides ?? []).find((item) => item.date === dateKey);
  if (override) {
    if (override.type === 'closed') return [];
    return normalizeSlots(override.slots);
  }
  const daySchedule = (config.weekly ?? []).find((row) => row.day === dayName);
  if (!daySchedule?.enabled) return [];
  return normalizeSlots(daySchedule.slots);
}

function findNextOpening(config, fromDate = new Date()) {
  const timezone = config.timezone ?? DEFAULT_TIMEZONE;
  const base = toZonedDate(fromDate, timezone);

  for (let offset = 0; offset < 14; offset += 1) {
    const probe = new Date(base);
    probe.setDate(base.getDate() + offset);
    const dayName = SUNDAY_FIRST[probe.getDay()];
    const dateKey = toDateKey(probe);
    const currentMinutes = offset === 0 ? probe.getHours() * 60 + probe.getMinutes() : -1;
    const slots = getEffectiveSlots(config, dayName, dateKey);
    const nextSlot = slots.find((slot) => parseMinutes(slot.start) > currentMinutes);
    if (nextSlot) {
      return { dayName, dateKey, time: nextSlot.start };
    }
  }

  return null;
}

export function parseMinutes(time) {
  if (!isValidTime(time)) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatClock(time24) {
  if (!isValidTime(time24)) return time24 ?? '--:--';
  const [hoursRaw, minutes] = time24.split(':').map(Number);
  const period = hoursRaw >= 12 ? 'PM' : 'AM';
  const hours = hoursRaw % 12 || 12;
  return `${hours}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function formatMinutesAsHours(minutes) {
  const safe = Math.max(0, Math.round(minutes));
  const hrs = Math.floor(safe / 60);
  const mins = safe % 60;
  if (!hrs) return `${mins}m`;
  if (!mins) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

export function createDefaultWorkingHoursConfig() {
  return {
    timezone: DEFAULT_TIMEZONE,
    weekly: DAY_ORDER.map((day) => ({
      day,
      enabled: day !== 'Sunday',
      slots:
        day === 'Sunday'
          ? []
          : [
              {
                id: `slot-${day.toLowerCase()}-1`,
                start: '09:00',
                end: day === 'Saturday' ? '13:00' : '17:00',
              },
            ],
    })),
    breaks: [],
    overrides: [],
  };
}

export function normalizeWorkingHoursConfig(value) {
  if (Array.isArray(value)) {
    return normalizeLegacyArray(value);
  }

  if (!value || typeof value !== 'object') {
    return createDefaultWorkingHoursConfig();
  }

  return {
    timezone:
      typeof value.timezone === 'string' && value.timezone.trim()
        ? value.timezone
        : DEFAULT_TIMEZONE,
    weekly: normalizeWeekly(value.weekly),
    breaks: normalizeBreaks(value.breaks),
    overrides: normalizeOverrides(value.overrides),
  };
}

export function validateTimeRanges(ranges, contextLabel = 'Range') {
  const errors = [];
  const normalized = sortRanges(ranges ?? []);

  normalized.forEach((range, idx) => {
    const start = parseMinutes(range.start);
    const end = parseMinutes(range.end);
    if (start >= end) {
      errors.push(`${contextLabel} ${idx + 1} must end after it starts.`);
    }
  });

  for (let idx = 1; idx < normalized.length; idx += 1) {
    const prev = normalized[idx - 1];
    const curr = normalized[idx];
    if (parseMinutes(curr.start) < parseMinutes(prev.end)) {
      errors.push(`${contextLabel} ${idx + 1} overlaps with ${contextLabel.toLowerCase()} ${idx}.`);
    }
  }

  return errors;
}

export function validateWorkingHoursConfig(input) {
  const config = normalizeWorkingHoursConfig(input);
  const errors = [];
  const todayKey = getDateKeyForZonedDate(new Date(), config.timezone);

  config.weekly.forEach((daySchedule) => {
    if (!daySchedule.enabled) return;
    if (!daySchedule.slots.length) {
      errors.push(`${daySchedule.day}: add at least one open slot or mark the day closed.`);
      return;
    }

    const slotErrors = validateTimeRanges(daySchedule.slots, `${daySchedule.day} slot`);
    errors.push(...slotErrors);

    const dayBreaks = config.breaks.filter((item) => item.day === daySchedule.day);
    const breakErrors = validateTimeRanges(dayBreaks, `${daySchedule.day} break`);
    errors.push(...breakErrors);

    dayBreaks.forEach((breakBlock, idx) => {
      const breakStart = parseMinutes(breakBlock.start);
      const breakEnd = parseMinutes(breakBlock.end);
      const insideSlot = daySchedule.slots.some((slot) => {
        const slotStart = parseMinutes(slot.start);
        const slotEnd = parseMinutes(slot.end);
        return breakStart >= slotStart && breakEnd <= slotEnd;
      });

      if (!insideSlot) {
        errors.push(`${daySchedule.day} break ${idx + 1} must be fully inside an open slot.`);
      }
    });
  });

  config.overrides.forEach((override, idx) => {
    if (!DATE_PATTERN.test(override.date)) {
      errors.push(`Override ${idx + 1} has an invalid date.`);
      return;
    }

    if (override.type === 'custom') {
      if (!override.slots.length) {
        errors.push(`Override ${override.date} requires at least one custom slot.`);
      }
      const overrideErrors = validateTimeRanges(override.slots, `Override ${override.date} slot`);
      errors.push(...overrideErrors);
    }

    if (override.date < todayKey) {
      errors.push(`Override ${override.date} is in the past. Remove or update it.`);
    }
  });

  return { valid: errors.length === 0, errors };
}

export function summarizeCoverage(input) {
  const config = normalizeWorkingHoursConfig(input);
  let totalMinutes = 0;

  config.weekly.forEach((daySchedule) => {
    if (!daySchedule.enabled) return;

    const slotMinutes = daySchedule.slots.reduce(
      (sum, slot) => sum + Math.max(0, parseMinutes(slot.end) - parseMinutes(slot.start)),
      0
    );

    const breakMinutes = config.breaks
      .filter((item) => item.day === daySchedule.day)
      .reduce(
        (sum, block) => sum + Math.max(0, parseMinutes(block.end) - parseMinutes(block.start)),
        0
      );

    totalMinutes += Math.max(0, slotMinutes - breakMinutes);
  });

  const openDays = config.weekly.filter((row) => row.enabled && row.slots.length > 0).length;
  const warnings = [];

  if (openDays === 0) warnings.push('Clinic is closed all week.');
  if (totalMinutes > 7 * 12 * 60) warnings.push('Weekly hours exceed 12 hours/day average.');

  const nextOverride = getNextOverride(config);

  return {
    openDays,
    weeklyOpenMinutes: totalMinutes,
    weeklyOpenLabel: formatMinutesAsHours(totalMinutes),
    warnings,
    nextOverride,
  };
}

export function getNextOverride(input, fromDate = new Date()) {
  const config = normalizeWorkingHoursConfig(input);
  const baseKey = getDateKeyForZonedDate(fromDate, config.timezone);
  return config.overrides.find((item) => item.date >= baseKey) ?? null;
}

export function resolveAvailabilityAt(input, instant = new Date()) {
  const config = normalizeWorkingHoursConfig(input);
  const timezone = config.timezone ?? DEFAULT_TIMEZONE;
  const zonedNow = toZonedDate(instant, timezone);
  const dayName = SUNDAY_FIRST[zonedNow.getDay()];
  const dateKey = toDateKey(zonedNow);
  const nowMinutes = zonedNow.getHours() * 60 + zonedNow.getMinutes();
  const slots = getEffectiveSlots(config, dayName, dateKey);
  const dayBreaks = config.breaks.filter((item) => item.day === dayName);
  const override = config.overrides.find((item) => item.date === dateKey);

  const activeSlot = slots.find((slot) => {
    const start = parseMinutes(slot.start);
    const end = parseMinutes(slot.end);
    return nowMinutes >= start && nowMinutes < end;
  });

  const activeBreak = dayBreaks.find((block) => {
    const start = parseMinutes(block.start);
    const end = parseMinutes(block.end);
    return nowMinutes >= start && nowMinutes < end;
  });

  if (activeSlot && !activeBreak) {
    return {
      isOpen: true,
      reason: 'open',
      timezone,
      dayName,
      dateKey,
      nextOpenAt: null,
      closesAt: activeSlot.end,
    };
  }

  if (activeBreak) {
    return {
      isOpen: false,
      reason: 'on_break',
      timezone,
      dayName,
      dateKey,
      nextOpenAt: {
        dayName,
        dateKey,
        time: activeBreak.end,
      },
      closesAt: null,
    };
  }

  const nextOpenAt = findNextOpening(config, instant);

  return {
    isOpen: false,
    reason: override?.type === 'closed' ? 'override_closed' : 'closed',
    timezone,
    dayName,
    dateKey,
    nextOpenAt,
    closesAt: null,
  };
}

export function getDayOrder() {
  return [...DAY_ORDER];
}

/**
 * Convert frontend complex format to backend simple string format
 * Frontend: { timezone, weekly: [{day, enabled, slots: [{start, end}]}], breaks, overrides }
 * Backend: { monday: "9:00 AM - 6:00 PM", tuesday: "...", ... }
 */
export function convertConfigToBackendFormat(config) {
  const normalized = normalizeWorkingHoursConfig(config);
  const result = {};

  DAY_ORDER.forEach((day) => {
    const daySchedule = normalized.weekly.find((row) => row.day === day);
    
    if (!daySchedule?.enabled || !daySchedule.slots.length) {
      result[day.toLowerCase()] = 'Closed';
    } else {
      // Take the first slot (backend only supports one time range per day)
      const slot = daySchedule.slots[0];
      const startFormatted = formatClock(slot.start);
      const endFormatted = formatClock(slot.end);
      result[day.toLowerCase()] = `${startFormatted} - ${endFormatted}`;
    }
  });

  return result;
}

