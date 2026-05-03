/**
 * Middleware responsável por extrair os IDs dos portfólios que o utilizador
 * tem permissão de acesso e injetá-los na requisição.
 * Utilizado para rotas globais (Data Scoping / Row-Level Security).
 */
function escopoPortfolios(req, res, next) {
  // Extrai apenas os IDs dos portfólios do array de acessos
  req.escopoPortfolios = req.usuario?.acessos?.map((a) => a.idPortfolio) || [];
  
  next();
}

module.exports = escopoPortfolios;