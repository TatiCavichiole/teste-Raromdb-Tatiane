import { faker } from "@faker-js/faker";

describe("Testes de usuario", function () {
describe("teste de bad request", function () {
    it("Deve receber bad request ao tentar cadastrar um usuário sem e-mail", function () {
      cy.request({
        method: "POST",
        url: "users",
        body: {
          name: faker.internet.userName(),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });
  
    it("Deve receber bad request ao tentar cadastrar um usuário sem o nome", function () {
      cy.request({
      method: "POST",
      url: "users",
      body: {
        email: faker.internet.email(),
      },
      failOnStatusCode: false,
    })
      .its("status")
      .should("to.equal", 400);
  });
  });
});

describe("Testes de criação de usuario com dados validos", function () {
  let userId;
  let tokenUsuario;
  let usuarioLogin;
  let usuario;
  let userName;
  let userEmail;
  it("Criar um novo usuário com credenciais válidas", function () {
    cy.criarUsuario().then(function (usuarioCriado) {
      expect(usuarioCriado.login.status).to.equal(201);
      expect(usuarioCriado.login.body).to.have.property("name");
      expect(usuarioCriado.login.body).to.have.property("email");
      usuario = usuarioCriado.usuario;
      userId = usuarioCriado.usuario.id;
      userName = usuarioCriado.name;
      userEmail = usuarioCriado.email;
      usuarioLogin = {
        email: usuarioCriado.usuario.email,
        password: usuarioCriado.usuario.password,
      };
    });
  });

  it("Logar usuario criado", function () {
    cy.request("POST", "auth/login", usuarioLogin).then(function (
      loginUsuario
    ) {
      expect(loginUsuario.status).to.equal(200);
      expect(loginUsuario.body).to.have.property("accessToken");
      tokenUsuario = loginUsuario.body.accessToken;
    });
  });

  it("Promover usario a Administrador", function () {
    cy.request({
      method: "PATCH",
      url: "users/admin",
      headers: { Authorization: "Bearer " + tokenUsuario },
    }).then(function (promoverUsuarioAdmin) {
      expect(promoverUsuarioAdmin.status).to.equal(204);
    });
  });
  it("Localizar usuario por id", function () {
    cy.request({
      method: "GET",
      url: "users/" + userId,
      headers: { Authorization: "Bearer " + tokenUsuario },
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

// failOnstatusCode: false.

// }).its("status")
// .should("to.equal", 400);
