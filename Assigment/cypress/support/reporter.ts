/**
 * Custom Cypress Reporter for Visual Test Results
 * Captures detailed information about test execution, failures, and flakes
 */

interface TestTime {
  start: number;
  end?: number;
  duration?: number;
  state?: string;
  attempts: number;
}

// Track test execution times
const testTimes: Record<string, TestTime> = {};
let currentTest: string | null = null;

// Capture test start time
Cypress.on('test:before:run', (test: Mocha.Test) => {
  currentTest = test.title;
  testTimes[test.title] = {
    start: Date.now(),
    attempts: 0,
  };
});

// Capture test results
Cypress.on('test:after:run', (test: Mocha.Test, runnable: Mocha.Runnable) => {
  const testName = test.title;
  const fullTestTitle = runnable.titlePath().join(' > ');
  
  if (testTimes[testName]) {
    testTimes[testName].end = Date.now();
    testTimes[testName].duration = testTimes[testName].end - testTimes[testName].start;
    testTimes[testName].state = test.state;
    testTimes[testName].attempts++;
    
    // Record test attempt for flaky detection
    cy.task('recordTestAttempt', {
      testTitle: fullTestTitle,
      attempt: testTimes[testName].attempts,
      state: test.state
    });
    
    // Log test result with emoji
    const emoji = test.state === 'passed' ? '✅' : 
                  test.state === 'failed' ? '❌' : 
                  test.state === 'pending' ? '⏭️' : '⚠️';
    
    const duration = Math.round(testTimes[testName].duration!);
    const attemptInfo = testTimes[testName].attempts > 1 ? 
                        ` (attempt ${testTimes[testName].attempts})` : '';
    
    cy.task('log', `${emoji} ${testName} - ${duration}ms${attemptInfo}`);
    
    // Detect slow tests (>5 seconds)
    if (duration > 5000 && test.state === 'passed') {
      cy.task('log', `⚠️  SLOW TEST: ${testName} took ${duration}ms`);
    }
    
    // Log flaky test detection with count
    if (testTimes[testName].attempts > 1 && test.state === 'passed') {
      const flakyCount = testTimes[testName].attempts - 1;
      cy.task('log', `🔄 FLAKY TEST: ${testName} passed after ${testTimes[testName].attempts} attempts (Flaky Count: ${flakyCount})`);
    }
    
    // Log final failure after all retries
    if (test.state === 'failed' && testTimes[testName].attempts >= 2) {
      cy.task('log', `💀 PERMANENTLY FAILED: ${testName} failed ${testTimes[testName].attempts} times - Check video for details`);
    }
  }
  
  // Take screenshot on failure (optional, video is primary)
  if (test.state === 'failed') {
    const screenshotName = `FAILED-Attempt${testTimes[testName].attempts}-${test.parent!.title}-${test.title}`.replace(/[^a-z0-9]/gi, '_');
    cy.screenshot(screenshotName, { capture: 'fullPage' });
  }
});

// Log failures with stack trace
Cypress.on('fail', (error: Error, runnable: Mocha.Runnable) => {
  cy.task('log', '\n❌ TEST FAILURE DETAILS:');
  cy.task('log', `Test: ${runnable.title}`);
  cy.task('log', `Error: ${error.message}`);
  cy.task('log', `Stack: ${error.stack}`);
  
  throw error; // Re-throw to preserve Cypress behavior
});

// Export test times for analysis and save flaky report
after(() => {
  cy.task('log', '\n📊 Test Execution Summary:');
  cy.task('log', JSON.stringify(testTimes, null, 2));
  
  // Save flaky test report
  cy.task('saveFlakyReport');
});
