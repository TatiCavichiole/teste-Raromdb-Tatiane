describe("testes para usuario Critic", function () {
  let tokenUsuario;
  let filmeCriado;
  let filmeCriadoId;
  before(function () {
    cy.criarUsuario().then(function () {
      cy.logarUsuario().then(function (response) {
        tokenUsuario = response.body.accessToken;
        cy.tornarCritico().then(function () {});
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
          score: 8,
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
    it("deve receber Not Found ao fazer review de filme com preenchimento do Id tipo string ", function () {
      cy.request({
        method: "POST",
        url: "users/review",
        body: {
          movieId: "oi",
          score: 1,
          reviewText: "Musica Chiclete",
        },
        headers: { Authorization: "Bearer " + tokenUsuario },
        failOnStatusCode: false,
      }).then(function (reviewFilme) {
        expect(reviewFilme.status).to.be.equal(400);
        expect(reviewFilme.body.message).to.deep.equal([
          "movieId must be an integer number",
        ]);
      });
    });
    it("deve receber Not Found ao fazer review de filme com preenchimento do review incorreto ", function () {
      cy.request({
        method: "POST",
        url: "users/review",
        body: {
          movieId: filmeCriadoId,
          score: 2,
          reviewText: 0,
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
    it("deve receber Not Found ao tentar criar um novo filme ", function () {
      cy.fixture("cadastro-filme.json").then(function (dadosFilme) {
        cy.request({
          method: "POST",
          url: "movies",
          body: dadosFilme,
          headers: { Authorization: "Bearer " + tokenUsuario },
          failOnStatusCode: false,
        }).then(function (criarFilme) {
          expect(criarFilme.status).to.be.equal(403);
          expect(criarFilme.body.message).to.deep.equal("Forbidden");
        });
      });
    });
    it("deve receber not Found ao fazer update de filme", function () {
      cy.fixture("atualizar-filme.json").then(function (atualizarFilme) {
        cy.request({
          method: "PUT",
          url: "movies/" + filmeCriadoId,
          body: atualizarFilme,
          headers: { Authorization: "Bearer " + tokenUsuario },
          failOnStatusCode: false,
        }).then(function (criarFilme) {
          expect(criarFilme.status).to.be.equal(403);
          expect(criarFilme.body.message).to.deep.equal("Forbidden");
        });
      });
    });
  });

  describe("fazer review de filmes e listar filmes", function () {
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
  });
});
