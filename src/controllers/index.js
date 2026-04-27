const usuarioController = require("./usuarioController");
const portfolioController = require("./portfolioController");
const transacaoController = require("./transacaoController");
const classeAtivoController = require("./classeAtivoController");
const categoriaAtivoController = require("./categoriaAtivoController");
const corretoraController = require("./corretoraController"); // Nova entidade aqui

module.exports = {
  usuarioController,
  portfolioController,
  transacaoController,
  classeAtivoController,
  categoriaAtivoController,
  corretoraController
};
