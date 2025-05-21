// Cypress component smoke test for tripCard.jsx
import React from "react";
import TripCard from "../../components/trip/tripCard";
import { mount } from "cypress/react";

describe("<TripCard />", () => {
  const mockData = {
    id: "trip1",
    start_location: "Riyadh",
    end_location: "Jeddah",
    price: 100,
    departure_time: new Date("2025-05-18T10:00:00Z").toISOString(),
    offered_seat: 3,
    bookings: [],
    driver: { full_name: "Driver Name", gender: "male", rating: 4.5 },
  };

  it("renders without crashing", () => {
    mount(<TripCard data={mockData} />);
    cy.get("#trip-card").should("exist");
    cy.contains("Riyadh").should("exist");
    cy.contains("Jeddah").should("exist");
    cy.contains("100").should("exist");
    cy.contains("3 seats left").should("exist");
    cy.contains("Driver Name").should("exist");
  });
});
