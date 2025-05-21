describe("Sign In Page", () => {
  it("renders the sign in form", () => {
    cy.visit("/sign-in");
    cy.contains("Login").should("exist");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get("button").contains("Login").should("exist");
  });

  it("shows validation error if fields are empty", () => {
    cy.visit("/sign-in");
    cy.get("button").contains("Login").click();
    cy.get('input[name="email"]').then(($input) => {
      expect($input[0].validationMessage).to.exist;
    });
  });

  it("shows error on invalid user", () => {
    cy.visit("/sign-in");
    cy.get('input[name="email"]').type("notfound@example.com");
    cy.get('input[name="password"]').type("asdasdasdasdasd");
    cy.get("button").contains("Login").click();
    cy.contains("Invalid").should("exist"); // Adjust to match your app's error message
  });

  it("logs in with valid user and redirects to /account", () => {
    cy.visit("/sign-in");
    cy.get('input[name="email"]').type("fa3b19e937@emaily.pro");
    cy.get('input[name="password"]').type("fa3b19e937@emaily.pro");
    cy.get("button").contains("Login").click();
    cy.location("pathname", { timeout: 10000 }).should("eq", "/account");
    cy.get('[id="user"]').should("exist").click();
    cy.get("button").contains("Logout").should("exist");
  });

  // You can add more tests for successful/failed login if you mock the backend or API
});
