// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const senhaController = require('../controllers/senhaController');

// Rota para solicitar recuperação de senha
router.post('/esquecer_senha', senhaController.esquecerSenha);

// Rota para redefinir a senha
router.post('/recuperar_senha', senhaController.redefinirSenha);

module.exports = router;
