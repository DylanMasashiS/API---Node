// Importações
const db = require('../database/connection');
var fs = require('fs-extra');
const express = require('express');
const router = express.Router();

// Função para gerar URL da capa do livro
function geraUrl(liv_foto_capa) {
    let img = liv_foto_capa ? liv_foto_capa : 'default.jpg';
    if (!fs.existsSync('./public/uploads/CapaLivros/' + img)) {
        img = 'livros.jpg';
    }
    return '/public/uploads/CapaLivros/' + img;
}

// Exportação dos métodos
module.exports = {
    // Método para listar livros disponíveis para usuários
    async listarLivros(request, response) {
        try {
            const { liv_nome, aut_nome, edt_nome, gen_nome, liv_cod } = request.body;

            let params = [];
            let whereClauses = [];
            let havingClauses = [];

            if (liv_nome) {
                whereClauses.push("liv.liv_nome LIKE ?");
                params.push(`%${liv_nome}%`);
            }
            if (aut_nome) {
                whereClauses.push("aut.aut_nome LIKE ?");
                params.push(`%${aut_nome}%`);
            }
            if (edt_nome) {
                whereClauses.push("edt.edt_nome LIKE ?");
                params.push(`%${edt_nome}%`);
            }
            if (gen_nome) {
                havingClauses.push("GROUP_CONCAT(DISTINCT gen.gen_nome) LIKE ?");
                params.push(`%${gen_nome}%`);
            }
            if (liv_cod) {
                whereClauses.push("liv.liv_cod = ?");
                params.push(liv_cod);
            }

            const sql = `SELECT liv.liv_cod, liv.liv_nome, liv.liv_pha_cod, liv.liv_categ_cod,
                        liv.liv_foto_capa, liv.liv_desc, 
                        edt.edt_cod, edt.edt_nome, aut.aut_nome, aut.aut_cod,
                        GROUP_CONCAT(DISTINCT gen.gen_nome) AS Generos,
                        COUNT(exe.exe_cod) as exemplares,
                        (SELECT COUNT(*) 
                         FROM emprestimos emp 
                         INNER JOIN exemplares subexe ON emp.exe_cod = subexe.exe_cod            
                         WHERE subexe.liv_cod = liv.liv_cod
                         AND emp.emp_devolvido = 0
                         AND subexe.exe_ativo = 1) as emprestados,
                        CASE 
                        WHEN (COUNT(exe.exe_cod) - (SELECT COUNT(*) 
                        FROM emprestimos emp 
                        INNER JOIN exemplares subexe ON emp.exe_cod = subexe.exe_cod            
                        WHERE subexe.liv_cod = liv.liv_cod
                        AND emp.emp_devolvido = 0
                        AND subexe.exe_ativo = 1)) > 0 
                        THEN (COUNT(exe.exe_cod) - (SELECT COUNT(*) 
                        FROM emprestimos emp 
                        INNER JOIN exemplares subexe ON emp.exe_cod = subexe.exe_cod            
                        WHERE subexe.liv_cod = liv.liv_cod
                        AND emp.emp_devolvido = 0
                        AND subexe.exe_ativo = 1))
                        ELSE 0
                        END AS disponivel
                        FROM livros liv
                        INNER JOIN editoras edt ON edt.edt_cod = liv.edt_cod
                        INNER JOIN livros_autores lau ON lau.liv_cod = liv.liv_cod
                        INNER JOIN autores aut ON aut.aut_cod = lau.aut_cod
                        INNER JOIN livros_generos lge ON lge.liv_cod = liv.liv_cod
                        INNER JOIN generos gen ON gen.gen_cod = lge.gen_cod 
                        INNER JOIN exemplares exe ON liv.liv_cod = exe.liv_cod
                        ${whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : ''}
                        AND exe.exe_data_saida IS NULL                        
                        GROUP BY liv.liv_cod, liv.liv_nome, liv.liv_pha_cod, liv.liv_categ_cod,
                                 liv.liv_foto_capa, edt.edt_nome, aut.aut_nome, aut.aut_cod
                        ${havingClauses.length > 0 ? 'HAVING ' + havingClauses.join(' AND ') : ''}
                        ORDER BY liv.liv_nome ASC`;

            const livros = await db.query(sql, params);
            const nItens = livros[0].length;

            const resultado = livros[0].map(livro => ({
                ...livro,
                liv_foto_capa: geraUrl(livro.liv_foto_capa),
                disponivel: livro.disponivel === 0 ? 'Indisponível' : livro.disponivel
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de livros.',
                dados: resultado,
                nItens
            });
        } catch (error) {
            console.error('Erro na requisição:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    // Método para cadastrar novos livros
    async cadastrarLivros(request, response) {
        try {
            const { liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, liv_ativo, liv_foto_capa } = request.body;
            const livAtivoParsed = parseInt(liv_ativo, 10);
            // const img = request.file.filename;
console.log(liv_pha_cod);

            const sql = `INSERT INTO livros
                (liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, liv_ativo, liv_foto_capa) 
                VALUES (?, ?, ?, ?, ?, ?, ?);`;

            const values = [liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, liv_ativo, liv_foto_capa];
            const execSql = await db.query(sql, values);
            const liv_cod = execSql[0].insertId;

            const dados = {
                liv_cod,
                liv_pha_cod,
                liv_categ_cod,
                liv_nome,
                liv_desc,
                edt_cod,
                liv_ativo: livAtivoParsed,
                liv_foto_capa: '/public/uploads/CapaLivros/' + liv_foto_capa
            };

            return response.status(200).json({
                sucesso: true,
                mensagem: `Cadastro do livro ${liv_cod} efetuado com sucesso.`,
                dados
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    // Método para gerenciar livros (mostra todos os livros, incluindo os inativos)
    async gerenciarLivros(request, response) {
        try {
            const sql = `SELECT liv.liv_cod, liv.liv_nome, liv.liv_desc, 
                                edt.edt_nome, 
                                liv.liv_foto_capa, 
                                liv.liv_ativo = 1 AS liv_ativo                                 
                         FROM livros liv
                         INNER JOIN editoras edt ON edt.edt_cod = liv.edt_cod`;

            const livros = await db.query(sql);
            const resultado = livros[0].map(livro => ({
                ...livro,
                liv_foto_capa: geraUrl(livro.liv_foto_capa)
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de todos os livros (ativos e inativos).',
                dados: resultado, 
                qtd: resultado.length
            });
        } catch (error) {
            console.error('Erro na requisição:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    // Método para editar informações de um livro
    async editarLivros(request, response) {
        try {
            const { liv_cod, liv_nome, liv_desc, edt_cod } = request.body;

            const sql = `UPDATE livros 
                         SET liv_nome = ?, liv_desc = ?, edt_cod = ? 
                         WHERE liv_cod = ?`;
            const values = [liv_nome, liv_desc, edt_cod, liv_cod];

            const execSql = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Informações do livro ${liv_cod} atualizadas com sucesso.`,
                dados: execSql[0].affectedRows
            });
        } catch (error) {
            console.error('Erro na requisição:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    // Método para inativar livros
    async inativarLivros(request, response) {
        const { liv_cod } = request.body; // O código do livro

        try {
            // Atualiza o status do livro para inativo
            await db.query('UPDATE livros SET liv_ativo = 0 WHERE liv_cod = ?', [liv_cod]);

            // Atualiza os exemplares relacionados ao livro para inativo
            await db.query('UPDATE exemplares SET exe_ativo = 0 WHERE liv_cod = ?', [liv_cod]);

            // Resposta de sucesso
            return response.json({
                message: "Livro e exemplares inativados com sucesso!",
                livroId: liv_cod
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Erro ao inativar livro e exemplares." });
        }
    },

    async ativarLivros(request, response) {
        const { liv_cod } = request.body; // O código do livro

        try {
            // Atualiza o status do livro para inativo
            await db.query('UPDATE livros SET liv_ativo = 1 WHERE liv_cod = ?', [liv_cod]);

            // Atualiza os exemplares relacionados ao livro para inativo
            await db.query('UPDATE exemplares SET exe_ativo = 1 WHERE liv_cod = ?', [liv_cod]);

            // Resposta de sucesso
            return response.json({
                message: "Livro e exemplares ativados com sucesso!",
                livroId: liv_cod
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Erro ao ativar livro e exemplares." });
        }
    },

    // Método para apagar livros
    async apagarLivros(request, response) {
        try {
            const { liv_cod } = request.body;
            const sql = `DELETE FROM livros WHERE liv_cod = ?`;
            const execSql = await db.query(sql, [liv_cod]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Livro ${liv_cod} apagado com sucesso.`,
                dados: execSql[0].affectedRows
            });
        } catch (error) {
            console.error('Erro na requisição:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    // Método para cadastrar a imagem do livro
    async cadastrarImagemLivro(request, response) {
        try {
            const img = request.file.filename;            

            return response.status(200).json({sucesso: true, dados: img});
        } catch (error) {
            console.error('Erro na requisição:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }
}
