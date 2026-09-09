const usuarioValidator = require("./usuarioValidator");
const tagAtivoValidator = require("./tagAtivoValidator");

const portfolioValidator = require("./portfolioValidator");
const transacaoValidator = require("./transacaoValidator");
const classeAtivoValidator = require("./classeAtivoValidator");
const categoriaAtivoValidator = require("./categoriaAtivoValidator");
const corretoraValidator = require("./corretoraValidator");
const investidorValidator = require("./investidorValidator");
const ativoValidator = require("./ativoValidator");

module.exports = {
  ...usuarioValidator, // Usamos o 'spread' (...) para extrair tudo o que
  ...tagAtivoValidator, // está dentro dos objetos exportados nos arquivos.
  ...portfolioValidator, // está dentro dos objetos exportados nos arquivos.
  ...transacaoValidator,
  ...classeAtivoValidator,
  ...categoriaAtivoValidator,
  ...ativoValidator,
  ...corretoraValidator,
  ...investidorValidator,
  ...ativoValidator,
};
