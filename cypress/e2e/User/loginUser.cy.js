import { faker } from "@faker-js/faker";
describe("Testes de login de usuario", function () {
  let accessToken;

  describe("teste de bad request", function () {
    it("Deve receber bad request ao tentar logar sem e-mail", function () {
      cy.request({
        method: "POST",
        url: "auth/login",
        body: {
          password: "1a23b45c",
        },
        failOnStatusCode: false,
      }).then(function (response) {
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("Bad Request");
        expect(response.body.message[0]).to.be.equal(
          "email should not be empty"
        );
        expect(response.body.message[1]).to.be.equal("email must be an email");
      });
    });

    it("Deve receber bad request ao tentar logar com email invalido", function () {
      cy.request({
        method: "POST",
        url: "auth/login",
        body: {
          email: "taty123.com",
          password: "1a23b45c",
        },
        failOnStatusCode: false,
      }).then(function (response) {
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("Bad Request");
        expect(response.body.message[0]).to.be.equal("email must be an email");
      });
    });
    it("Deve receber bad request ao tentar logar com senha errada", function () {
      cy.request({
        method: "POST",
        url: "auth/login",
        body: {
          email: "taty123@raro.com",
          password: "1asd",
        },
        failOnStatusCode: false,
      }).then(function (response) {
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal("Unauthorized");
        expect(response.body.message).to.be.equal(
          "Invalid username or password."
        );
      });
    });
  });

  describe("Testes de login de usuario com dados validos", function () {
    before(function () {
      cy.criarUsuario().then(function () {});
    });
    after(function () {
      cy.tornarAdmin().then(function () {});
      cy.apagarUsuario().then(function () {});
    });
    it("Logar usuario criado", function () {
      cy.logarUsuario().then(function (usuarioLogado) {
        expect(usuarioLogado.status).to.equal(200);
        expect(usuarioLogado.body).to.have.property("accessToken");
        accessToken = usuarioLogado.body.accessToken;
      });
    });
  });
});
