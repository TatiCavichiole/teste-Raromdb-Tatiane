describe("Filmes", function () {
  let primeiroFilmeId;
  let primeiroBodyId;
  it("Cadastrar um novo filme como administrador", function () {
    cy.criarUsuario().then(function (usuarioCriado) {
      expect(usuarioCriado.login.status).to.equal(201);
    });
  it("Logar usuario criado", function () {
    cy.request("POST", "auth/login", usuarioLogin).then(function (
         loginUsuario
        ) {
        expect(loginUsuario.status).to.equal(200);
        expect(loginUsuario.body).to.have.property("accessToken");
          tokenUsuario = loginUsuario.body.accessToken;
        });
     
    cy.tornarAdmin().then(function (promoverUsuarioAdmin) {
        expect(promoverUsuarioAdmin.status).to.be.equal(204);
      });
    cy.request({
        method: "POST",
        url: "movies",
        body: {
          title: "Caneta azul",
          genre: "musical",
          description:
            "Caneta azul, azul caneta, Caneta azul tá marcada com minhas letra",
          durationInMinutes: 60,
          releaseYear: 2022,
        },
      }).then(function (cadastrarFilme) {
        expect(cadastrarFilme.status).to.equal(201);
      });
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
});
