describe('Admin Employee Management (Real Backend)', () => {
    const adminEmail = 'k224586@nu.edu.pk';
    const adminPassword = 'Password@123';

    before(() => {
        // Custom login command
        cy.adminLogin();
    });

    it('should add a new employee', () => {
        const timestamp = Date.now();

        // Navigate to Employee List
        cy.get('nav').contains('Organization').click();
        cy.get('nav').contains('Employee List').click();
        cy.url().should('include', '/admin/organization/employee-list');

        // Click Add New Employee
        cy.get('button').contains('Add New Employee').click();
        cy.url().should('include', '/admin/add-new-employee');

        // Fill the form
        cy.get('#employee_first_name').type('TestFirst');
        cy.get('#employee_last_name').type('TestLast');
        cy.get('#email').type(`test${timestamp}@nu.edu.pk`);
        cy.get('#dob').type('1990-01-01');

        // Phone number input (react-phone-input-2)
        // Wait for the phone input wrapper
        cy.get('#phoneNumber', { timeout: 30000 }).should('be.visible');

        // Click to open the country dropdown
        cy.get('#phoneNumber')
            .find('.flag-dropdown')
            .click({ force: true });

        // Select the country (example: Pakistan)
        cy.get('#phoneNumber')
            .find('ul.country-list li[data-country-code="pk"]')
            .click({ force: true });

        // Now type the number
        cy.get('#phoneNumber')
            .find('input.form-control')
            .should('be.visible')
            .clear({ force: true })
            .type('923123456789', { force: true });


        // Select department and designation
        cy.get('#department_name').select(1); // first department
        cy.get('#designation_name').select(1); // first designation

        // Address fields
        cy.get('#street_address').type('Street 123');
        cy.get('#city').type('CityName');
        cy.get('#state').type('StateName');
        cy.get('#country').type('CountryName');
        cy.get('#zipCode').type('12345');

        // Status
        cy.get('#status').select('1');

        // Upload files
        cy.get('#idCardUpload').attachFile('IDCard.jpg');
        cy.get('#addressProofUpload').attachFile('AddressProof.png');

        // Submit form
        cy.get('button[type="submit"]').click();

        // Wait for toast success
        cy.contains('New employee added successfully', { timeout: 10000 }).should('be.visible');

        // Verify new employee appears in list
        cy.get('nav').contains('Organization').click();
        cy.get('nav').contains('Employee List').click();
        cy.get('.card-title').contains('TestFirst').should('be.visible');
    });
});
