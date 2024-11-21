const db = require('../database/connection');
const express = require('express'); 
const router = express.Router(); 

module.exports = {
    // Listar os livros e seus gêneros
    async listarLivros_Generos(request, response) {
        try {
            const { lge_cod } = request.body;
            const sql = `SELECT 
                lge_cod, gen_cod, liv_cod 
                FROM livros_generos
                WHERE lge_cod = ?
                ORDER BY gen_cod;`;

            const values = [lge_cod];
            const livros_generos = await db.query(sql, values);
            const nItens = livros_generos[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista dos Livros e seus Gêneros.',
                dados: livros_generos[0],
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

    // Listar os gêneros disponíveis para um livro (aqueles que o livro ainda não tem)
    async dispGeneros(request, response) {
        try {
            const { liv_cod } = request.body;
    
            const sql = `
                SELECT lge.liv_cod, gen.gen_cod, gen.gen_nome
                FROM generos AS gen
                LEFT JOIN livros_generos AS lge ON gen.gen_cod = lge.gen_cod 
                AND lge.liv_cod = ?
                WHERE lge.liv_cod IS NULL;
            `;
    
            const values = [liv_cod];
    
            const [generos_disponiveis] = await db.query(sql, values);
    
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de gêneros disponíveis para o livro.',
                dados: generos_disponiveis,
            });
    
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar gêneros disponíveis.',
                dados: error.message,
            });
        }
    },

    // Cadastrar novo gênero para o livro
    async cadastrarLivros_Generos(request, response) {
        try {
            const { gen_cod, liv_cod } = request.body;
            const sql = `INSERT INTO livros_generos
                (gen_cod, liv_cod) 
                VALUES (?, ?)`;
            const values = [gen_cod, liv_cod];
            const execSql = await db.query(sql, values);
            const lge_cod = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: `Cadastro de Livros e seus Gêneros ${lge_cod} efetuado com sucesso.`,
                dados: lge_cod
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    // Editar gênero de um livro
    async editarLivros_Generos(request, response) {
        try {
            const { liv_cod, gen_cod } = request.body;
            const { lge_cod } = request.params;
            const sql = `UPDATE livros_generos SET liv_cod = ?, 
                        gen_cod = ?
                        WHERE lge_cod = ?;`;
            const values = [liv_cod, gen_cod, lge_cod];
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Livro e Gênero ${lge_cod} atualizado com sucesso!`,
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

    // Remover gênero específico de um livro (não apagar outros gêneros)
    async apagarLivros_Generos(request, response) {
        try {
            // Recebe livro e gênero como parâmetros na URL
            const { liv_cod, gen_cod } = request.params;

            // Comando SQL para excluir a relação entre o livro e o gênero
            const sql = `DELETE FROM livros_generos WHERE liv_cod = ? AND gen_cod = ?`;
            const values = [liv_cod, gen_cod];

            // Executa a exclusão
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Gênero ${gen_cod} do Livro ${liv_cod} excluído com sucesso.`,
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
