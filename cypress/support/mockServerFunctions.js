// cypress/support/mockServerFunctions.js

// Mock GetMyProfile
export const GetMyProfile = async () => {
  return {
    id: "mock-user-id",
    email: "mockuser@example.com",
    usertype: "admin",
    full_name: "Mock User",
    gender: "male",
    phone_number: "1234567890",
    avatar_url: "/logoTextB.svg",
    created_at: new Date().toISOString(),
    rating: 4.5,
  };
};

// Mock GetImageUrl
export const GetImageUrl = async (url) => {
  // Just return the url for testing
  return url || "/logoTextB.svg";
};

// Add more mocks as needed for other server functions
