// Cypress component test for ForgotPasswordForm
import React from "react";
import { mount } from "cypress/react";
import { ForgotPasswordForm } from "../../components/auth/forgotPasswordForm";

describe("<ForgotPasswordForm />", () => {
  beforeEach(() => {
    // Mock supabase client
    cy.window().then((win) => {
      win.createClient = () => ({
        auth: {
          resetPasswordForEmail: (email) => {
            if (email === "fail@example.com") {
              return Promise.resolve({
                error: { message: "Error!" },
                data: null,
              });
            }
            return Promise.resolve({ error: null, data: {} });
          },
        },
      });
    });
  });

  it("shows success message after submitting valid email", () => {
    mount(<ForgotPasswordForm />);
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('button[type="submit"]').click();
    cy.contains("Check Your Email").should("be.visible");
  });
});
