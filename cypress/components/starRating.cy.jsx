// Cypress component test for StarRating
import React from "react";
import { mount } from "cypress/react";
import StarRating from "../../components/starRating";

describe("<StarRating />", () => {
  it("renders the correct number of stars and highlights initial rating", () => {
    mount(<StarRating totalStars={5} initialRating={3} readOnly={true} />);
    cy.get("div.relative").should("have.length", 5); // 5 star containers
    cy.get('svg[fill="#facc15"]').should("have.length.at.least", 3); // at least 3 filled
  });

  it("calls onChange when a star is clicked", () => {
    const handleChange = cy.stub().as("onChange");
    mount(
      <StarRating totalStars={5} initialRating={0} onChange={handleChange} />
    );
    cy.get("div.relative").eq(2).click(); // Click the 3rd star container
    cy.get("@onChange").should("have.been.calledWith", 3);
  });

  it("shows half star on hover", () => {
    mount(<StarRating totalStars={5} initialRating={0} />);
    cy.get("div.relative").first().trigger("mousemove", { clientX: 1 });
    cy.get(".visible").should("exist");
  });

  it("does not allow interaction when readOnly is true", () => {
    const handleChange = cy.stub();
    mount(
      <StarRating
        totalStars={5}
        initialRating={2}
        onChange={handleChange}
        readOnly={true}
      />
    );
    cy.get("div.relative").eq(4).click();
    cy.wrap(handleChange).should("not.have.been.called");
  });
});
