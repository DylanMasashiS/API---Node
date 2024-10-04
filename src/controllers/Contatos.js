const db = require('../database/connection');
const express = require('express'); 
const router = express.Router(); 

module.exports = {
    async listarContatos(request, response) {
        try {

            const {cont_cod} = request.body;
            // instruções SQL
            const sql = `SELECT 
                esc_ FROM contatos
                where cont_cod = ?;`;

            const values = [lau_cod];
            // executa instruções SQL e armazena o resultado na variável usuários
            const contatos = await db.query(sql, values);
            // armazena em uma variável o número de registros retornados
            const nItens = contatos[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista dos Contatos.',
                dados: contatos[0],
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