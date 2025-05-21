// Cypress component test for SearchForm
import React from "react";
import { mount } from "cypress/react";
import SearchForm from "../../components/trip/searchForm";

// Mock the SearchByNameLocation util to avoid real HTTP requests
const mockResults = [
  {
    place_id: "1",
    display_name: "Riyadh, Saudi Arabia",
    lat: "24.7136",
    lon: "46.6753",
  },
  {
    place_id: "2",
    display_name: "Jeddah, Saudi Arabia",
    lat: "21.4858",
    lon: "39.1925",
  },
];

describe("<SearchForm />", () => {
  beforeEach(() => {
    // Mock global fetch to intercept SearchByNameLocation requests
    cy.window().then((win) => {
      cy.stub(win, "fetch").callsFake((url) => {
        if (url.includes("nominatim.openstreetmap.org/search")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockResults),
          });
        }
        // fallback for other fetches
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      });
    });
  });

  it("renders and allows user to search and select locations", () => {
    mount(<SearchForm />);
    cy.get('input[name="from"]').type("Riyadh");
    // Wait for the options to appear and select the first one
    cy.get("#suggestion-item").first().should("be.visible").click();
    cy.get('input[name="to"]').type("Jeddah");
    cy.get("#suggestion-item").first().should("be.visible").click();
    cy.get('input[name="date"]').should("exist");
    // Use force: true because the select is visually hidden and replaced by a custom UI
    cy.get('select[name="gender"]').select("male", { force: true });
    cy.get('button[type="submit"]').click();
  });
});
