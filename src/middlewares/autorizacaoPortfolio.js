const definirHabilidadesPara = require("../config/casl-permissions");

/**
 * Middleware que localiza o idPortfolio (em params, body ou query),
 * gera as permissões dinâmicas no CASL e valida a ação.
 * 
 * @param {string} [acao] - Ex: "gerir", "ler", "criar"
 * @param {string} [entidade] - Ex: "Transacao", "CategoriaAtivo", "Investidor"
 * @param {string} [campoId="idPortfolio"] - Nome do campo que contém o ID do portfólio
 */
const autorizacaoPortfolio = (acao, entidade, campoId = "idPortfolio") => {
  return (req, res, next) => {
    // 1. Busca o ID do portfólio onde quer que ele esteja
    const idPortfolio =
      req.params?.[campoId] ||
      req.body?.[campoId] ||
      req.query?.[campoId];

    if (!idPortfolio) {
      return res.status(400).json({
        erro: `O ID do portfólio ('${campoId}') é obrigatório para esta operação.`,
      });
    }

    // 2. Gera as permissões do usuário NESTE portfólio
    const habilidades = definirHabilidadesPara(req.usuario, idPortfolio);
    req.habilidades = habilidades;

    // 3. Se acao e entidade foram especificadas, valida com CASL
    if (acao && entidade) {
      if (habilidades.cannot(acao, entidade)) {
        return res.status(403).json({
          erro: `Acesso negado. Você não tem permissão para ${acao} ${entidade} neste portfólio.`,
        });
      }
    }

    next();
  };
};

module.exports = autorizacaoPortfolio;