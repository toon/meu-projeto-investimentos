const express = require("express");
const router = express.Router({ mergeParams: true });
const categoriaAtivoController = require("../controllers/categoriaAtivoController");
// const autenticar = require("../middlewares/autenticar");
// const autorizar = require("../middlewares/autorizacaoPortfolio");
const { autenticar, autorizacaoPortfolio: autorizar } = require("../middlewares");

router.use(autenticar);
router.use(autorizar);

router.post("/", categoriaAtivoController.criar);
router.get("/", categoriaAtivoController.listar);

module.exports = router;
