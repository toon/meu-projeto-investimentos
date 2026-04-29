const express = require("express");
const router = express.Router();
const { ativoController } = require("../controllers");
const { autenticar, autorizacaoGlobal } = require("../middlewares");

router.get("/", autenticar, ativoController.listar);
router.post(
  "/",
  autenticar,
  autorizacaoGlobal("gerir", "Ativo"),
  ativoController.criar,
);

module.exports = router;
