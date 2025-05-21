import React from "react";
import { mount } from "cypress/react"; // Assuming you are using React 18
import SearchResult from "../../components/trip/searchResult";

// Mock data for testing
const mockResult = [
  {
    id: "ba89477d-bfce-4b64-9b1c-c80d45aa9861",
    driver_id: "532bfe3a-9b19-4ca6-aa05-295346ee4986",
    start_location: "start_location 1",
    end_location: "end_location 1",
    start_latitude: 19.859456,
    start_longitude: 41.557583,
    end_latitude: 20.17374,
    end_longitude: 41.633053,
    departure_time: "2025-04-20T19:40:58",
    status: "offer",
    offered_seat: 5,
    created_at: "2025-04-13T15:23:01.923374",
    price: 100,
    amenities: ["wifi", "food", "music", "smoking", "pets", "accessibility"],
    car: {
      id: "8679b62c-5427-42e9-915c-d4651fb37606",
      seat: 5,
      type: "standard",
      year: 2020,
      color: "Red",
      model: "MODEL 1",
    },
    bookings: [],
    driver: {
      id: "532bfe3a-9b19-4ca6-aa05-295346ee4986",
      gender: "male",
      rating: 1,
      full_name: "Fahad Abdullah 1",
      avatar_url: "532bfe3a-9b19-4ca6-aa05-295346ee4986-0.9913376110961672.png",
      created_at: "2025-04-06T18:15:12+00:00",
      phone_number: "0555555555",
    },
  },
  {
    id: "ba89477d-bfce-4b64-9b1c-c80d45aa9861",
    driver_id: "532bfe3a-9b19-4ca6-aa05-295346ee4986",
    start_location: "start_location 2",
    end_location: "end_location 2",
    start_latitude: 19.859456,
    start_longitude: 41.557583,
    end_latitude: 20.17374,
    end_longitude: 41.633053,
    departure_time: "2025-04-20T19:45:58",
    status: "offer",
    offered_seat: 5,
    created_at: "2025-04-13T15:23:01.923374",
    price: 200,
    amenities: ["wifi", "food", "music", "smoking", "pets", "accessibility"],
    car: {
      id: "8679b62c-5427-42e9-915c-d4651fb37606",
      seat: 5,
      type: "standard",
      year: 2020,
      color: "Red",
      model: "MODEL 2",
    },
    bookings: [],
    driver: {
      id: "532bfe3a-9b19-4ca6-aa05-295346ee4986",
      gender: "male",
      rating: 2,
      full_name: "Fahad Abdullah 2",
      avatar_url: "532bfe3a-9b19-4ca6-aa05-295346ee4986-0.9913376110961672.png",
      created_at: "2025-04-06T18:15:12+00:00",
      phone_number: "0555555555",
    },
  },

  {
    id: "ba89477d-bfce-4b64-9b1c-c80d45aa9861",
    driver_id: "532bfe3a-9b19-4ca6-aa05-295346ee4986",
    start_location: "start_location 3",
    end_location: "end_location 3",
    start_latitude: 19.859456,
    start_longitude: 41.557583,
    end_latitude: 20.17374,
    end_longitude: 41.633053,
    departure_time: "2025-04-20T19:47:58",
    status: "offer",
    offered_seat: 5,
    created_at: "2025-04-13T15:23:01.923374",
    price: 300,
    amenities: ["wifi", "food", "music", "smoking", "pets", "accessibility"],
    car: {
      id: "8679b62c-5427-42e9-915c-d4651fb37606",
      seat: 5,
      type: "standard",
      year: 2020,
      color: "Red",
      model: "MODEL 3",
    },
    bookings: [],
    driver: {
      id: "532bfe3a-9b19-4ca6-aa05-295346ee4986",
      gender: "male",
      rating: 3,
      full_name: "Fahad Abdullah 3",
      avatar_url: "532bfe3a-9b19-4ca6-aa05-295346ee4986-0.9913376110961672.png",
      created_at: "2025-04-06T18:15:12+00:00",
      phone_number: "0555555555",
    },
  },
];

describe("<SearchResult />", () => {
  beforeEach(() => {
    // Mount the component before each test
    mount(<SearchResult result={mockResult} />);
  });

  it("renders the component with initial results", () => {
    // Check if the sort select exists
    cy.get("#sortBy").should("exist");
    // Check if the correct number of TripCards are rendered (now 4)
    cy.get('[id="trip-card"]').should("have.length", 3);
  });

  it("sorts by lowest price", () => {
    cy.get("#sortBy").click(); // Open the select dropdown
    cy.contains("Lowest price").click();
    // Check the order of prices after sorting
    cy.get('[id="price"]').then(($prices) => {
      const prices = $prices
        .map((i, el) => parseFloat(el.innerText.replace(/[^0-9.]/g, "")))
        .get();
      expect(prices).to.deep.equal([100, 200, 300]);
    });
  });

  it("sorts by highest price", () => {
    cy.get("#sortBy").click();
    cy.contains("Highest price").click();
    cy.get('[id="price"]').then(($prices) => {
      const prices = $prices
        .map((i, el) => parseFloat(el.innerText.replace(/[^0-9.]/g, "")))
        .get();
      // Expected order: 150, 100.5, 100, 80
      expect(prices).to.deep.equal([300, 200, 100]);
    });
  });

  it("sorts by earliest time", () => {
    cy.get("#sortBy").click();
    cy.contains("Earliest time").click();
    // Check the order based on driver name (assuming it's displayed)
    // Expected order: Fahad Abdullah, Driver Three, Driver One, Driver Two
    cy.get('[id="trip-card"]').eq(0).should("contain.text", "Fahad Abdullah 1");
    cy.get('[id="trip-card"]').eq(1).should("contain.text", "Fahad Abdullah 2");
    cy.get('[id="trip-card"]').eq(2).should("contain.text", "Fahad Abdullah 3");
  });

  it("sorts by latest time", () => {
    cy.get("#sortBy").click();
    cy.contains("Latest time").click();
    // Check the order based on driver name
    // Expected order: Driver Two, Driver One, Driver Three, Fahad Abdullah
    cy.get('[id="trip-card"]').eq(0).should("contain.text", "Fahad Abdullah 3");
    cy.get('[id="trip-card"]').eq(1).should("contain.text", "Fahad Abdullah 2");
    cy.get('[id="trip-card"]').eq(2).should("contain.text", "Fahad Abdullah 1");
  });

  it("sorts by highest rating", () => {
    cy.get("#sortBy").click();
    cy.contains("Highest rating").click();
    // Check the order based on driver name
    // Expected order: Driver Three (5.0), Driver One (4.5), Driver Two (4.0), Fahad Abdullah (3.67)
    cy.get('[id="trip-card"]').eq(0).should("contain.text", "Fahad Abdullah 3");
    cy.get('[id="trip-card"]').eq(1).should("contain.text", "Fahad Abdullah 2");
    cy.get('[id="trip-card"]').eq(2).should("contain.text", "Fahad Abdullah 1");
  });

  it("sorts by lowest rating", () => {
    cy.get("#sortBy").click();
    cy.contains("Lowest rating").click();
    // Check the order based on driver name
    // Expected order: Fahad Abdullah 1 (1), Fahad Abdullah 2 (2), Fahad Abdullah 3 (3)
    cy.get('[id="trip-card"]').eq(0).should("contain.text", "Fahad Abdullah 1");
    cy.get('[id="trip-card"]').eq(1).should("contain.text", "Fahad Abdullah 2");
    cy.get('[id="trip-card"]').eq(2).should("contain.text", "Fahad Abdullah 3");
  });

  it("renders no results message when result array is empty", () => {
    mount(<SearchResult result={[]} />);
    cy.get('[id="trip-card"]').should("not.exist");
    // Optionally, check for a "no results" message if your component renders one
    // cy.contains('No trips found').should('be.visible');
  });

  it("renders no results message when result is null or undefined", () => {
    mount(<SearchResult result={null} />);
    cy.get('[id="trip-card"]').should("not.exist");
    // cy.contains('No trips found').should('be.visible');

    mount(<SearchResult result={undefined} />);
    cy.get('[id="trip-card"]').should("not.exist");
    // cy.contains('No trips found').should('be.visible');
  });
});

// Note: You might need to add `data-cy` attributes to your TripCard component
// for some of these selectors to work reliably, e.g.,
// <div data-cy="trip-card">...</div>
// <span data-cy="trip-card-price">{price} SAR</span>
// <span data-cy="trip-card-rating">{driver.rating}</span>
