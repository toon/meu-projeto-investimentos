const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const autenticar = async (req, res, next) => {
  const cabecalho = req.headers.authorization;

  if (!cabecalho) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  // Espera-se o formato "Bearer <token>"
  const partes = cabecalho.split(' ');
  const [esquema, token] = partes;

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    
    // IMPORTANTE: Buscamos o usuário no banco para que o req.usuario 
    // tenha os "acessos" atualizados para o CASL usar depois.
    const usuario = await Usuario.findById(decodificado.id).select("+papel");
    
    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    req.usuario = usuario;
    return next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};

module.exports = autenticar;