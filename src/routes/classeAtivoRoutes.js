const express = require("express");
const router = express.Router();
const classeAtivoController = require("../controllers/classeAtivoController");
// const autenticar = require("../middlewares/autenticar");

// // REMOVA AS CHAVES { } se o arquivo autorizacao.js exportar apenas uma função
// const carregarHabilidades = require("../middlewares/autorizacaoGlobal");
const { autenticar, autorizacaoGlobal } = require("../middlewares");

router.use(autenticar);
router.use(autorizacaoGlobal); 

router.get("/", autenticar, classeAtivoController.listar);

// Só passa para o controller se o middleware validar 'gerir' 'ClasseAtivo'
router.post(
  "/",
  autenticar,
  autorizacaoGlobal("gerir", "ClasseAtivo"),
  classeAtivoController.criar,
);

module.exports = router;
