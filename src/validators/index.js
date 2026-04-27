const usuarioValidator = require("./usuarioValidator");
const portfolioValidator = require("./portfolioValidator");
const transacaoValidator = require("./transacaoValidator");
const classeAtivoValidator = require("./classeAtivoValidator");
const categoriaAtivoValidator = require("./categoriaAtivoValidator");
const ativoValidator = require("./ativoValidator");
const corretoraValidator = require("./corretoraValidator"); // Nova entidade aqui


module.exports = {
  ...usuarioValidator, // Usamos o 'spread' (...) para extrair tudo o que
  ...portfolioValidator, // está dentro dos objetos exportados nos arquivos.
  ...transacaoValidator,
  ...classeAtivoValidator,
  ...categoriaAtivoValidator,
  ...ativoValidator,
  ...corretoraValidator,
};
