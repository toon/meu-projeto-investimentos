const definirHabilidadesPara = require("../config/casl-permissions");

const autorizacaoGlobal = (acao, entidade) => {
  return (req, res, next) => {
    // 1. Carrega as habilidades (se já não estiverem carregadas)
    if (!req.habilidades) {
      req.habilidades = definirHabilidadesPara(req.usuario, null);
    }

    // 2. Verifica a permissão (Ex: se pode 'gerir' 'ClasseAtivo')
    if (req.habilidades.cannot(acao, entidade)) {
      return res.status(403).json({
        erro: `Acesso negado. Você não tem permissão para ${acao} ${entidade}.`,
      });
    }

    next();
  };
};

module.exports = autorizacaoGlobal;
