// /**
//  * Middleware responsável por extrair os IDs dos portfólios que o utilizador
//  * tem permissão de acesso e injetá-los na requisição.
//  * Utilizado para rotas globais (Data Scoping / Row-Level Security).
//  */
// function escopoPortfolios(req, res, next) {
//   // Extrai apenas os IDs dos portfólios do array de acessos
//   req.escopoPortfolios = req.usuario?.acessos?.map((a) => a.idPortfolio) || [];
  
//   next();
// }

// module.exports = escopoPortfolios;

/**
 * Injeta a lista de portfólios autorizados e, caso um idPortfolio
 * tenha sido enviado na query/params, valida se o usuário tem acesso.
 */
function escopoPortfolios(req, res, next) {
  // 1. Extrai todos os portfólios que o usuário tem acesso
  const idsPermitidos = req.usuario?.acessos?.map((a) => a.idPortfolio) || [];
  req.escopoPortfolios = idsPermitidos;

  // 2. Se for admin, passa direto
  if (req.usuario?.papel === "admin") {
    return next();
  }

  // 3. Se o usuário enviou um idPortfolio específico na query (?idPortfolio=123)
  const idPortfolioQuery = req.query?.idPortfolio || req.params?.idPortfolio;
  if (idPortfolioQuery) {
    const temAcesso = idsPermitidos.some(
      (id) => id.toString() === idPortfolioQuery.toString()
    );

    if (!temAcesso) {
      return res.status(403).json({
        erro: "Acesso negado a este portfólio.",
      });
    }
  }

  next();
}

module.exports = escopoPortfolios;