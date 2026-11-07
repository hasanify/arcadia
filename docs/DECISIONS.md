# Arcadia — Architectural & Technical Decisions Log

## ADR-001: Pinned TypeScript Version (5.9.3)

- **Status**: Accepted (Phase 0)
- **Context**: Plan Assumption 1 posited `typescript@7.0.2`. During `npm install`, `typescript-eslint@8.72.1` strictly enforced its peer dependency of `typescript@">=4.8.4 <6.1.0"`, failing with `ERESOLVE`.
- **Decision**: Pinned TypeScript to `5.9.3` (the latest stable release satisfying `< 6.1.0`), as pre-authorized in Plan Section 2 and Section 16 Assumption 1 ("if peer-dependency errors appear, pin the newest 5.x and tell the user").
- **Impact**: Zero impact on modern ES2023 language features; full compatibility with ESLint, Vitest, and Vite.
