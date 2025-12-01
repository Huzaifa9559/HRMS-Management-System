// Custom Cypress commands
import 'cypress-file-upload';

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login/admin');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('loginAsAdmin', () => {
  cy.login('k224586@nu.edu.pk', 'Password@123');
});

Cypress.Commands.add('loginAsEmployee', (email = 'employee@example.com', password = 'password123') => {
  cy.login(email, password);
});

// In cypress/support/commands.js
Cypress.Commands.add('adminLogin', () => {
  cy.visit('/login');
  cy.contains('Log in as Admin').click();
  cy.get('input[type="email"]').type('k224586@nu.edu.pk');
  cy.get('input[type="password"]').type('Password@123');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

