const definirHabilidadesPara = require("../config/casl-permissions");

const autorizacaoGlobal = (acao, entidade) => {
  return (req, res, next) => {
    // 1. Garante que as habilidades estão carregadas
    if (!req.habilidades) {
      req.habilidades = definirHabilidadesPara(req.usuario, null);
    }

    // 2. Se passaste acao e entidade, ele VALIDA e pode BARRAR
    if (acao && entidade) {
      if (req.habilidades.cannot(acao, entidade)) {
        return res.status(403).json({
          erro: `Acesso negado. Você não tem permissão para ${acao} ${entidade}.`,
        });
      }
    }

    // 3. SE CHEGOU AQUI, TEM DE TER O NEXT! (O teu código provavelmente parava aqui)
    next();
  };
};

module.exports = autorizacaoGlobal;
