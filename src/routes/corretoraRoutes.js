const express = require("express");
const router = express.Router();
const { corretoraController } = require("../controllers");
const { autenticar, autorizacaoGlobal } = require("../middlewares");



// Qualquer usuário logado pode listar as corretoras
router.get("/", autenticar, corretoraController.listar);
router.post("/", autenticar, autorizacaoGlobal("gerir", "Corretora"), corretoraController.criar);

module.exports = router;
