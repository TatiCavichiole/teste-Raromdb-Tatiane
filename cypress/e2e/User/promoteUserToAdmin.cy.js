describe("Testes de promover usuario a Administrador", function () {
  before(function () {
    cy.criarUsuario().then(function () {});
    cy.logarUsuario().then(function () {});
  });

  after(function () {
    cy.apagarUsuario().then(function () {});
  });

  describe("teste de bad request", function () {
    it("Deve receber bad request ao tentar promover a Admin sem o acesstoken", function () {
      cy.request({
        method: "PATCH",
        url: "users/admin",

        failOnStatusCode: false,
      }).then(function (response) {
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal("Unauthorized");
        expect(response.body.message).to.be.equal("Access denied.");
      });
    });
  });

  describe("Testes de promover usuario", function () {
    it("Promover usario a Administrador estando logado", function () {
      cy.tornarAdmin().then(function (promoverUsuarioAdmin) {
        expect(promoverUsuarioAdmin.status).to.equal(204);
      });
    });
  });
});
