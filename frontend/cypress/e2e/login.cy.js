// describe('Login E2E Tests', () => {
//   beforeEach(() => {
//     cy.visit('/login/admin');
//   });

//   it('should display login form', () => {
//     cy.get('input[type="email"]').should('be.visible');
//     cy.get('input[type="password"]').should('be.visible');
//     cy.get('button[type="submit"]').should('be.visible');
//   });

//   it('should show validation errors for empty form', () => {
//     cy.get('button[type="submit"]').click();
//     cy.contains(/email is required/i).should('be.visible');
//   });

//   it('should show error for invalid credentials', () => {
//     cy.get('input[type="email"]').type('invalid@example.com');
//     cy.get('input[type="password"]').type('wrongpassword');
//     cy.get('button[type="submit"]').click();
    
//     // Wait for error message
//     cy.contains(/invalid credentials/i, { timeout: 5000 }).should('be.visible');
//   });

//   it('should successfully login with valid credentials', () => {
//     // Mock successful login
//     cy.intercept('POST', '**/api/employees/auth/login', {
//       statusCode: 200,
//       body: {
//         message: 'Login successful',
//         data: 'mock-token'
//       }
//     }).as('loginRequest');

//     cy.get('input[type="email"]').type('test@example.com');
//     cy.get('input[type="password"]').type('password123');
//     cy.get('button[type="submit"]').click();

//     cy.wait('@loginRequest');
//     // Add assertions for successful login redirect
//   });
// });



describe('Admin Login E2E Tests', () => {
  beforeEach(() => {
    // Visit the initial login selection page
    cy.visit('/login');

    // Go to Admin login page
    cy.contains('Log in as Admin').click();

    // Ensure we reached correct page
    cy.url().should('include', '/login/admin');
  });

  it('should display login form', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should prevent submission when form fields are empty', () => {
    cy.get('button[type="submit"]').click();

    // Check that the URL did not change → form did NOT submit
    cy.url().should('include', '/login/admin');

    // Confirm browser required validation is triggered
    cy.get('input[type="email"]')
      .then(($input) => {
        expect($input[0].validationMessage).to.not.be.empty;
      });
  });

  it('should prevent submission when password is empty', () => {
    cy.get('input[type="email"]').type('admin@example.com');
    cy.get('button[type="submit"]').click();

    // Check URL did not change
    cy.url().should('include', '/login/admin');

    // Validation on password field
    cy.get('input[type="password"]')
      .then(($input) => {
        expect($input[0].validationMessage).to.not.be.empty;
      });
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@nu.edu.pk');
    cy.get('input[type="password"]').type('wrongPassword1@');
    cy.get('button[type="submit"]').click();

    // Replace with the ACTUAL error your backend returns
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('input[type="email"]').type('k224586@nu.edu.pk');
    cy.get('input[type="password"]').type('Password@123');
    cy.get('button[type="submit"]').click();

    // Check dashboard
    cy.url().should('include', '/dashboard');

    // Optional UI check
    cy.contains('Dashboard').should('be.visible');
  });
});
