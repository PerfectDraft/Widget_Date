# Agent Infrastructure Changelog

All notable changes to the `.agent/` directory (rules, workflows, scripts, and skills) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for major structural changes.

## [Unreleased]

### Added
- Created `CHANGELOG.md` to track `.agent/` infrastructure changes.
- Split `GEMINI.md` into `GEMINI-routing.md` and `GEMINI-scripts.md` to reduce token bloat.
- Added `Token Budget Rule` to `GEMINI.md`.
- Added `Rollback Protocol` to `autonomous-policy.md`.
- Added Fallback configuration when `verify_all.py` fails in `autonomous.md`.
- Added `Progress Tracking Format` and `Session ID format` to `autonomous-policy.md`.
- Added `Socratic Gate Override` and `Hard Stop #7` to `autonomous-policy.md`.

### Changed
- Centralized all autonomous rules into `autonomous-policy.md`.
- Refactored `autonomous.md` to reference `autonomous-policy.md` instead of duplicating rules.
- Consolidated disparate autonomous logs into the root `AUTONOMOUS_LOG.md`.

### Removed
- Removed duplicated autonomous rules from `autonomous.md` and `GEMINI.md`.
