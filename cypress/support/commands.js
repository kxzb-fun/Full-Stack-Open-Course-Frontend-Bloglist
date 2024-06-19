// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3003/api/login", {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem("loggedBlogappUser", JSON.stringify(body));
    cy.visit("");
  });
});
Cypress.Commands.add("createBlog", ({ title, url, author, likes }) => {
  cy.request({
    url: `${Cypress.env("BACKEND")}/blogs`,
    method: "POST",
    body: { title, url, author, likes },
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("loggedBlogappUser")).token}`,
    },
  });

  cy.visit("");
});
Cypress.Commands.add("createUser", ({ username, name, password }) => {
  cy.request({
    url: `${Cypress.env("BACKEND")}/users`,
    method: "POST",
    body: { username, name, password },
  });

  cy.visit("");
});
Cypress.Commands.add("getAllUsers", () => {
  cy.request({
    url: `${Cypress.env("BACKEND")}/users`,
    method: "GET",
  });

  cy.visit("");
});

Cypress.Commands.add("getAllBlogs", () => {
  cy.request({
    url: `${Cypress.env("BACKEND")}/blogs`,
    method: "GET",
  });

  cy.visit("");
});
