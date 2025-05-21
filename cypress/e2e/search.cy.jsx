describe("Search Page", () => {
  it("renders the search form and results", () => {
    cy.visit("/search");
    cy.contains("From").should("exist");
    cy.contains("To").should("exist");
    cy.get('input[name="from"]').should("exist");
    cy.get('input[name="to"]').should("exist");
    cy.get('input[name="date"]').should("exist");
    cy.get('select[name="gender"]').should("exist");
    cy.get('button[type="submit"]').should("exist");
  });

  it("shows validation error if required fields are empty", () => {
    cy.visit("/search");
    cy.get('button[type="submit"]').click();
    cy.focused().should("have.attr", "id", "from");
  });

  it("can search for rides and see results", () => {
    cy.visit("/search");
    cy.get('input[name="from"]').type(
      "Biljurashi, بني كبير, Al-Bahah Province, Saudi Arabia"
    );
    cy.get("#suggestion-item").first().should("be.visible").click();
    cy.get('input[name="to"]').type(
      "جامعة الباحة, طريق الملك فهد, Al Aqiq, Al-Bahah Province, Saudi Arabia"
    );
    cy.get("#suggestion-item").first().should("be.visible").click();
    cy.get('input[name="date"]').clear().type("2025-05-18");
    cy.get('select[name="gender"]').select("male", { force: true });
    cy.get('button[type="submit"]').click();
    // Adjust the selector and text below to match your app's search result UI
    cy.contains(
      "الصقاع, الجلحية, محافظة بلجرشي, بني كبير, منطقة الباحة, السعودية"
    ).should("exist");

    cy.contains(
      "جامعة الباحة, طريق الملك فهد, محافظة العقيق, منطقة الباحة, السعودية"
    ).should("exist");
    cy.contains("seats left").should("exist");
  });

  // You can add more tests for searching and result display if you mock the backend or API
});
