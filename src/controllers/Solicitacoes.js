const express = require('express');
const router = express.Router();
const db = require('../database/connection'); // Certifique-se de que a conexão com o banco de dados está correta

// Listar todas as solicitações
async function listarSolicitacoes(request, response) {
    try {
        const sql = `SELECT * FROM solicitacoes ORDER BY sol_data DESC`;
        const execSql = await db.query(sql);

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Solicitações listadas com sucesso.',
            dados: execSql[0] // Ajuste conforme o formato de retorno do seu banco de dados
        });
    } catch (error) {
        console.error('Erro ao listar solicitações:', error);
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar solicitações.',
            dados: error.message
        });
    }
}

// Confirmar uma solicitação e deletá-la
async function confirmarSolicitacao(request, response) {
    const { sol_cod } = request.params;

    try {
        // Atualiza o status da solicitação para 'confirmada'
        const updateSql = `UPDATE solicitacoes SET sol_status = 'Confirmada' WHERE sol_cod = ?`;
        const updateValues = [sol_cod];

        const updateResult = await db.query(updateSql, updateValues);

        if (updateResult[0].affectedRows === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: 'Solicitação não encontrada.',
            });
        }

        // Deleta a solicitação após a confirmação
        const deleteSql = `DELETE FROM solicitacoes WHERE sol_cod = ?`;
        const deleteValues = [sol_cod];

        const deleteResult = await db.query(deleteSql, deleteValues);

        if (deleteResult[0].affectedRows === 0) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao excluir a solicitação após confirmação.',
            });
        }

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Solicitação confirmada e excluída com sucesso.',
        });
    } catch (error) {
        console.error('Erro ao confirmar e excluir solicitação:', error);
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao confirmar e excluir solicitação.',
            dados: error.message
        });
    }
}

// Cancelar uma solicitação
async function cancelarSolicitacao(request, response) {
    const { sol_cod } = request.params;

    try {
        // Atualiza o status da solicitação para 'cancelada'
        const sql = `UPDATE solicitacoes SET sol_status = 'Cancelada' WHERE sol_cod = ?`;
        const values = [sol_cod];

        const execSql = await db.query(sql, values);

        if (execSql[0].affectedRows === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: 'Solicitação não encontrada.',
            });
        }

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Solicitação cancelada com sucesso.',
        });
    } catch (error) {
        console.error('Erro ao cancelar solicitação:', error);
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cancelar solicitação.',
            dados: error.message
        });
    }
}

// Excluir uma solicitação
async function deletarSolicitacao(request, response) {
    const { sol_cod } = request.params;

    try {
        // Deleta a solicitação
        const sql = `DELETE FROM solicitacoes WHERE sol_cod = ?`;
        const values = [sol_cod];

        const execSql = await db.query(sql, values);

        if (execSql[0].affectedRows === 0) {
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
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao excluir solicitação.',
            dados: error.message
        });
    }
}

module.exports = router;
