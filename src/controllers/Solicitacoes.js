const express = require('express');
const router = express.Router();
// const db = require('../database/connection');

// Listar todas as solicitações
module.exports = {
        async listarSolicitacoes(request, response) {
        try {
            const sql = `SELECT * FROM solicitacoes ORDER BY sol_data DESC`;
            const values = [sol_cod];
            const execSql = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Solicitações listadas com sucesso.',
                dados: solicitacoes
            });
        } catch (error) {
            console.error('Erro ao listar solicitações:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar solicitações.',
                dados: error.message
            });
        }
    },

    // Confirmar uma solicitação
    async confirmarSolicitacao (request, response) {
        try {
            const { sol_cod } = request.params;

            // Atualiza o status da solicitação para 'confirmada'
            const sql = `UPDATE solicitacoes SET sol_status = 'Confirmada' WHERE sol_cod = ?`;

            const values = [sol_cod];

            const execSql = await db.query(sql, values);
            // armazena em uma variável o número de registros retornados
            const nItens = solicitacao[0].length;

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Solicitação não encontrada.',
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Solicitação confirmada com sucesso.',
            });
        } catch (error) {
            console.error('Erro ao confirmar solicitação:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao confirmar solicitação.',
                dados: error.message
            });
        }
    },

    // Cancelar uma solicitação
    async cancelarSolicitacao (request, response) {
        try {
            const { sol_cod } = request.params;

            // Atualiza o status da solicitação para 'cancelada'
            const sql = `UPDATE solicitacoes SET sol_status = 'Cancelada' WHERE sol_cod = ?`;

            const values = [sol_cod];
            const execSql = await db.query(sql, values);
            const sol_cod = execSql[0].insertId;

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Solicitação não encontrada.',
                    dados: sol_cod
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Solicitação cancelada com sucesso.',
            });
        } catch (error) {
            console.error('Erro ao cancelar solicitação:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao cancelar solicitação.',
                dados: error.message
            });
        }
    },

    // Excluir uma solicitação
    async deletarSolicitacao(request, response) {
        try {
            const { sol_cod } = request.params;

            // Deleta a solicitação
            const sql = `DELETE FROM solicitacoes WHERE sol_cod = ?`;

            const values = [sol_cod];

            const execSql = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Solicitação não encontrada.',
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Solicitação excluída com sucesso.',
            });
        } catch (error) {
            console.error('Erro ao excluir solicitação:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao excluir solicitação.',
                dados: error.message
            });
        }
    }
}

module.exports = router;
