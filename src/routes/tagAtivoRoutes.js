const express = require("express");
const router = express.Router();
const { tagAtivoController } = require("../controllers");
const { autenticar, autorizacaoGlobal } = require("../middlewares");

router.get(
  "/",
  autenticar,
  autorizacaoGlobal(),
  tagAtivoController.listar,
);

router.get(
  "/raizes",
  autenticar,
  autorizacaoGlobal(),
  tagAtivoController.listarRaizes,
);

router.get(
  "/:id",
  autenticar,
  autorizacaoGlobal(),
  tagAtivoController.buscarPorId,
);

router.post(
  "/",
  autenticar,
  autorizacaoGlobal("gerir", "TagAtivo"),
  tagAtivoController.criar,
);

module.exports = router;
