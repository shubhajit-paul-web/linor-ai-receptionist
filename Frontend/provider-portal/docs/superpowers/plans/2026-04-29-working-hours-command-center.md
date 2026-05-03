# Working Hours Command Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a dedicated `/working-hours` SaaS-grade page with weekly scheduling, split shifts, break blocks, date overrides, timezone control, and patient-visibility preview.

**Architecture:** Replace the redirect page with a focused command-center UI backed by a normalized scheduling model in the clinic store. Keep Clinic Settings as a lightweight summary surface that deep-links to `/working-hours`. Centralize schedule validation and availability resolution into small pure helpers to keep UI predictable and maintainable.

**Tech Stack:** React 19, React Router, Zustand (persist), Tailwind CSS, Framer Motion, Lucide icons, existing Toast system, existing lint/build scripts.

---

## File Structure & Responsibilities

- **Create:** `src/lib/workingHours.js`  
  Pure helpers for schedule normalization, validation, summary metrics, and patient-visibility computation.
- **Modify:** `src/lib/mockData.js`  
  Add structured default config while preserving legacy compatibility export.
- **Modify:** `src/store/useClinicStore.js`  
  Migrate persisted shape, expose new actions for full working-hours config updates.
- **Modify:** `src/pages/WorkingHours.jsx`  
  Replace redirect with full command-center page UI and interactions.
- **Modify:** `src/pages/ClinicSettings.jsx`  
  Convert Working Hours tab to summary + deep-link entry point (single source of editing truth).
- **(Optional if needed) Create:** `src/components/working-hours/*`  
  If page file becomes too large, extract focused subcomponents (day card, override row, preview card).

## Constraints and Guardrails

- No dual editors with conflicting logic: `/working-hours` is the canonical editor.
- Preserve existing persisted user data by adapting legacy `DEFAULT_WORKING_HOURS` shape.
- Keep interactions keyboard accessible and responsive.
- Use only existing toolchain commands: `npm run lint`, `npm run build`.

---

### Task 1: Introduce Working Hours Domain Helpers

**Files:**
- Create: `src/lib/workingHours.js`
- Modify: `src/lib/mockData.js`

- [ ] **Step 1: Define the new schedule contract and legacy adapter**
Add helper signatures and shape:

```js
export const createDefaultWorkingHoursConfig = () => ({ timezone: 'America/Los_Angeles', weekly: [...], breaks: [], overrides: [] });
export const normalizeWorkingHoursConfig = (value) => { /* handles legacy array -> new object */ };
```

- [ ] **Step 2: Implement validation helpers**
Add deterministic checks:

```js
export const validateTimeRanges = (ranges) => { /* start < end, no overlaps */ };
export const validateWorkingHoursConfig = (config) => ({ valid: true, errors: [] });
```

- [ ] **Step 3: Implement visibility helpers**
Add patient-facing resolution functions:

```js
export const resolveAvailabilityAt = (config, date) => ({ isOpen: false, nextOpenAt: null, reason: 'closed_today' });
export const summarizeCoverage = (config) => ({ weeklyOpenHours: 0, openDays: 0, warnings: [] });
```

- [ ] **Step 4: Wire defaults in mock data**
Export `DEFAULT_WORKING_HOURS_CONFIG` and keep `DEFAULT_WORKING_HOURS` for compatibility fallback.

- [ ] **Step 5: Commit**

```bash
git add src/lib/workingHours.js src/lib/mockData.js
git commit -m "feat: add working hours domain helpers"
```

---

### Task 2: Upgrade Clinic Store for Structured Schedule Data

**Files:**
- Modify: `src/store/useClinicStore.js`
- Modify: `src/lib/mockData.js` (if default import path adjustments needed)

- [ ] **Step 1: Change store state shape**
Replace plain array usage with normalized config:

```js
workingHours: normalizeWorkingHoursConfig(DEFAULT_WORKING_HOURS_CONFIG),
```

- [ ] **Step 2: Add focused actions**
Add explicit actions:

```js
updateWorkingHoursConfig: (updater) => set((s) => ({ workingHours: typeof updater === 'function' ? updater(s.workingHours) : updater })),
resetWorkingHoursConfig: () => set({ workingHours: createDefaultWorkingHoursConfig() }),
```

- [ ] **Step 3: Add migration safety in persisted store**
Normalize loaded persisted state before exposing to UI.

- [ ] **Step 4: Keep backward compatibility call-sites**
Ensure legacy callers do not crash; convert or route through the new action.

- [ ] **Step 5: Commit**

```bash
git add src/store/useClinicStore.js src/lib/mockData.js src/lib/workingHours.js
git commit -m "feat: migrate working hours store model"
```

---

### Task 3: Build `/working-hours` Command Center Page

**Files:**
- Modify: `src/pages/WorkingHours.jsx`
- (Optional) Create: `src/components/working-hours/DayCard.jsx`
- (Optional) Create: `src/components/working-hours/DateOverrideRow.jsx`
- (Optional) Create: `src/components/working-hours/VisibilityPreviewCard.jsx`

- [ ] **Step 1: Build page skeleton**
Create header, command bar, responsive two-column layout, sticky save footer.

- [ ] **Step 2: Implement weekly schedule editor**
Per-day enable toggle + multiple slots:

```js
addSlot(day), updateSlot(day, slotId, patch), removeSlot(day, slotId), copyDayPattern(fromDay, toDay)
```

- [ ] **Step 3: Implement break blocks editor**
Add/remove breaks and tie validation to selected day slots.

- [ ] **Step 4: Implement date overrides editor**
Support two override types:
- closed day
- custom slots for a date

- [ ] **Step 5: Implement timezone selector + quick templates**
Presets (e.g., Mon–Fri 9–5, weekend closed) and bulk actions.

- [ ] **Step 6: Implement live visibility preview**
Use `resolveAvailabilityAt` for “Open now”, “Next opens”, and fallback message previews.

- [ ] **Step 7: Implement save/discard lifecycle**
Dirty tracking, inline errors, and toasts for success/failure states.

- [ ] **Step 8: Commit**

```bash
git add src/pages/WorkingHours.jsx src/components/working-hours
git commit -m "feat: add working hours command center page"
```

---

### Task 4: Make Clinic Settings a Summary Surface (No Duplicate Editor)

**Files:**
- Modify: `src/pages/ClinicSettings.jsx`

- [ ] **Step 1: Replace full in-tab hours editor**
Remove row-by-row editor controls from Clinic Settings Working Hours section.

- [ ] **Step 2: Add concise summary card**
Show timezone, weekly open hours, open days, and next upcoming override.

- [ ] **Step 3: Add deep-link CTA**
Primary button: “Open Working Hours Manager” -> `/working-hours`.

- [ ] **Step 4: Preserve visual consistency**
Follow existing card/typography/button patterns.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ClinicSettings.jsx
git commit -m "refactor: route working hours editing to dedicated page"
```

---

### Task 5: Validation, Accessibility, and Responsive Polish

**Files:**
- Modify: `src/pages/WorkingHours.jsx`
- Modify: `src/styles/globals.css` (only if utility classes are required)

- [ ] **Step 1: Surface actionable validation**
Show row-level and section-level errors, prevent save on invalid state.

- [ ] **Step 2: Add accessibility semantics**
Labels, `aria-live` for status updates, keyboard focus order for slot controls.

- [ ] **Step 3: Final responsive tuning**
Desktop split view, mobile stacked modules, always-visible save bar.

- [ ] **Step 4: Commit**

```bash
git add src/pages/WorkingHours.jsx src/styles/globals.css
git commit -m "feat: polish working hours usability and accessibility"
```

---

### Task 6: Verification and Release Readiness

**Files:**
- Modify: `src/pages/WorkingHours.jsx` (only if final fixes discovered)
- Modify: `src/pages/ClinicSettings.jsx` (only if final fixes discovered)

- [ ] **Step 1: Run lint**
Run: `npm run lint`  
Expected: no new lint errors from changed files.

- [ ] **Step 2: Run production build**
Run: `npm run build`  
Expected: Vite build succeeds and route bundle compiles.

- [ ] **Step 3: Execute manual QA matrix**
Check:
- create/edit/delete slots
- overlap/error states
- break validation
- date overrides
- timezone change impact on preview
- save/discard behavior persistence after reload
- migration from legacy persisted `workingHours` array to new config object
- dark mode visual correctness
- very narrow mobile viewport behavior (stacking + sticky save visibility)

- [ ] **Step 4: Final commit**

```bash
git add src/pages/WorkingHours.jsx src/pages/ClinicSettings.jsx src/store/useClinicStore.js src/lib/workingHours.js src/lib/mockData.js
git commit -m "feat: ship advanced working hours management"
```

---

## Notes for Implementers

- Keep file sizes manageable: if `WorkingHours.jsx` grows beyond readability, extract component files incrementally.
- Avoid introducing new dependencies unless a clear blocker appears.
- Preserve existing visual language (tokens, spacing, card borders, button hierarchy) to keep UX consistent across pages.

