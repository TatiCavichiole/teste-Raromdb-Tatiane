describe("testes para usuario Admin", function () {
  let tokenUsuario;
  let filmeCriado;
  let filmeCriadoId;
  before(function () {
    cy.criarUsuario().then(function () {
      cy.logarUsuario().then(function (response) {
        tokenUsuario = response.body.accessToken;
        cy.tornarAdmin().then(function () {});
      });
    });
  });
  // after(function () {
  //   cy.apagarFilme().then(function () {
  //     tokenUsuario = response.body.accessToken;
  //   });
  // });

  describe("testes bad request", function () {
    it("deve receber bad request ao fazer review de filme com score maior que 5 ", function () {
      cy.request({
        method: "POST",
        url: "users/review",
        body: {
          movieId: filmeCriadoId,
          score: 6,
          reviewText: "Musica Chiclete",
        },
        headers: { Authorization: "Bearer " + tokenUsuario },
        failOnStatusCode: false,
      }).then(function (reviewFilme) {
        expect(reviewFilme.status).to.be.equal(400);
        expect(reviewFilme.body.message[0]).to.deep.equal(
          "movieId must be an integer number"
        );
        //"Score should be between 1 and 5"
      });
    });
    it("deve receber bad request ao fazer review de filme com score menor que 1 ", function () {
      cy.request({
        method: "POST",
        url: "users/review",
        body: {
          movieId: filmeCriadoId,
          score: 0,
          reviewText: "Musica Chiclete",
        },
        headers: { Authorization: "Bearer " + tokenUsuario },
        failOnStatusCode: false,
      }).then(function (reviewFilme) {
        expect(reviewFilme.status).to.be.equal(400);
        expect(reviewFilme.body.message[0]).to.deep.equal(
          "movieId must be an integer number"
        );
        //"Score should be between 1 and 5"
      });
    });
    it("deve receber Not Found ao fazer review de filme com preenchimento do Id incorreto ", function () {
      cy.request({
        method: "POST",
        url: "users/review",
        body: {
          movieId: 0,
          score: 3,
          reviewText: "Musica Chiclete",
        },
        headers: { Authorization: "Bearer " + tokenUsuario },
        failOnStatusCode: false,
      }).then(function (reviewFilme) {
        expect(reviewFilme.status).to.be.equal(404);
        expect(reviewFilme.body.message).to.deep.equal("Movie not found");
      });
    });
    it("deve receber Not Found ao fazer review de filme com preenchimento do review incorreto ", function () {
      cy.request({
        method: "POST",
        url: "users/review",
        body: {
          movieId: filmeCriadoId,
          score: 3,
          reviewText: 123,
        },
        headers: { Authorization: "Bearer " + tokenUsuario },
        failOnStatusCode: false,
      }).then(function (reviewFilme) {
        expect(reviewFilme.status).to.be.equal(400);
        expect(reviewFilme.body.message[0]).to.deep.equal(
          "movieId must be an integer number"
        );
        expect(reviewFilme.body.message[1]).to.deep.equal(
          "movieId should not be empty"
        );
        expect(reviewFilme.body.message[2]).to.deep.equal(
          "reviewText must be a string"
        );
      });
    });
  });

  describe("criar novo filme e atualizações de filmes como Administrador", function () {
    it("Cadastrar um novo filme ", function () {
      cy.fixture("cadastro-filme.json").then(function (dadosFilme) {
        cy.request({
          method: "POST",
          url: "movies",
          body: dadosFilme,
          headers: { Authorization: "Bearer " + tokenUsuario },
        }).then(function (cadastrarFilme) {
          expect(cadastrarFilme.status).to.equal(201);
          filmeCriado = dadosFilme.title;
        });
      });
    });

    it("Pesquisar filme criado pelo titulo", function () {
      cy.request({
        method: "GET",
        url: "movies/search/",
        qs: { title: filmeCriado },
      }).then(function (pesquisarFilme) {
        expect(pesquisarFilme.status).to.equal(200);

        filmeCriadoId = pesquisarFilme.body[0].id;
        cy.log(filmeCriadoId);
      });
    });
    it("Atualizar filme cadastrado", function () {
      cy.fixture("atualizar-filme.json").then(function (dadosAtualizarFilme) {
        cy.request({
          method: "PUT",
          url: "movies/" + filmeCriadoId,
          body: dadosAtualizarFilme,
          headers: { Authorization: "Bearer " + tokenUsuario },
        }).then(function (atualizarFilme) {
          expect(atualizarFilme.status).to.equal(204);
        });
      });
    });
    it("fazer review de filme", function () {
      cy.request({
        method: "POST",
        url: "users/review",
        body: {
          movieId: filmeCriadoId,
          score: 5,
          reviewText: "Musica Chiclete",
        },
        headers: { Authorization: "Bearer " + tokenUsuario },
      }).then(function (reviewFilme) {
        expect(reviewFilme.status).to.equal(201);
        expect(reviewFilme.headers).to.have.property("date");
      });
    });
    it("listar review de filme", function () {
      cy.request({
        method: "GET",
        url: "users/review/all",
        headers: { Authorization: "Bearer " + tokenUsuario },
      }).then(function (listarReviewFilme) {
        expect(listarReviewFilme.status).to.equal(200);
        expect(listarReviewFilme.body).to.be.an("array");
      });
    });
    it("Listar filmes por Id ", function () {
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
