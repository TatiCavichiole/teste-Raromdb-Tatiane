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
// import { faker } from "@faker-js/faker";

// Cypress.Commands.add('login', function () {
//   return{
//   fakename: faker.internet.userName(),
//   fakeemail: faker.internet.email(),
//   fakesenha: faker.internet.senha(6)
//   }
//  })
import { faker } from "@faker-js/faker";
// import cypress from "cypress";
// Cypress.Commands.add("criarUsuario", function () {
//   let userId;
//   let usuarioLogin;
//   const usuario = {
//     email: faker.internet.email(),
//     password: "1a23b45c",
//     name: faker.internet.userName(),
//   };
//   return cy.request("POST", "users", usuario).then(function (usuarioCriado) {});
// });

let accessToken;
let usuarioLogin;
let userId;
let filmeCriadoId;
Cypress.Commands.add("criarUsuario", function () {
  const usuario = {
    email: faker.internet.email(),
    password: "1a23b45c",
    name: faker.internet.userName(),
  };
  cy.request("POST", "users", usuario).then(function (usuarioCriado) {
    usuarioLogin = {
      email: usuarioCriado.body.email,
      password: usuario.password,
    };
    userId = usuarioCriado.body.id;
  });
});

Cypress.Commands.add("logarUsuario", function () {
  cy.request("POST", "auth/login", usuarioLogin).then(function (usuarioLogado) {
    accessToken = usuarioLogado.body.accessToken;
  });
});
Cypress.Commands.add("tornarAdmin", function () {
  cy.request({
    method: "PATCH",
    url: "users/admin",
    headers: { Authorization: "Bearer " + accessToken },
  });
});
Cypress.Commands.add("tornarCritico", function () {
  cy.request({
    method: "PATCH",
    url: "users/apply",
    headers: { Authorization: "Bearer " + accessToken },
  });
});

Cypress.Commands.add("apagarUsuario", function (id) {
  cy.request({
    method: "DELETE",
    url: "users/" + userId,
    headers: { Authorization: "Bearer " + accessToken },
  });
});

Cypress.Commands.add("criarFilme", function () {
  cy.fixture("cadastro-filme.json").then(function (dadosFilme) {
    cy.request({
      method: "POST",
      url: "movies",
      body: dadosFilme,
      headers: { Authorization: "Bearer " + accessToken },
    });
  });
});

Cypress.Commands.add("apagarFilme", function () {
  cy.request({
    method: "DELETE",
    url: "movies/" + filmeCriadoId,
    headers: { Authorization: "Bearer " + accessToken },
  });
});

// })
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

// import { faker } from '@faker-js/faker';

// const { faker } = require('@faker-js/faker');

// export function createRandomUser(){
//   return {

//     name: faker.internet.name(),
//     email: faker.internet.email(),
//     password: faker.internet.password(),

//   };
// }
// function generateMultipleUsers(count) {
//     const users = [];
//     for (let i = 0; i < count; i++) {
//       users.push(createRandomUser());
//     }
//     return users;
//   }
// export const USERS = faker.helpers.multiple(createRandomUser, {
//   count: 100,
// });
