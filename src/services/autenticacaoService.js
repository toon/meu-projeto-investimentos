
const { Usuario, Portfolio } = require("../models"); // Recupera do index.js da pasta models
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { portfolioSchema } = require("../validators");

class AutenticacaoService {
  async registrar({ nome, email, senha }) {
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      throw new Error("Este e-mail já está em uso.");
    }

    // 1. Criamos o portfólio já com a marcação isDefault: true
    const dadosPortfolioInicial = {
      nome: `Meu Primeiro Portfólio de ${nome}`,
      descricao: `Portfólio principal de ${nome}`,
      isDefault: true, // Definimos como padrão no nascimento
    };

    const portfolioValidado = portfolioSchema.parse(dadosPortfolioInicial);
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Criar portfólio primeiro para ter o ID
    const novoPortfolio = await Portfolio.create(portfolioValidado);

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaCriptografada,
      acessos: [
        {
          idPortfolio: novoPortfolio._id,
          papel: "dono",
        },
      ],
    });

    return novoUsuario;
  }

  async login(email, senha) {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      throw new Error("Credenciais inválidas.");
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      throw new Error("Credenciais inválidas.");
    }

    // 2. Buscar o ID do portfólio padrão do usuário
    // Procuramos nos acessos do usuário qual portfólio está marcado como isDefault no model Portfolio
    const portfolioPadrao = await Portfolio.findOne({
      _id: { $in: usuario.acessos.map((a) => a.idPortfolio) },
      isDefault: true,
    }).select("_id");

    // Fallback: se não houver um padrão, pega o primeiro da lista de acessos
    const idPortfolioPadrao = portfolioPadrao
      ? portfolioPadrao._id
      : usuario.acessos.length > 0
        ? usuario.acessos[0].idPortfolio
        : null;

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
      },
      idPortfolioPadrao, // Agora o Controller recebe e repassa este ID
    };
  }
}

module.exports = new AutenticacaoService();
