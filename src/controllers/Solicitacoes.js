const express = require('express');
const router = express.Router();
const db = require('../database/connection'); // Certifique-se de que a conexão com o banco de dados está correta

module.exports = {
    
// Listar usuários pendentes
    async listarSolicitacoes(request, response) {
        try {

            const {usu_rm, usu_nome} = request.body;

            let params = [];
            let whereClauses = [];

            // Adiciona cláusulas de pesquisa baseadas nos critérios fornecidos
            if (usu_rm) {
                whereClauses.push("usu.usu_rm LIKE ?");
                params.push(`%${usu_rm}%`);
            }
            if (usu_nome) {
                whereClauses.push("usu.usu_nome LIKE ?");
                params.push(`%${usu_nome}%`);
            }
             // instruções SQL
            const sql = `SELECT usu_rm, usu_nome, usu_email, usu_senha, usu_sexo, cur_nome
                        FROM solicitacoes sol
                        INNER JOIN usuarios usu ON usu.usu_cod = sol.usu_cod
                        INNER JOIN usuarios_cursos ucu ON ucu.usu_cod = usu.usu_cod
                        INNER JOIN cursos cur ON cur.cur_cod = ucu.cur_cod
                        ${whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : ''}
                        AND sol_ativo = 0
                        GROUP BY usu_rm, usu_nome, usu_email, usu_senha, usu_sexo, cur_nome;`;


            // executa instruções SQL e armazena o resultado na variável usuários
            const solicitacoes = await db.query(sql, params);
            // armazena em uma variável o número de registros retornados
            const nItens = solicitacoes[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de cursos.',
                dados: solicitacoes[0],
                nItens
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    // Aprovar um usuário
    async aprovarSolicitacao(request, response) {
        try {
            // instruções SQL
            const sql = `UPDATE 
                solicitacoes SET sol_ativo = 1
                where sol_cod = ?`;

            // executa instruções SQL e armazena o resultado na variável usuários
            const solicitacoes = await db.query(sql);
            // armazena em uma variável o número de registros retornados
            const nItens = solicitacoes[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de solicitacoes.',
                dados: cursos[0],
                nItens
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async inativarSolicitacao(request, response) {
        try {

            // instruções SQL
            const sql = `UPDATE solicitacoes SET sol_ativo = 0
                         where sol_cod = ?`;

            // executa instruções SQL e armazena o resultado na variável usuários
            const solicitacoes = await db.query(sql);
            // armazena em uma variável o número de registros retornados
            const nItens = solicitacoes[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de solicitacoes.',
                dados: solicitacoes[0],
                nItens
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }
}
