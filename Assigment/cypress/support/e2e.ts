// ***********************************************************
// AI-Enhanced E2E Support File
// Global configuration and custom behaviors for Cypress tests
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import './commands';
import './reporter';

// Visual test tracking - Take screenshots at key moments
beforeEach(() => {
  // Log test start
  cy.log('🧪 Starting test: ' + Cypress.currentTest.title);
});

afterEach(function(this: Mocha.Context) {
  // Capture test result
  const testState = this.currentTest?.state;
  
  if (testState === 'failed') {
    cy.log('❌ Test failed: ' + this.currentTest?.title);
  } else if (testState === 'passed') {
    cy.log('✅ Test passed: ' + this.currentTest?.title);
  }
});