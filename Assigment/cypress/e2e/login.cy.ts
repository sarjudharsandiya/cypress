/**
 * AI-Generated E2E Test: OrangeHRM Login Flow
 * Tests cover: successful login, failed login, validation, and accessibility
 */

describe('OrangeHRM Login Flow', () => {
  beforeEach(() => {
    cy.visit('/web/index.php/auth/login');
  });

  describe('Login Page Rendering', () => {
    it('should display login form with all required elements', () => {
      // AI Prompt: Verify all login page elements are visible
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible').and('contain', 'Login');
      
      // Check for OrangeHRM branding
      cy.get('.orangehrm-login-branding').should('be.visible');
    });

    it('should have proper accessibility attributes', () => {
      // AI Prompt: Check form accessibility
      cy.get('input[name="username"]').should('have.attr', 'placeholder');
      cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    });
  });

  describe('Successful Login', () => {
    it('should login with valid credentials and redirect to dashboard', () => {
      // AI Prompt: Test successful login flow
      cy.get('input[name="username"]').type(Cypress.env('username'));
      cy.get('input[name="password"]').type(Cypress.env('password'));
      cy.get('button[type="submit"]').click();
      
      // Verify redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');
    });

    it('should persist session after page reload', () => {
      // Login first
      cy.get('input[name="username"]').type(Cypress.env('username'));
      cy.get('input[name="password"]').type(Cypress.env('password'));
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
      
      // Reload and check if still logged in
      cy.reload();
      cy.url().should('include', '/dashboard');
    });
  });

  describe('Failed Login', () => {
    it('should show error message with invalid credentials', () => {
      // AI Prompt: Test login failure scenario
      cy.get('input[name="username"]').type('invaliduser');
      cy.get('input[name="password"]').type('invalidpass');
      cy.get('button[type="submit"]').click();
      
      // Verify error message
      cy.get('.oxd-alert-content').should('be.visible')
        .and('contain', 'Invalid credentials');
    });

    it('should show error with empty username', () => {
      cy.get('input[name="password"]').type('somepassword');
      cy.get('button[type="submit"]').click();
      
      // Check for validation error
      cy.get('.oxd-input-field-error-message').should('be.visible');
    });

    it('should show error with empty password', () => {
      cy.get('input[name="username"]').type('someuser');
      cy.get('button[type="submit"]').click();
      
      // Check for validation error
      cy.get('.oxd-input-field-error-message').should('be.visible');
    });
  });

  describe('Form Validation', () => {
    it('should not submit form with empty fields', () => {
      cy.get('button[type="submit"]').click();
      
      // Should show validation errors for both fields
      cy.get('.oxd-input-field-error-message').should('have.length.at.least', 1);
    });

    it('should clear error message on retry', () => {
      // First attempt with wrong credentials
      cy.get('input[name="username"]').type('wrong');
      cy.get('input[name="password"]').type('wrong');
      cy.get('button[type="submit"]').click();
      cy.get('.oxd-alert-content').should('be.visible');
      
      // Retry with correct credentials
      cy.get('input[name="username"]').clear().type(Cypress.env('username'));
      cy.get('input[name="password"]').clear().type(Cypress.env('password'));
      cy.get('button[type="submit"]').click();
      
      // Error should disappear
      cy.get('.oxd-alert-content').should('not.exist');
      cy.url().should('include', '/dashboard');
    });
  });

  describe('Performance', () => {
    it('should load login page within acceptable time', () => {
      // AI Prompt: Check page load performance
      cy.visit('/web/index.php/auth/login', {
        onBeforeLoad(win) {
          win.performance.mark('page-load-start');
        },
      });
      
      cy.get('input[name="username"]').should('be.visible').then(() => {
        cy.window().then((win) => {
          win.performance.mark('page-load-end');
          win.performance.measure('page-load', 'page-load-start', 'page-load-end');
          const measure = win.performance.getEntriesByName('page-load')[0];
          expect(measure.duration).to.be.lessThan(5000); // 5 seconds
        });
      });
    });
  });
});
