# Browser regression tooling

The Admin UI uses the shared Thymeleaf console layout and the JavaScript modules
under `src/main/resources/static/js/console/`. Maven packages the complete app.

This directory retains Playwright development dependencies for the current native
browser suites under `tools/migration/`. Run those suites from the repository root
against an isolated SQL Server copy. Node is not a production build prerequisite.

Retired source recovery archives are stored outside this repository.
