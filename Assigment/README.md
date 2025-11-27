# OrangeHRM Cypress E2E Testing Suite

Complete Cypress E2E testing solution for OrangeHRM with CI/CD integration and visual test reporting.

## 🎯 Features

- ✅ **Full TypeScript** - Type-safe test code
- ✅ Comprehensive E2E tests for OrangeHRM demo site
- ✅ Visual test reporting with videos and screenshots
- ✅ Flaky test detection with retry mechanism (2 attempts max)
- ✅ GitHub Actions CI/CD integration
- ✅ Cypress Cloud dashboard integration
- ✅ Detailed error reporting with stack traces
- ✅ Parallel test execution in CI (2 containers)
- ✅ Custom typed commands and utilities

## 📋 Test Coverage

### Login Tests (`cypress/e2e/login.cy.ts`)
- Login page rendering and accessibility
- Successful login flow
- Failed login scenarios
- Form validation
- Session persistence

### Dashboard Tests (`cypress/e2e/dashboard.cy.ts`)
- Dashboard widgets display
- Quick launch menu
- Main menu navigation
- User profile dropdown
- Logout functionality

### Employee Management Tests (`cypress/e2e/employee-management.cy.ts`)
- Employee list display
- Search functionality
- Add new employee
- Edit employee details
- Delete employee
- Pagination
- Accessibility features

### Visual Testing Demo (`cypress/e2e/visual-test-demo.cy.ts`)
- Screenshot capture at key steps
- Failure state documentation
- Performance measurement


### Prerequisites

- Node.js 20+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running Tests

```bash
# Interactive mode (Cypress UI)
npm run test:e2e

# Headless mode (terminal)
npm run test:e2e:headless

# With Cypress Cloud recording
npm run test:e2e:record
```

## 📹 Test Reports

After running tests, find:

- **Videos:** `cypress/videos/` - Full test execution recordings
- **Screenshots:** `cypress/screenshots/` - Failure screenshots  
- **Flaky Report:** `cypress/flaky-tests-report.json` - Detailed flaky test data

### Viewing Reports

```bash
# Open videos folder
open cypress/videos/

# Open screenshots folder
open cypress/screenshots/

# View flaky test report (requires jq)
cat cypress/flaky-tests-report.json | jq
```

## 🔄 Flaky Test Detection

Tests automatically retry once if they fail:
- **Attempt 1:** Initial run
- **Attempt 2:** Retry if failed
- **Result:** Marked as "flaky" if passes on retry

Flaky tests are tracked in:
- Console output (during test run)
- `cypress/flaky-tests-report.json`
- Cypress Cloud dashboard

### Console Output Example

```
⚠️ FLAKY TESTS (Passed after retry):
──────────────────────────────────────────────────
  Test: Employee Management > should search by name
  Total Attempts: 2
  Failed Attempts: 1
  Flaky Count: 1
  First Failure: Timed out retrying after 10000ms
  📹 Video: /path/to/video.mp4
```

## 🎥 CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop`
- Manual trigger from Actions tab

### Setup

1. **Push code to GitHub**

2. **Add Cypress Record Key** (for Cloud recording):
   - Go to **Settings → Secrets and variables → Actions**
   - Click **New repository secret**
   - Name: `CYPRESS_RECORD_KEY`
   - Value: `ef5d2dec-f1c7-4d6d-8a73-2fa612b08fb4`
   - Click **Add secret**

3. **Tests will run automatically** on next push

### CI Features

- ✅ Parallel execution (2 containers)
- ✅ Auto-retry on failure (2 attempts)
- ✅ Video recording
- ✅ Screenshot capture
- ✅ Flaky test detection
- ✅ Artifact uploads (videos, screenshots, reports)
- ✅ PR comments with test results

### Downloading Artifacts

After each CI run:

1. Go to repository **Actions** tab
2. Click on workflow run
3. Scroll to **Artifacts** section
4. Download:
   - `cypress-videos`
   - `cypress-screenshots`
   - `flaky-tests-report`

## 🌐 Cypress Cloud Dashboard

View detailed test analytics at: **https://cloud.cypress.io**

**Project ID:** `ruevju`

### Features

- 📊 Test run history and trends
- 📹 Video playback for every test
- 🔄 Flaky test detection over time
- ⚡ Test duration analytics
- 📈 Pass/fail rate trends
- 🎯 Parallel execution insights

## 📁 Project Structure

```
Assigment/
├── cypress/
│   ├── e2e/                          # Test files (TypeScript)
│   │   ├── login.cy.ts
│   │   ├── dashboard.cy.ts
│   │   ├── employee-management.cy.ts
│   │   └── visual-test-demo.cy.ts
│   ├── support/                      # Support files (TypeScript)
│   │   ├── commands.ts               # Custom commands
│   │   ├── e2e.ts                    # Global config
│   │   └── reporter.ts               # Test reporter
│   ├── videos/                       # Test videos (auto-generated)
│   ├── screenshots/                  # Failure screenshots (auto-generated)
│   ├── flaky-tests-report.json       # Flaky test data (auto-generated)
│   └── tsconfig.json                 # TypeScript config
├── .github/
│   └── workflows/
│       └── cypress-tests.yml         # CI/CD workflow
├── cypress.config.js                 # Cypress configuration
├── package.json                      # Dependencies
└── README.md                         # This file
```

## 🛠️ Custom Cypress Commands (TypeScript)

Located in `cypress/support/commands.ts`:

```typescript
// Login helper with type safety
cy.login(username: string, password: string)

// Logout helper
cy.logout()

// Wait for page load
cy.waitForPageLoad()
```

All commands are fully typed for IntelliSense support!

## 📊 Test Configuration

### Retry Strategy

```javascript
retries: {
  runMode: 1,    // 1 retry = 2 total attempts
  openMode: 0,   // No retries in interactive mode
}
```

### Timeouts

- Command timeout: 10 seconds
- Page load timeout: 30 seconds
- Request timeout: 10 seconds

## 🐛 Debugging

### Local Debugging

```bash
# Open Cypress UI for step-through debugging
npm run test:e2e

# Run specific test file
npx cypress run --spec "cypress/e2e/login.cy.js"

# Run with headed browser
npx cypress run --headed --browser chrome

# Run single test by name
npx cypress run --spec "cypress/e2e/login.cy.js" --grep "should login with valid credentials"
```

### Video Debugging

1. Run tests in headless mode
2. Open video from `cypress/videos/`
3. Watch test execution
4. Identify failure point
5. Check screenshots in `cypress/screenshots/`

### CI Debugging

1. Check GitHub Actions logs
2. Download video artifacts
3. Download screenshot artifacts
4. Review flaky test report
5. Check Cypress Cloud dashboard

## 📈 Test Metrics

Monitor these metrics to ensure test quality:

| Metric | Target | Status |
|--------|--------|--------|
| Pass rate (first attempt) | 100% | 🎯 |
| Flaky count | 0 | ⚠️ |
| Test duration (avg) | < 5s | ✅ |
| Coverage | All critical paths | ✅ |

## 🎯 Best Practices

1. **Wait for elements** - Use `.should()` instead of `cy.wait()`
2. **Use data attributes** - Prefer `data-cy` selectors over classes
3. **Avoid test interdependence** - Each test should be independent
4. **Clean up after tests** - Reset state in `afterEach()`
5. **Use custom commands** - Reuse common actions
6. **Handle async operations** - Use `cy.intercept()` and `.wait()`
7. **Take screenshots** - Use `cy.screenshot()` at key steps
8. **Descriptive test names** - Clear, actionable test descriptions


## 🎉 Quick Commands Reference

```bash
# Install dependencies
npm install

# Run tests interactively
npm run test:e2e

# Run tests in headless mode
npm run test:e2e:headless

# Run with cloud recording
npm run test:e2e:record

# Run specific test file
npx cypress run --spec "cypress/e2e/login.cy.js"

# Open videos folder
open cypress/videos/

# Open screenshots folder
open cypress/screenshots/

# View flaky test report
cat cypress/flaky-tests-report.json

# Clean up test artifacts
rm -rf cypress/videos/* cypress/screenshots/*
```

---

**Target:** OrangeHRM Demo Site  
**URL:** https://opensource-demo.orangehrmlive.com  
**Credentials:** Username: `Admin` | Password: `admin123`

---

