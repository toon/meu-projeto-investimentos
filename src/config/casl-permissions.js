const { AbilityBuilder, createMongoAbility } = require("@casl/ability");

const definirHabilidadesPara = (usuario, idPortfolioAlvo) => {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  // Se não houver usuário, retorna habilidades vazias [cite: 1546]
  if (!usuario) return build();

  // --- REGRAS GLOBAIS (Independem de Portfólio) ---
  if (usuario.papel === "admin") {
    can("gerir", "all"); // Admin tem poder total no sistema [cite: 1224]
  } else {
    can("ler", "ClasseAtivo"); // Qualquer logado pode ver as classes [cite: 6]
  }

  // --- REGRAS ESPECÍFICAS DE PORTFÓLIO ---
  // Só processamos se um ID de portfólio foi passado e o usuário tem acessos
  if (idPortfolioAlvo && usuario.acessos) {
    const vinculo = usuario.acessos.find(
      (a) => a.idPortfolio.toString() === idPortfolioAlvo.toString(),
    );

    // Dentro da função definirHabilidadesPara, onde você checa o 'vinculo'
    if (vinculo) {
      if (vinculo.papel === "dono") {
        can("gerir", "all");
        // can("gerir", "Investidor");
        // Com 'all', ele já ganha 'gerir' em 'CategoriaAtivo' automaticamente.
      } else if (vinculo.papel === "leitor") {
        can("ler", "all");
      }
    }
  }

  return build();
};

module.exports = definirHabilidadesPara;
