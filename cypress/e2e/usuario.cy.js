import { faker } from "@faker-js/faker";

describe("Testes de usuario", function () {
describe("teste de bad request", function () {
    it("Deve receber bad request ao tentar cadastrar um usuário sem e-mail", function () {
      cy.request({
        method: "POST",
        url: "users",
        body: {
          name: faker.internet.userName(),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });
  
    it("Deve receber bad request ao tentar cadastrar um usuário sem o nome", function () {
      cy.request({
      method: "POST",
      url: "users",
      body: {
        email: faker.internet.email(),
      },
      failOnStatusCode: false,
    })
      .its("status")
      .should("to.equal", 400);
  });
  });
  it("Deve receber bad request ao tentar localizar usuario com Id inexistente", function () {
    cy.request({
    method: "GET",
    url: "users/0",
    
    failOnStatusCode: false,
  })
    .its("status")
    .should("to.equal", 400);
});
});


describe("Testes de criação de usuario com dados validos", function () {
  let userId;
  let accessToken;
  // after(function() {
  //   Cypress.Commands.add("apagarUsuario", function (id) {
  //     cy.request("DELETE", "users/" + userid);
  //   }); 
  //   });
  it("Criar um novo usuário com credenciais válidas", function () {
    cy.criarUsuario().then(function (usuarioCriado) {
      expect(usuarioCriado.status).to.equal(201);
      expect(usuarioCriado.body).to.have.property("name");
      expect(usuarioCriado.body).to.have.property("email");
    
      userId = usuarioCriado.body.id;
     
      cy.log(userId)
    });
   
  });

  it("Logar usuario criado", function () {
    cy.logarUsuario().then(function (usuarioLogado) {
      expect(usuarioLogado.status).to.equal(200);
      expect(usuarioLogado.body).to.have.property("accessToken");
      accessToken = usuarioLogado.body.accessToken
    });
  });

  it("Promover usario a Administrador", function () {
    cy.tornarAdmin().then(function (promoverUsuarioAdmin) {
      expect(promoverUsuarioAdmin.status).to.equal(204);
     
    });
  });

  it("Localizar usuario por id", function () {
    cy.request({
      method: "GET",
      url: "users/" + userId,
      headers: { Authorization: "Bearer " + accessToken },
    }).then(function (localizarUsuarioId) {
      expect(localizarUsuarioId.status).to.equal(200);
      expect(localizarUsuarioId.body).to.have.property("active");
      expect(localizarUsuarioId.body).to.have.property("email");
      expect(localizarUsuarioId.body).to.have.property("id");
      expect(localizarUsuarioId.body).to.have.property("name");
      expect(localizarUsuarioId.body).to.have.property("type");
    });
  });
});

// failOnstatusCode: false.

// }).its("status")
// .should("to.equal", 400);
