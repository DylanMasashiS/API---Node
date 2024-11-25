// Importações
const db = require('../database/connection');
var fs = require('fs-extra');
const express = require('express');
const router = express.Router();

// Função para gerar URL da capa do livro
function geraUrl(liv_foto_capa) {
    return liv_foto_capa ? '/public/uploads/CapaLivros/' + liv_foto_capa : null;
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
                    edt.edt_cod, edt.edt_nome, 
                    aut.aut_nome, aut.aut_cod, 
                    gen.gen_cod,
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
                    AND exe.exe_ativo = 1
                    AND liv.liv_ativo = 1
                    GROUP BY liv.liv_cod, liv.liv_nome, liv.liv_pha_cod, liv.liv_categ_cod,
                             liv.liv_foto_capa, edt.edt_nome, aut.aut_nome, aut.aut_cod, gen.gen_nome, gen.gen_cod
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
            console.log(liv_foto_capa)

            const sql = `INSERT INTO livros
                (liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, liv_ativo, liv_foto_capa) 
                VALUES (?, ?, ?, ?, ?, ?, ?);`;

            const values = [liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, livAtivoParsed, liv_foto_capa];
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
                dados: {
                    liv_cod: liv_cod
                }
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
            const sql = `SELECT liv.liv_cod, liv.liv_nome, liv.liv_pha_cod, liv.liv_categ_cod,
            liv.liv_foto_capa, liv.liv_desc, 
            edt.edt_cod, edt.edt_nome, 
            aut.aut_nome, aut.aut_cod, exe.exe_ativo, liv.liv_ativo,
            gen.gen_cod, gen.gen_nome
            FROM livros liv
            INNER JOIN editoras edt ON edt.edt_cod = liv.edt_cod
            INNER JOIN livros_autores lau ON lau.liv_cod = liv.liv_cod
            INNER JOIN autores aut ON aut.aut_cod = lau.aut_cod
            INNER JOIN livros_generos lge ON lge.liv_cod = liv.liv_cod
            INNER JOIN generos gen ON gen.gen_cod = lge.gen_cod 
            INNER JOIN exemplares exe ON liv.liv_cod = exe.liv_cod
            ORDER BY liv.liv_nome ASC`;

            const livros = await db.query(sql);
            const resultado = livros[0].map(livro => ({
                ...livro,
                liv_foto_capa: geraUrl(livro.liv_foto_capa)
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de todos os livros (ativos e inativos).',
                dados: resultado
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
            const { liv_cod, liv_nome, liv_desc, aut_cod, edt_cod, gen_cod } = request.body;
    
            const sql = `UPDATE livros
                         JOIN livros_autores AS lau ON livros.liv_cod = lau.liv_cod
                         JOIN livros_generos AS lge ON livros.liv_cod = lge.liv_cod
                         SET liv_nome = ?, liv_desc = ?, lau.aut_cod = ?, lge.gen_cod = ?, edt_cod = ?
                         WHERE livros.liv_cod = ?`;
            const values = [liv_nome, liv_desc, aut_cod, gen_cod, edt_cod, liv_cod];
    
            // Executando a consulta
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
    async statusLivros(request, response) {
        const { liv_cod, currentStatus } = request.body; // Código do livro e o status atual (1 para ativo, 0 para inativo)
        
        try {
            // Se o currentStatus for 1 (ativo), definimos como 0 (inativo) e vice-versa
            const novoStatusLivro = currentStatus === 0 ? 1 : 0;
            const novoStatusExemplar = currentStatus === 0 ? 1 : 0;
            
            // Atualiza o status do livro
            const query = `UPDATE livros SET liv_ativo = ? WHERE liv_cod = ?`;
            const [result] = await db.query(query, [novoStatusLivro, liv_cod]);
            
            // Verifica se a atualização do livro foi realizada
            if (result.affectedRows === 0) {
                return response.status(404).json({ error: "Livro não encontrado." });
            }
    
            // Atualiza o status dos exemplares relacionados
            const updateExemplaresQuery = `UPDATE exemplares SET exe_ativo = ? WHERE liv_cod = ?`;
            await db.query(updateExemplaresQuery, [novoStatusExemplar, liv_cod]);
            
            return response.json({ message: "Status do livro e exemplares alterados com sucesso!" });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Erro ao alterar o status." });
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
            return response.status(200).json({ sucesso: true, dados: img });
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
