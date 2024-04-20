describe("Filmes", function () {
  let filmeCriadoId;
  let primeiroBodyId;
  let tokenUsuario;
  let filmeCriado;
  let primeiroFilmeId;
  before(function () {
    cy.criarUsuario().then(function () {
      cy.logarUsuario().then(function (response) {
        tokenUsuario = response.body.accessToken;
        cy.tornarAdmin().then(function () {});
      });
    });
  });
  // after(function () {
  //   cy.apagarFilme(filmeCriadoId);
  // });
  it("Cadastrar um novo filme como administrador", function () {
    cy.fixture("cadastro-filme.json").then(function (dadosFilme) {
      cy.request({
        method: "POST",
        url: "movies",
        body: dadosFilme,
        headers: { Authorization: "Bearer " + tokenUsuario },
      }).then(function (cadastrarFilme) {
        expect(cadastrarFilme.status).to.equal(201);
        filmeCriado = dadosFilme.title;
        cy.log(filmeCriado);
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

  it("Listar filmes como usuario nao cadastrado", function () {
    cy.request({
      method: "GET",
      url: "movies",
      sort: false,
    }).then(function (listarFilmes) {
      expect(listarFilmes.status).to.be.equal(200);
      expect(listarFilmes.body).to.be.an("array");
      primeiroFilmeId = listarFilmes.body[0].id;
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
        //expect(atualizarFilme.headers).to.have.property()
      });
    });
  });
});
