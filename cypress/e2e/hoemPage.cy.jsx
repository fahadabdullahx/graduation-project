describe("Home Page", () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit("/");
  });

  it("shows the main heading", () => {
    cy.contains("Share rides, save money, reduce emissions").should("exist");
  });

  it("shows all feature titles", () => {
    cy.contains("Connect with Travelers").should("exist");
    cy.contains("Safe & Secure").should("exist");
    cy.contains("Flexible Schedule").should("exist");
  });

  it("shows the join button and link", () => {
    cy.contains("Join Our Now").should("exist");
    cy.get('a[href="/sign-up"]').should("exist");
  });

  it("renders the SearchForm component", () => {
    cy.get("form[action='/search']").should("exist");
  });

  it("shows all SearchForm form inputs", () => {
    // From input
    cy.get('label[for="from"]').should("contain", "From");
    cy.get('input[name="from"]').should("exist");
    // To input
    cy.get('label[for="to"]').should("contain", "To");
    cy.get('input[name="to"]').should("exist");
    // Date input
    cy.get('label[for="date"]').should("contain", "Date");
    cy.get('input[name="date"]').should("exist");
    // Gender select
    cy.get('label[for="gender"]').should("contain", "Driver Gender");
    cy.get("button#gender").should("exist");
    // Submit button
    cy.get("button")
      .contains(/SEARCH/i)
      .should("exist");
  });
});
