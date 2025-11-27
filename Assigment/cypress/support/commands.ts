/// <reference types="cypress" />

/**
 * Custom Cypress Commands for OrangeHRM Testing
 * These commands provide reusable helpers for common test actions
 */

// Declare custom command types
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login to OrangeHRM
       * @param username - Username for login
       * @param password - Password for login
       * @example cy.login('Admin', 'admin123')
       */
      login(username: string, password: string): Chainable<void>;
      
      /**
       * Custom command to logout from OrangeHRM
       * @example cy.logout()
       */
      logout(): Chainable<void>;
      
      /**
       * Custom command to wait for page to be fully loaded
       * @example cy.waitForPageLoad()
       */
      waitForPageLoad(): Chainable<void>;
    }
  }
}

/**
 * Login Command
 * Navigates to login page and authenticates user
 */
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/web/index.php/auth/login');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

/**
 * Logout Command
 * Logs out the current user
 */
Cypress.Commands.add('logout', () => {
  cy.get('.oxd-userdropdown').click();
  cy.get('a[href="/web/index.php/auth/logout"]').click();
  cy.url().should('include', '/auth/login');
});

/**
 * Wait for Page Load Command
 * Waits for page to be fully loaded and interactive
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.window().should('have.property', 'document.readyState', 'complete');
  cy.get('body').should('be.visible');
});

export {};
