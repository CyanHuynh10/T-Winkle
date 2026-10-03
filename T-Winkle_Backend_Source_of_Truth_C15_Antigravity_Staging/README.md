# T-Winkle Backend Source-of-Truth Staging — C15

## Purpose
This is an integration staging package for the next Antigravity conversation. It is **not** a build/runtime-verified project and it does not commit or push anything.

## Authority
1. `T-Winkle_Backend_Canonical_Context_C15(1).txt` is the primary backend contract.
2. `gemini_backend(5).txt` is the historical source-generation transcript. It contains repeated/stale snapshots, so the last `COMPLETE` marker is not sufficient by itself.
3. `T-Winkle_Database_Sample.sql` is the SQL schema/data authority used to reconcile entity mappings.

## Folder layout
- `01_GEMINI_LATEST_COMPLETE_CANDIDATES/` — latest self-contained Gemini source blocks selected mechanically, useful for provenance and diffing.
- `02_CANONICAL_RECONCILED_SOURCE/` — staging source intended for Antigravity integration. Small stale entities and key cross-layer files are reconciled to C15/SQL; large files with partial later patches are merged into one coherent source.
- `03_MERGE_REQUIRED/` — files/dependencies that require explicit integration verification in the live project.
- `04_DO_NOT_INTEGRATE/` — stale duplicate source that must not be copied into the project.
- `source_manifest.csv` — source provenance/classification.

## Important
- No UI/CSS/JS changes are part of this staging package.
- No database schema changes are proposed.
- No new business rules are invented.
- `BUILD = NOT EXECUTED`.
- Antigravity must inspect the live project before writing files and must preserve approved UI baseline.
