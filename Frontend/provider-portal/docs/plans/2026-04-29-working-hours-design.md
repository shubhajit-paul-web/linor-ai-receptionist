# Working Hours Command Center — Design

## Problem
The current `/working-hours` route redirects to Clinic Settings, where hours are edited in a basic single-row-per-day form. This limits control, weakens clarity for advanced scheduling, and does not provide strong confidence about what patients will actually see.

## Goals
- Build a dedicated SaaS-level Working Hours page at `/working-hours`.
- Support advanced scheduling: weekly hours, split shifts, break blocks, and date-specific overrides/holidays.
- Improve usability with clear structure, strong visibility, and psychologically safe interaction patterns.

## Chosen Approach
Use a **Command Center** layout with progressive disclosure and live feedback:
- Top context bar for timezone and bulk actions
- Primary editor area for weekly schedule and advanced controls
- Live patient-facing visibility preview
- Sticky save bar with unsaved-state awareness

## Information Architecture
1. **Header / Command Bar**
   - Page title, timezone selector
   - Coverage summary (open hours/week + warnings)
   - Quick actions: apply template, duplicate day pattern, reset
2. **Main Workspace**
   - Left: weekly schedule day cards and time range editing
   - Right: patient visibility preview (“Open now”, next opening, fallback message)
3. **Advanced Sections**
   - Weekly Hours
   - Break Blocks
   - Date Overrides (holiday closures and one-off custom hours)
   - Summary
4. **Sticky Save Footer**
   - Dirty-state indicator, validation summary, save/discard actions

## Component Design
- `WorkingHoursPage`
- `HoursCommandBar`
- `WeeklyScheduleEditor`
- `DayCard`
- `TimeRangeRow`
- `BreakBlocksEditor`
- `DateOverridesEditor`
- `VisibilityPreviewCard`
- `StickySaveBar`

## Data Model (Store Evolution)
Move from simple array to structured schedule config:

```js
workingHours: {
  timezone: 'America/Los_Angeles',
  weekly: [{ day: 'Monday', enabled: true, slots: [{ start: '09:00', end: '17:00' }] }],
  breaks: [{ day: 'Monday', start: '12:30', end: '13:30', label: 'Lunch' }],
  overrides: [{ id: 'ovr-1', date: '2026-12-25', type: 'closed', slots: [], note: 'Holiday' }],
}
```

Add migration/adapter logic so legacy `DEFAULT_WORKING_HOURS` still loads safely.

## Data Flow
- Local edits update page state instantly and mark dirty.
- Save runs normalization + validation and writes once to store.
- Clinic Settings keeps a lightweight summary with a link to `/working-hours` to avoid competing editors.
- Visibility preview resolves schedule by priority:
  1. date override
  2. weekly slots
  3. break windows

## Validation and Error Handling
- Block invalid ranges (`start >= end`)
- Prevent overlapping slots and overlapping breaks
- Validate break blocks are inside open windows
- Prevent invalid override payloads
- Show inline row-level errors + section-level summary

## UX/Behavior Principles
- **Progressive disclosure:** advanced settings revealed as needed
- **Recognition over recall:** templates and presets reduce memory burden
- **Immediate feedback:** live preview reflects real patient visibility
- **Loss-aversion safety:** persistent unsaved-state cues and discard confirmation

## Responsive Behavior
- Desktop: 2-column editor + preview
- Tablet/mobile: stacked sections with persistent bottom save bar
- Touch-friendly controls for time block add/remove actions

## Quality Strategy
- Availability resolution tests (weekly + breaks + overrides + timezone)
- UI interaction tests for adding/removing slots, validation surfacing, save/discard state behavior
- Visual checks for light/dark mode and narrow viewport usability

