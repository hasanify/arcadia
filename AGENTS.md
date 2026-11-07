# Arcadia Workspace Guidelines & Rules

These guidelines are active for all agent interactions within the Arcadia workspace.

---

## 1. Git & Atomic Commits

- **Commit Atomically**: Every task, phase step, or cohesive set of changes must have its own atomic Git commit. Never bundle disparate features, refactors, or config changes into one giant commit.
- **Conventional Commits**: Format commit messages using conventional commits:
  - `feat: <description>` for new capabilities/features
  - `fix: <description>` for bug fixes
  - `refactor: <description>` for structural improvements
  - `test: <description>` for test additions or updates
  - `docs: <description>` for documentation changes
  - `chore: <description>` for build, tooling, and dependency tasks
- **Immediate Push**: Immediately push all commits to the remote `origin` (`git push origin <branch>`).
- **Clean Git State**: Keep working trees tidy. Do not track build artifacts, node_modules, or sensitive env files.

---

## 2. Documentation & README Maintenance

- **Continuous Documentation**: Whenever architecture, commands, configuration, sound engines, or UI components change, immediately update `README.md`.
- **Accuracy**: Keep feature matrices, controller support tables, and quickstart instructions synchronized with current working code.

---

## 3. UI Text & Copy Guidelines (`/antislop`)

Follow the core `/antislop` guidelines for all interface strings, labels, and copy:

- **No AI Slop / Filler**: Ban words like "revolutionary", "seamless", "effortless", "supercharge", "unleash", "elevate", "cutting-edge".
- **Authentic Music & Hardware Language**: Use established synthesizer and beat-machine vocabulary (Cutoff, Resonance, Attack, Decay, Sustain, Release, Transients, Choke Group, FM Ratio, Octave Shift, Quantize, BPM, Swing).
- **Concise & Direct**: Keep labels, tooltips, error messages, and dialog text brief, informative, and human. Avoid emoji spam on buttons, tabs, or headings.

<!-- antislop:start -->

## antislop

For UI, copy, people, mobile layout, or code comments work, read `skills/antislop/SKILL.md` (core) and then the skill for the task:

- UI / visual: `skills/antislop-ui/SKILL.md`
- Copy & text: `skills/antislop-copywriting/SKILL.md`
- People: `skills/antislop-human/SKILL.md`
- Mobile / responsive: `skills/antislop-layoutmobile/SKILL.md`
- Code comments: `skills/antislop-code/SKILL.md`
  antislop active: during (session override).

<!-- antislop:end -->

---

## 4. UI Design Guidelines (`/unslop`, `/design-taste-frontend`, `/impeccable`)

- **Hardware Aesthetic**: The UI represents a tactile dark hardware music workstation (DualSense & console gaming aesthetic fused with MPC, SP-404, OP-1, and Ableton Live).
- **Strict 4px Rhythm Grid**: Spacing, padding, and heights must be strictly multiples of 4 (4, 8, 12, 16, 20, 24, 32px). No odd, ungrounded arbitrary numbers.
- **Quiet Chrome & Deliberate Moments**: Keep surfaces, headers, panels, and borders subdued with tinted dark neutrals (graphite/ink). The richness and vibrant color live exclusively in active performance elements: orange active button triggers, illuminated pad indicators, dynamic level meters, and waveform slices.
- **No Slop Visual Tells**:
  - NO decorative gradients across cards or surfaces.
  - NO colored drop shadows or neon glows behind containers.
  - NO gradient text (`background-clip: text`).
  - NO decorative floating blobs or glassmorphism blurs.
  - NO tiny uppercase tracked eyebrows on every section (`01 / ABOUT`).
  - Hairline borders only: 6% to 10% opacity neutral borders.
- **Verified Contrast (WCAG AA)**: Body text and active labels must achieve ≥ 4.5:1 contrast against their backgrounds. Large text and badges must achieve ≥ 3:1.
- **High-Performance Direct DOM**: For high-rate 60 Hz pad and controller feedback (active button highlights, stick position dots, level meters), use direct DOM ref updates and `liveState` rather than React re-renders.

---

## 5. Engineering Standards

- **Strict TypeScript**: `noImplicitAny: true`, no `any` types. All domain models and types live in `src/core/types.ts` and have Zod runtime validation in `src/core/schemas.ts`.
- **Zero Allocations in Hot Paths**: The input loop (`gamepadManager.ts`) and audio tick callbacks must pre-allocate reusable state objects to prevent GC pauses.
- **Isolated Boundaries**:
  - `navigator.getGamepads()` is accessed strictly in `src/input/gamepadManager.ts`.
  - Web Audio / Tone.js nodes are created strictly in `src/audio/`.
  - Storage is strictly handled by `src/storage/`.
- **Test-Driven Verification**: Every phase must pass `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before completion.
