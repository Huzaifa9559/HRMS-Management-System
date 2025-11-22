describe('Login E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show validation errors for empty form', () => {
    cy.get('button[type="submit"]').click();
    cy.contains(/email is required/i).should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Wait for error message
    cy.contains(/invalid credentials/i, { timeout: 5000 }).should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    // Mock successful login
    cy.intercept('POST', '**/api/employees/auth/login', {
      statusCode: 200,
      body: {
        message: 'Login successful',
        data: 'mock-token'
      }
    }).as('loginRequest');

    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    // Add assertions for successful login redirect
  });
});

