/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test when there are errors in
    // cross-site scripts
    return false
  })
  
  describe('example to-do app', () => {  
    it('changes the data plan', () => {
      cy.visit("http://www.paygonline.com", {
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_5_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15',
      }
    });
    cy.visit('https://www.paygonline.com/'); // Visit homepage
    cy.get('#login-phone-phone-number').click();
    cy.get('#login-phone-phone-number').type(Cypress.env('CY_USERNAME'));
    cy.get('#login-pin-pin-number').click();
    cy.get('#login-pin-pin-number').type(Cypress.env('CY_PASSWORD'));
    cy.get('#login-form_0').click(); // Submit login
    cy.url().should('contains', 'https://www.paygonline.com/websc/home.html'); // We should be on the main page now

    cy.get('ul:nth-child(1) > li:nth-child(3) > .showLoader > span').click(); // Get the Plans link
    cy.url().should('contains', 'https://www.paygonline.com/websc/rateplans.html'); // We should be on the rate plans page
    cy.get('#savechanges').click() // This will select the first plan in the list. It doesn't matter what it is, because we're chaning it back to the original later.
    cy.url().should('contains', 'https://www.paygonline.com/websc/changePlanConfirm.html');
    cy.get('#savechanges').click() // This will confirm the rate change

    cy.visit('https://www.paygonline.com/'); // Go back to the homepage
    cy.url().should('contains', 'https://www.paygonline.com/websc/home.html'); // We should be on the main page now
    cy.get('ul:nth-child(1) > li:nth-child(3) > .showLoader > span').click(); // Get the Plans link
    cy.url().should('contains', 'https://www.paygonline.com/websc/rateplans.html'); // We should be on the rate plans page
    cy.get('#savechanges').click() // This will select the first plan in the list, which should be the original plan. This is an assumption but is checked later
    cy.url().should('contains', 'https://www.paygonline.com/websc/changePlanConfirm.html');
    cy.get('#savechanges').click() // This will confirm the rate change
    cy.get('#switch-summary')
      .find('p').contains('Your plan has been changed to the $55-100GB Mo Mobile Hotspot/Tablet Plan.')
    cy.get('#refill_0').click()
    cy.get('#refillCardAmountButton').click() // Click Continue on the payment screen
    cy.get('.total-price').contains('$55.00')
    cy.get('button').contains('Continue').click()
    cy.get('#refillCardAmountButton', { timeout: 3000 }).click({ force: true })
    cy.get('#success > .tile')
      .should("exist")
    cy.visit('https://www.paygonline.com/'); // Visit homepage
  })
})