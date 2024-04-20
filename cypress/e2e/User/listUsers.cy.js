describe("Listar Usuarios", function () {
  let userId;
  let accessToken;
  before(function () {
    cy.criarUsuario().then(function (response) {
      userId = response.id;
    });
    cy.logarUsuario().then(function (response) {
      accessToken = response.accessToken;
    });
  });
  describe("teste de bad request", function () {
    it("Deve receber bad request ao tentar localizar usuario sem ser Administrador", function () {
      cy.request({
        method: "GET",
        url: "users/",

        failOnStatusCode: false,
      }).then(function (response) {
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal("Unauthorized");
      });
    });

    it("Deve receber bad request ao tentar localizar usuario por ID sem ser Administrador", function () {
      cy.request({
        method: "GET",
        url: "users/" + userId,

        failOnStatusCode: false,
      }).then(function (response) {
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal("Unauthorized");
      });
    });
  });

  describe("Deve ser possivel listar e localizar usaruarios", function () {
    cy.tornarAdmin().then(function () {});

    it("listar usuarios", function () {
      cy.request({
        method: "GET",
        url: "users",
        headers: { Authorization: "Bearer " + accessToken },
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
});
