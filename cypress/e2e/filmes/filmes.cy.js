describe("Filmes", function () {
  let primeiroBodyId;

  let primeiroFilmeId;

  describe("teste de bad request", function () {
    before(function () {
      cy.criarUsuario().then(function () {});
      cy.logarUsuario().then(function () {});
    });

    it("deve receber bad request ao tentar cadastrar novo filme como usuario comum", function () {
      cy.fixture("cadastro-filme.json").then(function (dadosFilme) {
        cy.request({
          method: "POST",
          url: "movies",
          body: dadosFilme,
          failOnStatusCode: false,
        }).then(function (cadastrarFilme) {
          expect(cadastrarFilme.body.error).to.deep.equal("Unauthorized");
        });
      });
    });

    it("deve receber bad request ao tentar atualizar filme como usuario comum", function () {
      cy.fixture("atualizar-filme.json").then(function (dadosFilme) {
        cy.request({
          method: "PUT",
          url: "movies" + primeiroFilmeId,

          failOnStatusCode: false,
        }).then(function (atualizarFilme) {
          expect(atualizarFilme.body.error).to.deep.equal("Not Found");
        });
      });
    });
  });

  describe("usuario comum pode", function () {
    it("Listar filmes como usuario nao cadastrado", function () {
      cy.request({
        method: "GET",
        url: "movies",
        sort: false,
      }).then(function (listarFilmes) {
        expect(listarFilmes.status).to.be.equal(200);
        expect(listarFilmes.body).to.be.an("array");
        primeiroFilmeId = listarFilmes.body[0].id;
        cy.log(primeiroFilmeId);
      });
    });

    it("Listar filmes por Id como usuario nao cadastrado", function () {
      cy.request({
        method: "GET",
        url: "movies/" + primeiroFilmeId,
      }).then(function (listarFilmeId) {
        expect(listarFilmeId.status).to.equal(200);
        expect(listarFilmeId.body);
        primeiroBodyId = listarFilmeId.body;
        expect(listarFilmeId.body).to.deep.equal(primeiroBodyId);
        cy.log(primeiroFilmeId);
      });
    });
  });
});
