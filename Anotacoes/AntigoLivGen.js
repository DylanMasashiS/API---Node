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