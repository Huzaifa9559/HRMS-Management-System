// Custom Cypress commands

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
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

