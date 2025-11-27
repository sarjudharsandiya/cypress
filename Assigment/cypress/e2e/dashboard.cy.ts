/**
 * AI-Generated E2E Test: OrangeHRM Dashboard
 * Tests cover: dashboard widgets, quick links, and data display
 */

describe('OrangeHRM Dashboard', () => {
  beforeEach(() => {
    // Login and navigate to dashboard
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type(Cypress.env('username'));
    cy.get('input[name="password"]').type(Cypress.env('password'));
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  describe('Dashboard Layout', () => {
    it('should display main dashboard components', () => {
      // AI Prompt: Verify dashboard structure
      cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');
      cy.get('.orangehrm-dashboard-grid').should('be.visible');
    });

    it('should display dashboard widgets', () => {
      cy.get('.orangehrm-dashboard-widget').should('have.length.at.least', 1);
    });

    it('should show time widget', () => {
      cy.contains('Time at Work').should('be.visible');
    });

    it('should show quick launch panel', () => {
      cy.get('.orangehrm-dashboard-widget').contains('Quick Launch').should('be.visible');
    });
  });

  describe('Widget Interactions', () => {
    it('should display employee distribution chart', () => {
      cy.get('.orangehrm-dashboard-widget').contains('Employee Distribution').should('be.visible');
    });

    it('should show leave requests if available', () => {
      cy.get('.orangehrm-dashboard-widget').then($widgets => {
        const hasLeaveWidget = [...$widgets].some(w => 
          w.textContent.includes('Leave')
        );
        
        if (hasLeaveWidget) {
          cy.contains('Leave').should('be.visible');
        }
      });
    });
  });

  describe('Quick Links', () => {
    it('should have functional quick launch icons', () => {
      cy.get('.orangehrm-quick-launch-icon').should('have.length.at.least', 1);
    });

    it('should navigate using quick launch', () => {
      // Try to click a quick launch button if available
      cy.get('.orangehrm-quick-launch').within(() => {
        cy.get('button').first().click();
      });
      
      // URL should change
      cy.url().should('not.include', '/dashboard/index');
    });
  });

  describe('Navigation', () => {
    it('should have accessible main menu', () => {
      cy.get('.oxd-main-menu').should('be.visible');
      cy.get('.oxd-main-menu-item').should('have.length.at.least', 5);
    });

    it('should navigate to different modules', () => {
      const modules = ['Admin', 'PIM', 'Leave', 'Time'];
      
      modules.forEach(module => {
        cy.get('.oxd-main-menu-item').contains(module).click();
        cy.url().should('include', module.toLowerCase());
        
        // Navigate back to dashboard
        cy.get('.oxd-main-menu-item').contains('Dashboard').click();
      });
    });

    it('should display user dropdown menu', () => {
      cy.get('.oxd-userdropdown-tab').click();
      cy.get('.oxd-dropdown-menu').should('be.visible');
      cy.contains('Logout').should('be.visible');
    });
  });

  describe('User Profile', () => {
    it('should show logged-in user name', () => {
      cy.get('.oxd-userdropdown-name').should('be.visible');
    });

    it('should access About page', () => {
      cy.get('.oxd-userdropdown-tab').click();
      cy.contains('About').click();
      
      cy.get('.oxd-dialog-sheet').should('be.visible');
      cy.contains('OrangeHRM').should('be.visible');
    });
  });

  describe('Logout', () => {
    it('should logout successfully', () => {
      // AI Prompt: Test logout functionality
      cy.get('.oxd-userdropdown-tab').click();
      cy.contains('Logout').click();
      
      // Should redirect to login page
      cy.url().should('include', '/auth/login');
      cy.get('input[name="username"]').should('be.visible');
    });

    it('should not access dashboard after logout', () => {
      // Logout
      cy.get('.oxd-userdropdown-tab').click();
      cy.contains('Logout').click();
      
      // Try to visit dashboard directly
      cy.visit('/web/index.php/dashboard/index');
      
      // Should redirect to login
      cy.url().should('include', '/auth/login');
    });
  });

  describe('Responsive Design', () => {
    it('should be mobile responsive', () => {
      // Test mobile viewport
      cy.viewport('iphone-x');
      cy.get('.oxd-topbar-header-breadcrumb').should('be.visible');
    });

    it('should be tablet responsive', () => {
      cy.viewport('ipad-2');
      cy.get('.orangehrm-dashboard-grid').should('be.visible');
    });
  });

  describe('Performance', () => {
    it('should load dashboard within acceptable time', () => {
      cy.visit('/web/index.php/auth/login', {
        onBeforeLoad(win) {
          win.performance.mark('dashboard-start');
        },
      });
      
      cy.get('input[name="username"]').type(Cypress.env('username'));
      cy.get('input[name="password"]').type(Cypress.env('password'));
      cy.get('button[type="submit"]').click();
      
      cy.get('.orangehrm-dashboard-grid').should('be.visible').then(() => {
        cy.window().then((win) => {
          win.performance.mark('dashboard-end');
          win.performance.measure('dashboard-load', 'dashboard-start', 'dashboard-end');
          const measure = win.performance.getEntriesByName('dashboard-load')[0];
          expect(measure.duration).to.be.lessThan(10000); // 10 seconds
        });
      });
    });
  });
});
