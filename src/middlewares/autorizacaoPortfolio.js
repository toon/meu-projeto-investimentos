const definirHabilidadesPara = require('../config/casl-permissions');

const autorizar = (req, res, next) => {
  // Pegamos o ID do portfólio da URL: /api/portfolios/:idPortfolio/ativos
  const { idPortfolio } = req.params;

  if (!idPortfolio) {
    return res.status(400).json({ erro: "O ID do portfólio é obrigatório para esta operação." });
  }

  // Geramos as permissões dinâmicas para este usuário NESTE portfólio
  const habilidades = definirHabilidadesPara(req.usuario, idPortfolio);

  // Injetamos no 'req' para que o Controller não precise recalcular nada
  req.habilidades = habilidades;

  next();
};

module.exports = autorizar;