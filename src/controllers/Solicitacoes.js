const express = require('express');
const router = express.Router();
// const db = require('../database/connection'); // Certifique-se de que a conexão com o banco de dados está correta

module.exports = {
    
// Listar usuários pendentes
    async listarSolicitacoes() {
        const query = 'SELECT usu_cod, usu_nome, usu_email FROM usuarios WHERE usu_aprovado = 0';
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Erro ao listar usuários pendentes:', err);
                return;
            }
            console.log('Usuários pendentes:');
            results.forEach(usuario => {
                console.log(`ID: ${usu_cod}, Nome: ${usu_nome}, Email: ${usu_email}`);
            });
        });
    },

    // Aprovar um usuário
    async aprovarSolicitacao(usu_cod) {
        const query = 'UPDATE usuarios SET usu_aprovado = 1 WHERE usu_cod = ?';
        connection.query(query, [usu_cod], (err, results) => {
            if (err) {
                console.error('Erro ao aprovar usuário:', err);
                return;
            }
            console.log(`Usuário ${usu_cod} aprovado.`);
        });
    },

    // Rejeitar um usuário
    async inativarSolicitacao(usu_cod) {
        const query = 'UPDATE usuarios SET usu_ativo = 0 WHERE usu_cod = ?';
        connection.query(query, [usu_cod], (err, results) => {
            if (err) {
                console.error('Erro ao inativar usuário:', err);
                return;
            }
            console.log(`Usuário ${usu_cod} inativado.`);
        });
    }
}
// module.exports = router;
