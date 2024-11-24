// const db = require('../database/connection');
// const fs = require('fs-extra');
// const express = require('express');
// const router = express.Router();

// module.exports = {
//     async listarLivrosGeneros(request, response) {
//         try {
//             const { liv_cod } = request.params;
//             const sql = `
//             SELECT lge.lge_cod, gen.gen_cod, gen.gen_nome
//             FROM livros_generos AS lge
//             INNER JOIN generos AS gen ON lge.gen_cod = gen.gen_cod
//             WHERE lge.liv_cod = ?
//             ORDER BY gen.gen_nome;
//         `;
//             const values = [liv_cod];
//             const [livros_generos] = await db.query(sql, values);

//             return response.status(200).json({
//                 sucesso: true,
//                 mensagem: 'Gêneros associados ao livro listados com sucesso.',
//                 dados: livros_generos,
//             });
//         } catch (error) {
//             return response.status(500).json({
//                 sucesso: false,
//                 mensagem: 'Erro ao listar gêneros associados ao livro.',
//                 dados: error.message,
//             });
//         }
//     },

//     // Listar gêneros disponíveis
//     async dispGeneros(request, response) {
//         try {
//             const { liv_cod } = request.params;
//             const sql = `
//             SELECT gen.gen_cod, gen.gen_nome
//             FROM generos AS gen
//             LEFT JOIN livros_generos AS lge 
//                 ON gen.gen_cod = lge.gen_cod AND lge.liv_cod = ?
//             WHERE lge.liv_cod IS NULL
//             ORDER BY gen.gen_nome;
//         `;
//             const values = [liv_cod];
//             const [generos_disponiveis] = await db.query(sql, values);

//             return response.status(200).json({
//                 sucesso: true,
//                 mensagem: 'Gêneros disponíveis para o livro listados com sucesso.',
//                 dados: generos_disponiveis,
//             });
//         } catch (error) {
//             return response.status(500).json({
//                 sucesso: false,
//                 mensagem: 'Erro ao listar gêneros disponíveis.',
//                 dados: error.message,
//             });
//         }
//     },

//     // Adicionar novos gêneros ao livro
//     async adicionarLivrosGeneros(request, response) {
//         try {
//             const { gen_cod } = request.body;
//             const { liv_cod } = request.params;

//             const generos = Array.isArray(gen_cod) ? gen_cod : [gen_cod];
//             const sql = `INSERT INTO livros_generos (gen_cod, liv_cod) VALUES ?`;
//             const values = generos.map(g => [g, liv_cod]);
//             const [result] = await db.query(sql, [values]);

//             return response.status(200).json({
//                 sucesso: true,
//                 mensagem: 'Gênero(s) adicionado(s) ao livro com sucesso.',
//                 dados: result.affectedRows,
//             });
//         } catch (error) {
//             return response.status(500).json({
//                 sucesso: false,
//                 mensagem: 'Erro ao adicionar gêneros ao livro.',
//                 dados: error.message,
//             });
//         }
//     },

//     // Remover gêneros do livro
//     async removerLivrosGeneros(request, response) {
//         try {
//             const { gen_cod } = request.body;
//             const { liv_cod } = request.params;

//             const sql = `DELETE FROM livros_generos WHERE liv_cod = ? AND gen_cod = ?`;
//             const values = [liv_cod, gen_cod];
//             const [result] = await db.query(sql, values);

//             if (result.affectedRows > 0) {
//                 return response.status(200).json({
//                     sucesso: true,
//                     mensagem: `Gênero ${gen_cod} removido do livro ${liv_cod} com sucesso.`,
//                 });
//             } else {
//                 return response.status(404).json({
//                     sucesso: false,
//                     mensagem: 'Relação livro-gênero não encontrada.',
//                 });
//             }
//         } catch (error) {
//             return response.status(500).json({
//                 sucesso: false,
//                 mensagem: 'Erro ao remover gênero do livro.',
//                 dados: error.message,
//             });
//         }
//     }
// };

// router.post ('/gen_Disp/:liv_cod', (livros_generosController.dispGeneros));
// router.post ('/liv_generos/:liv_cod', (livros_generosController.listarLivrosGeneros));
// router.patch ('/livros_gen/:liv_cod/:gen_cod', (livros_generosController.adicionarLivrosGeneros));
// router.delete ('/livros_generos/:liv_cod/:gen_cod', (livros_generosController.removerLivrosGeneros));
