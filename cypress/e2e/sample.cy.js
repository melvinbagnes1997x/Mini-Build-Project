// sample.cy.js
// Basic Cypress E2E test for homepage

describe('Homepage', () => {
  it('should load the homepage and display the correct title', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Task'); // Adjust this to match a visible word on your homepage
  });
}); 