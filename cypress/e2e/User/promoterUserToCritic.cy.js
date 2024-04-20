describe("Testes de promover usuario a Critico", function () {
  let userId;
  let accessToken;
  before(function () {
    cy.criarUsuario().then(function (usuarioCriado) {
      userId = usuarioCriado.body.id;
    });
    cy.logarUsuario().then(function (usuarioLogado) {
      accessToken = usuarioLogado.body.accessToken;
    });
  });

  describe("teste de bad request", function () {
    it("Deve receber bad request ao tentar promover a critico sem o acesstoken", function () {
      cy.request({
        method: "PATCH",
        url: "users/apply",

        failOnStatusCode: false,
      }).then(function (response) {
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal("Unauthorized");
        expect(response.body.message).to.be.equal("Access denied.");
      });
    });

    it("Usuario do tipo Critico receber bad request ao tentar promover deletar usuario", function () {
      cy.request({
        method: "DELETE",
        url: "users/" + userId,
        failOnStatusCode: false,
        headers: { Authorization: "Bearer " + accessToken },
      }).then(function (response) {
        expect(response.status).to.equal(403);
        //expect(response.body.error).to.equal("Forbidden");
        expect(response.body.message).to.be.equal("Forbidden");
      });
    });
  });

  describe("Testes de promover usuario", function () {
    it("Promover usario a critico passando o acesstoken", function () {
      cy.tornarCritico().then(function (promoverUsuarioCritico) {
        expect(promoverUsuarioCritico.status).to.equal(204);
      });
    });
  });
});
