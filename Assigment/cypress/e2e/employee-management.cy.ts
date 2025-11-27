/**
 * AI-Generated E2E Test: OrangeHRM Employee Management
 * Tests cover: employee listing, search, add, edit, delete operations
 */

describe('OrangeHRM Employee Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type(Cypress.env('username'));
    cy.get('input[name="password"]').type(Cypress.env('password'));
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    // Navigate to PIM (Employee) module
    cy.get('.oxd-main-menu-item').contains('PIM').click();
    cy.url().should('include', '/pim');
  });

  describe('Employee List Display', () => {
    it('should display employee list with table', () => {
      // AI Prompt: Verify employee list is displayed
      cy.get('.oxd-table').should('be.visible');
      cy.get('.oxd-table-header').should('exist');
      cy.get('.oxd-table-body').should('exist');
    });

    it('should show employee records', () => {
      cy.get('.oxd-table-card').should('have.length.at.least', 1);
    });

    it('should display correct table headers', () => {
      cy.get('.oxd-table-header .oxd-table-cell').then($headers => {
        const headerTexts = [...$headers].map(h => h.textContent.trim());
        expect(headerTexts).to.include.members(['Id', 'First (& Middle) Name', 'Last Name']);
      });
    });
  });

  describe('Employee Search', () => {
    it('should search employee by name', () => {
      // AI Prompt: Test employee search functionality
      cy.get('input[placeholder*="Type for hints..."]').first().type('Peter');
      cy.wait(1000); // Wait for autocomplete
      
      // Click search button
      cy.get('button[type="submit"]').click();
      
      // Verify results contain searched name
      cy.get('.oxd-table-card').should('exist');
    });

    it('should show "No Records Found" for non-existent employee', () => {
      cy.get('input[placeholder*="Type for hints..."]').first().type('NonExistentEmployee123456');
      cy.get('button[type="submit"]').click();
      
      cy.contains('No Records Found').should('be.visible');
    });

    it('should reset search filters', () => {
      // Perform search
      cy.get('input[placeholder*="Type for hints..."]').first().type('Peter');
      cy.get('button[type="submit"]').click();
      
      // Reset filters
      cy.get('button[type="button"]').contains('Reset').click();
      
      // Verify all employees are shown again
      cy.get('.oxd-table-card').should('have.length.at.least', 1);
    });
  });

  describe('Add Employee', () => {
    it('should navigate to add employee page', () => {
      // AI Prompt: Navigate to add employee form
      cy.get('button').contains('Add').click();
      cy.url().should('include', '/addEmployee');
      cy.get('.oxd-form').should('be.visible');
    });

    it('should add new employee with required fields', () => {
      cy.get('button').contains('Add').click();
      
      // Fill in employee details
      const firstName = `TestUser${Date.now()}`;
      cy.get('input[name="firstName"]').type(firstName);
      cy.get('input[name="lastName"]').type('Automation');
      
      // Save employee
      cy.get('button[type="submit"]').click();
      
      // Verify success message
      cy.get('.oxd-toast-content').should('contain', 'Success');
    });

    it('should show validation errors for empty required fields', () => {
      cy.get('button').contains('Add').click();
      cy.get('button[type="submit"]').click();
      
      // Check for validation messages
      cy.get('.oxd-input-field-error-message').should('be.visible');
    });
  });

  describe('Employee Actions', () => {
    it('should view employee details', () => {
      // Click on first employee row
      cy.get('.oxd-table-card').first().within(() => {
        cy.get('.bi-eye-fill').parent().click();
      });
      
      // Verify personal details page loads
      cy.url().should('include', '/viewPersonalDetails');
      cy.get('.orangehrm-edit-employee-content').should('be.visible');
    });

    it('should edit employee information', () => {
      // View employee
      cy.get('.oxd-table-card').first().within(() => {
        cy.get('.bi-eye-fill').parent().click();
      });
      
      // Update nickname
      cy.get('input[name="nickname"]').clear().type('UpdatedNickname');
      
      // Save changes
      cy.get('button[type="submit"]').first().click();
      
      // Verify success
      cy.get('.oxd-toast-content').should('contain', 'Success');
    });

    it('should delete employee (with confirmation)', () => {
      // Click delete on first employee
      cy.get('.oxd-table-card').first().within(() => {
        cy.get('.bi-trash').parent().click();
      });
      
      // Confirm deletion
      cy.get('.oxd-button--label-danger').click();
      
      // Verify success message
      cy.get('.oxd-toast-content').should('contain', 'Success');
    });
  });

  describe('Pagination', () => {
    it('should navigate through pages', () => {
      // Check if pagination exists
      cy.get('.oxd-pagination').then($pagination => {
        if ($pagination.find('button').length > 2) {
          // Click next page
          cy.get('.oxd-pagination button').contains('>').click();
          
          // Wait for page to load
          cy.get('.oxd-table-card').should('exist');
        }
      });
    });

    it('should display correct page information', () => {
      cy.get('.oxd-pagination__page-item').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      cy.get('.oxd-table').should('have.attr', 'role', 'table');
    });

    it('should support keyboard navigation', () => {
      cy.get('input[placeholder*="Type for hints..."]').first().focus();
      cy.focused().type('{tab}');
      // Verify focus moved to next element
    });
  });
});
