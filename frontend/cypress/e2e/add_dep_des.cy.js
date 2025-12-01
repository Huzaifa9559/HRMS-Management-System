describe('Create Department and Add Designation', () => {
    const departmentName = `Test Department ${Date.now()}`;
    const designationName = `Test Designation ${Date.now()}`;

    beforeEach(() => {
        // Visit Departments page
        cy.adminLogin();
        cy.get('nav').contains('Organization').click();
        cy.get('nav').contains('Departments').click();
        cy.url().should('include', '/admin/organization/departments');

        // Wait for the page to load
        cy.get('h4').contains('Departments', { timeout: 10000 }).should('be.visible');
    });

    it('Create a department and add a designation', () => {
        // 1️⃣ Create new department
        cy.get('button').contains('Create Department').click();

        // Type department name
        cy.get('input[placeholder="Enter department name"]').type(departmentName);

        // Click Create button
        cy.get('.modal')
            .find('button')
            .contains('Create')
            .click();
        // Confirm success toast
        cy.get('.Toastify__toast-body').should(
            'contain.text',
            `Department "${departmentName}" created successfully!`
        );

        // Ensure modal is closed
        cy.get('.modal').should('not.exist');

        // 2️⃣ Open the newly created department
        cy.contains('.hover-card h5', departmentName)
            .parents('.hover-card')
            .within(() => {
                cy.get('div').contains('⋮').click();
            });

        // Click "View & Edit"
        cy.get('ul li').contains('View & Edit').click();

        // Wait for department page
        cy.url().should('include', '/admin/organization/view-departments');
        cy.get('h4').should('contain.text', departmentName);

        // 3️⃣ Create new designation
        cy.get('button').contains('Create Designation').click();

        // Type designation name
        cy.get('input[placeholder="Enter designation name"]').type(designationName);

        // Click Create
        cy.get('.modal')
            .find('button')
            .contains('Create')
            .click();
        // Confirm success toast
        cy.get('.Toastify__toast-body').should(
            'contain.text',
            `Designation "${designationName}" created successfully!`
        );

        // Ensure modal is closed
        cy.get('.modal').should('not.exist');

        // Verify designation appears in the table
        cy.get('table tbody').contains('td', designationName).should('exist');
    });
});
