const express = require("express");
const router = express.Router();
const { classeAtivoController } = require("../controllers");
const { autenticar, autorizacaoGlobal } = require("../middlewares");

// GET: Apenas autenticar (qualquer um logado vê)
// Usamos autorizacaoGlobal() vazio apenas para carregar as habilidades no req.habilidades
router.get("/", 
  autenticar, 
  autorizacaoGlobal(), 
  classeAtivoController.listar
);

// POST: Autenticar + Validar se é Admin
router.post("/", 
  autenticar, 
  autorizacaoGlobal("gerir", "ClasseAtivo"), 
  classeAtivoController.criar
);

module.exports = router;
