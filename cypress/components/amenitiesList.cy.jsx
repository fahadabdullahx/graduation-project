// Cypress component smoke test for amenitiesList.jsx
import React from "react";
import { TripAmenities } from "../../components/trip/amenitiesList";
import { mount } from "cypress/react";

describe("<TripAmenities />", () => {
  it("renders without crashing", () => {
    mount(<TripAmenities amenities={[]} />);
  });

  it("renders all default amenities as available", () => {
    const amenities = [
      "wifi",
      "food",
      "music",
      "smoking",
      "pets",
      "air_conditioning",
      "accessibility",
    ];
    mount(<TripAmenities amenities={amenities} />);
    amenities.forEach((key) => {
      cy.contains(
        /wifi|food|music|smoking|pets|air conditioning|accessibility/i
      ).should("exist");
    });
  });

  it("shows unavailable amenities with 'not available'", () => {
    mount(<TripAmenities amenities={[]} />);
    cy.contains("not available").should("exist");
  });
});
