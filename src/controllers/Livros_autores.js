const db = require('../database/connection');
const express = require('express'); 
const router = express.Router(); 

module.exports = {
    async listarLivros_Autores(request, response) {
        try {

            const {lau_cod} = request.body;
            // instruções SQL
            const sql = `SELECT 
                lau_cod, aut_cod, liv_cod 
                FROM livros_autores
                WHERE lau_cod = ?;`;

            const values = [lau_cod];
            // executa instruções SQL e armazena o resultado na variável usuários
            const livros_autores = await db.query(sql, values);
            // armazena em uma variável o número de registros retornados
            const nItens = livros_autores[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista dos Livros e seus Autores.',
                dados: livros_autores[0],
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

    async dispAutores(request, response) {
        try {
            const { liv_cod } = request.body;
    
            // Consulta SQL para retornar autores que o livro ainda não possui
            const sql = `
                SELECT aut.aut_cod, aut.aut_nome
                FROM autores AS aut
                LEFT JOIN livros_autores AS lau ON aut.aut_cod = lau.aut_cod AND lau.liv_cod = ?
                WHERE lau.liv_cod IS NULL;
            `;
    
            const values = [liv_cod];
    
            const [autores_disponiveis] = await db.query(sql, values);
    
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de autores disponíveis para o livro.',
                dados: autores_disponiveis,
            });
    
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar autores disponíveis.',
                dados: error.message,
            });
        }
    },

    async cadastrarLivros_Autores(request, response) {
        try {
            // parâmetros recebidos no corpo da requisição
            const {aut_cod, liv_cod} = request.body;
            // instrução SQL
            const sql = `INSERT INTO livros_autores
                        (aut_cod, liv_cod) 
                        VALUES (?, ?)`;
            // definição dos dados a serem inseridos em um array
            const values = [aut_cod, liv_cod];
            // execução da instrução sql passando os parâmetros
            const execSql = await db.query(sql, values);
            // identificação do ID do registro inserido
            const lau_cod = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: `Cadastro de Livros e seus Autores ${lau_cod} efetuado com sucesso.`,
                dados: lau_cod
                //mensSql: execSql
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async editarLivros_Autores(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const { aut_cod, liv_cod } = request.body;

            // parâmetro recebido pela URL via params ex: /usuario/1
            const { lau_cod } = request.params;

            // instruções SQL
            const sql = `UPDATE livros_autores 
                        SET aut_cod = ?, liv_cod = ?
                        WHERE lau_cod = ?;`;

            // preparo do array com dados que serão atualizados
            const values = [aut_cod, liv_cod, lau_cod];

            // execução e obtenção de confirmação da atualização realizada
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Livro e Autor ${lau_cod} atualizado com sucesso!`,
                dados: atualizaDados[0].affectedRows
                // mensSql: atualizaDados
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async apagarLivros_Autores(request, response) {
        try {
            // parâmetro passado via url na chamada da api pelo front-end
            const { lau_cod } = request.params;

            // comando de exclusão
            const sql = `DELETE FROM livros_autores WHERE lau_cod = ?`;

            // array com parâmetros da exclusão
            const values = [lau_cod];

            // executa instrução no banco de dados
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Livro e Autor ${lau_cod} excluído com sucesso`,
                dados: excluir[0].affectedRows
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