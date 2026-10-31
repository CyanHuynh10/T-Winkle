# Retained browser regression sources

The Manager UI uses the shared Thymeleaf/Bootstrap console and JavaScript modules
under `src/main/resources/static/js/console/`. Maven builds its production assets.

`tests/` and both Playwright configurations remain available. The historical demo
and cleanup suites have fixture-specific dataset and credential inputs. Never seed
or clean the approved live database to satisfy those historical assumptions.
The current five-role native suites are `tools/migration/browser.py` and
`tools/migration/browser.py flows`, run from the project root on an isolated copy.
`npm run test:css` checks shared console/chat stylesheet isolation.

Retired source and prior recovery material are preserved outside the repository.
