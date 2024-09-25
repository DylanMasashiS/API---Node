// const db = require('../database/connection');
var fs = require('fs-extra');

const express = require('express');
const router = express.Router();
const db = require('../database/connection');

function geraUrl(liv_foto_capa) {
    let img = liv_foto_capa ? liv_foto_capa : 'default.jpg';
    if (!fs.existsSync('./public/uploads/CapaLivros/' + img)) {
        img = 'livros.jpg';
    }

    return '/public/uploads/CapaLivros/' + img;
}

module.exports = {
    async listarLivros(request, response) {
        try {
            const { liv_nome, aut_nome, edt_nome, gen_nome, liv_cod } = request.body;
            const livPesq = liv_cod ? liv_cod : `%%`;

            // Cria um array de parâmetros para a consulta
            let params = [];
            let whereClauses = [];
            let havingClauses = [];

            // Adiciona cláusulas de pesquisa baseadas nos critérios fornecidos
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
            if (liv_cod){
                whereClauses.push("liv.liv_cod = ?");
                params.push(livPesq);
            }

            // Monta a consulta SQL dinamicamente com base nos critérios
            const sql = `SELECT liv.liv_cod, liv.liv_nome, liv.liv_foto_capa, liv.liv_desc, 
                                edt.edt_nome, edt.edt_foto, aut.aut_nome, aut.aut_foto,
                                gen.gen_nome, gen.gen_foto,
                                
                         COUNT(exe.exe_cod) as exemplares,
                            (SELECT COUNT(*) FROM emprestimos emp 
                     		INNER JOIN exemplares  subexe ON emp.exe_cod = subexe.exe_cod            
                     		WHERE subexe.liv_cod = liv.liv_cod
                            AND emp.emp_devolvido = 0) as emprestados,
                                (COUNT(exe.exe_cod) - (SELECT COUNT(*) FROM emprestimos emp 
                     			INNER JOIN exemplares  subexe ON emp.exe_cod = subexe.exe_cod            
                     			WHERE subexe.liv_cod = liv.liv_cod
                     			AND emp.emp_devolvido = 0)) AS disponivel,
                                
                         GROUP_CONCAT(DISTINCT gen.gen_nome) AS generos
                        FROM livros         liv
                        INNER JOIN editoras       edt ON edt.edt_cod = liv.edt_cod
                        INNER JOIN livros_autores lau ON lau.liv_cod = liv.liv_cod
                        INNER JOIN autores        aut ON aut.aut_cod = lau.aut_cod
                        INNER JOIN livros_generos lge ON lge.liv_cod = liv.liv_cod
                        INNER JOIN generos        gen ON gen.gen_cod = lge.gen_cod 
                        INNER JOIN exemplares     exe ON liv.liv_cod = exe.liv_cod 
                        ${whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : ''}
                        AND exe.exe_data_saida IS NULL
                        GROUP BY liv.liv_cod, liv.liv_nome, liv.liv_foto_capa, edt.edt_nome, 
                        edt.edt_foto, aut.aut_nome, aut.aut_foto
                        ${havingClauses.length > 0 ? 'HAVING ' + havingClauses.join(' AND ') : ''}`;

            // Executa a consulta SQL
            const livros = await db.query(sql, params);
            const nItens = livros[0].length;

            const resultado = livros[0].map(livros => ({
                ...livros,
                liv_foto_capa: geraUrl(livros.liv_foto_capa)
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de livros.',
                dados: resultado,
                nItens
            });
        } catch (error) {
            console.error('Erro na requisição:', error);  // Registra o erro para depuração
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async cadastrarLivros(request, response) {
        try {
            // parâmetros recebidos no corpo da requisição
            const { liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod } = request.body;

            const img = request.file.filename;
            // instrução SQL
            const sql = `INSERT INTO livros
                (liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, liv_foto_capa) 
                VALUES (?, ?, ?, ?, ?, ?)`;
            // definição dos dados a serem inseridos em um array
            const values = [liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, img];
            // execução da instrução sql passando os parâmetros
            const execSql = await db.query(sql, values);
            // identificação do ID do registro inserido
            const liv_cod = execSql[0].insertId;

            const dados = {
                liv_cod,
                liv_pha_cod,
                liv_categ_cod,
                liv_nome,
                liv_desc,
                edt_cod,
                liv_foto_capa: '/public/uploads/CapaLivros/' + img
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro do livro efetuado com sucesso.',
                dados
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
    async editarLivros(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const { liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, liv_foto_capa } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { liv_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE livros SET liv_pha_cod = ?, liv_categ_cod = ?, liv_nome = ?, 
                        liv_desc = ?, edt_cod = ?, liv_foto_capa = ?
                        WHERE liv_cod = ?;`;
            // preparo do array com dados que serão atualizados
            const values = [liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, liv_foto_capa, liv_cod];
            // execução e obtenção de confirmação da atualização realizada
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Livro ${liv_cod} atualizado com sucesso!`,
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
    async apagarLivros(request, response) {
        try {
            // parâmetro passado via url na chamada da api pelo front-end
            const { liv_cod } = request.params;
            // comando de exclusão
            const sql = `DELETE FROM livros WHERE liv_cod = ?`;
            // array com parâmetros da exclusão
            const values = [liv_cod];
            // executa instrução no banco de dados
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Livro ${liv_cod} excluído com sucesso`,
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