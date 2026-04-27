require('dotenv').config(); // Carrega as variáveis do .env
const express = require('express');
const conectarBanco = require('./config/bancoDados');
// const autenticacaoRoutes = require('./routes/autenticacaoRoutes');
// const portfolioRoutes = require("./routes/portfolioRoutes");
// const classeAtivoRoutes = require("./routes/classeAtivoRoutes");
// const categoriaAtivoRoutes = require("./routes/categoriaAtivoRoutes");
const routes = require('./routes');

const app = express();

// 1. Middlewares Globais
app.use(express.json()); // Permite que o Express entenda JSON no corpo (body) das requisições

// 2. Conexão com a Base de Dados
conectarBanco();

// 3. Definição de Rotas
console.log("Configurando rotas de autenticação...");
// app.use('/api/auth', autenticacaoRoutes);
// app.use('/api/portfolios', portfolioRoutes);
// app.use('/api/classes-ativos', classeAtivoRoutes);
// app.use("/api/portfolios/:idPortfolio/categorias-ativos", categoriaAtivoRoutes);
app.use("/api", routes);


// 4. Tratamento de Rotas não encontradas (404)
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

// 5. Inicialização do Servidor
const PORTA = process.env.PORTA || 3000;
app.listen(PORTA, () => {
  console.log(`🚀 Servidor a correr na porta ${PORTA}`);
});

module.exports = app; // Exportamos para facilitar os testes