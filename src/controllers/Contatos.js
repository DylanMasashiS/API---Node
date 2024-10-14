const db = require('../database/connection');
const express = require('express'); 
const router = express.Router(); 

module.exports = {
    async listarContatos(request, response) {
        try {

            const {cont_cod} = request.body;
            // instruções SQL
            const sql = `SELECT esc_nome, esc_endereco, esc_tel, 
                                esc_cel, esc_email  
                                FROM contatos
                                WHERE cont_cod = ?;`;

            const values = [cont_cod];
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
    async editarContatos (request, response) {
        try{

            const {esc_nome, esc_endereco, esc_tel, esc_cel, esc_email} = request.body;

            const { cont_cod } = request.params;

            // instruções SQL
            const sql = `UPDATE contatos SET esc_nome = ?, esc_endereco = ?, 
                        esc_tel = ?, esc_cel = ?, esc_email = ?  
                        WHERE cont_cod = ?;`;

            const values = [esc_nome, esc_endereco, esc_tel, esc_cel, esc_email, cont_cod];
            // executa instruções SQL e armazena o resultado na variável usuários
            const atualizaDados = await db.query(sql, values);
            // armazena em uma variável o número de registros retornados

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista dos Contatos atualizada com sucesso.',
                dados: atualizaDados[0].affectedRows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
}