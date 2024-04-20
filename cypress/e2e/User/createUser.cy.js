import { faker } from "@faker-js/faker";

describe("Testes de usuario", function () {
  let userEmail;
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
    it("Deve receber bad request ao tentar cadastrar um usuário com senha menor que 6 digitos", function () {
      cy.request({
        method: "POST",
        url: "users",
        body: {
          email: faker.internet.email(),
          password: "12345",
        },
        failOnStatusCode: false,
      }).then(function (response) {
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("Bad Request");
        // expect(response.body.message).to.be.equal(
        //   "password must be longer than or equal to 6 characters"
        // );
      });
    });

    it("Deve receber bad request ao tentar cadastrar um usuário com senha maior que 12 digitos", function () {
      cy.request({
        method: "POST",
        url: "users",
        body: {
          email: faker.internet.email(),
          password: "1234567891123",
        },
        failOnStatusCode: false,
      }).then(function (response) {
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("Bad Request");
        // expect(response.body.message).to.be.equal(
        //   "password must be longer than or equal to 6 characters"
        // );
      });
    });
  });
  it("Deve receber bad request ao tentar cadastrar um usuário com email ja cadastrado", function () {
    cy.request({
      method: "POST",
      url: "users",
      body: {
        email: userEmail,
        password: "123456",
      },
      failOnStatusCode: false,
    }).then(function (response) {
      expect(response.status).to.equal(409);
      expect(response.body.error).to.equal("Conflict while creating user");
      expect(response.body.message).to.be.equal(
        "password must be longer than or equal to 6 characters"
      );
    });
  });

  describe("Testes de criação de usuario com dados validos", function () {
    let userId;
    let tokenUsuario;
    after(function () {
      cy.logarUsuario().then(function (response) {
        tokenUsuario = response.body.accessToken;
        cy.tornarAdmin().then(function () {});
        cy.apagarUsuario().then(function () {});
      });
    });

    it("Criar um novo usuário com credenciais válidas", function () {
      cy.criarUsuario().then(function (usuarioCriado) {
        expect(usuarioCriado.status).to.equal(201);
        expect(usuarioCriado.body).to.have.property("name");
        expect(usuarioCriado.body).to.have.property("email");
        userEmail = usuarioCriado.email;
        userId = usuarioCriado.body.id;
        cy.log(userId);
      });
    });
  });
});
