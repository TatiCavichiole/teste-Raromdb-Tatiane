describe("criar novo filme e atualizações de filmes como Administrador", function () {
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
});
