# Agent Infrastructure Changelog

All notable changes to the `.agent/` directory will be documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [Unreleased]
### Added
### Changed
### Removed

***

## [2026-05-01] — Infrastructure Refactor v1.0

### Added
- `CHANGELOG.md` — track agent infrastructure changes
- `GEMINI-routing.md` — extracted routing rules from GEMINI.md
- `GEMINI-scripts.md` — extracted scripts protocol from GEMINI.md
- `Token Budget Rule` — added to GEMINI.md with 20KB cap and priority order
- `Rollback Protocol` — added to autonomous-policy.md
- `Socratic Gate Override` — added to autonomous-policy.md
- `Hard Stop #6 (Rollback)` — added to autonomous-policy.md
- `Progress Tracking Format` — schema added to autonomous-policy.md
- `Session ID numbering` — format defined in autonomous-policy.md
- `No Mixed Commits rule` — added to autonomous-policy.md
- `Commit Discipline section` — added to autonomous-policy.md
- `Session Scope Declaration` — mandatory declaration before autonomous runs
- Vietnamese triggers to `GEMINI-scripts.md`

### Changed
- `GEMINI.md` title: "Antigravity Kit" → "Widget Date"
- `GEMINI.md` — removed routing and scripts sections, now references split files
- `autonomous.md` — removed duplicate rules, references autonomous-policy.md
- `autonomous-policy.md` — centralized all policy, added multiple new sections
- `ARCHITECTURE.md` — updated to reflect new file structure
- Merged duplicate Hard Stop #6 and #7 in `autonomous-policy.md` (renumbered 1-6)

### Removed
- Duplicate autonomous rules from `autonomous.md`
- Turkish-language triggers from GEMINI scripts section
- Hard Stop duplicate (#6 merged into #7, re-numbered)

