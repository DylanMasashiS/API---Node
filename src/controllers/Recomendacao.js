const db = require('../database/connection');
var fs = require('fs-extra');

const express = require('express');
const router = express.Router();

function geraUrl(liv_foto_capa) {
    let img = liv_foto_capa ? liv_foto_capa : 'default.jpg';
    if (!fs.existsSync('./public/uploads/CapaLivros/' + img)) {
        img = 'livros.jpg';
    }
    return '/public/uploads/CapaLivros/' + img;
}

module.exports = {
    async listarRecomendacao(request, response) {
        try {
            const { cur_cod, cur_nome, liv_nome, aut_nome, edt_nome, gen_nome, liv_cod } = request.body;

            let params = [];
            let whereClauses = [];
            let havingClauses = [];

            // Adiciona cláusulas de pesquisa baseadas nos critérios fornecidos
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
            if (liv_nome) {
                whereClauses.push("liv.liv_nome LIKE ?");
                params.push(`%${liv_nome}%`);  
            }
            if (liv_cod) {
                whereClauses.push("liv.liv_cod = ?");
                params.push(liv_cod);
            }
            if (cur_nome) {
                whereClauses.push("cur.cur_nome LIKE ?");
                params.push(`%${cur_nome}%`);
            }
            if (cur_cod) {
                whereClauses.push("cur.cur_cod = ?");
                params.push(cur_cod);
            }

            // instruções SQL
            const sql = `SELECT 
            rec.rcm_cod, cur.cur_nome, cur.cur_cod, liv.liv_cod, liv.liv_foto_capa, liv.liv_nome, liv.liv_desc,
            usu.usu_nome, aut.aut_nome, aut.aut_foto, gen.gen_nome, gen.gen_foto, edt.edt_nome, edt.edt_foto, 
            rec.rcm_mod1 = 1 AS rcm_mod1, rec.rcm_mod2 = 1 AS rcm_mod2, 
            rec.rcm_mod3 = 1 AS rcm_mod3,  rec.rcm_mod4 = 1 AS rcm_mod4, 
            COUNT(exe.exe_cod) as exemplares,
            ( 
                SELECT COUNT(*) 
                FROM emprestimos emp 
                INNER JOIN exemplares  subexe ON emp.exe_cod = subexe.exe_cod            
                WHERE subexe.liv_cod = liv.liv_cod
                AND emp.emp_devolvido = 0
            ) as emprestados,
            (
                COUNT(exe.exe_cod) - (    SELECT COUNT(*) 
                FROM emprestimos emp 
                INNER JOIN exemplares  subexe ON emp.exe_cod = subexe.exe_cod            
                WHERE subexe.liv_cod = liv.liv_cod
                AND emp.emp_devolvido = 0)
            ) AS disponivel
             
            from recomendacao rec
            inner join usuarios_cursos ucu on ucu.usu_cod = rec.usu_cod
            inner join cursos cur on cur.cur_cod = ucu.cur_cod
            inner join livros liv on liv.liv_cod = rec.liv_cod
            inner join exemplares exe on exe.liv_cod = liv.liv_cod 
            inner join usuarios usu on usu.usu_cod = rec.usu_cod 
            inner join livros_autores lau on lau.liv_cod = liv.liv_cod
            inner join autores aut on aut.aut_cod = lau.aut_cod
            inner join livros_generos lge on liv.liv_cod = lge.liv_cod
            inner join generos gen on gen.gen_cod = lge.gen_cod
            inner join editoras edt on edt.edt_cod = liv.edt_cod
            ${whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : ''}
            GROUP BY rec.rcm_cod, liv.liv_cod, liv.liv_nome, liv.liv_foto_capa, edt.edt_nome, 
            edt.edt_foto, aut.aut_nome, aut.aut_foto, gen.gen_nome, gen.gen_foto,
            cur.cur_nome, cur.cur_cod, usu.usu_nome
            ${havingClauses.length > 0 ? 'HAVING ' + havingClauses.join(' AND ') : ''}`;

            // AND exe.exe_data_saida IS NULL
            //  where cur.cur_cod = ?;

            
            const recomendacao = await db.query(sql, params);
            // armazena em uma variável o número de registros retornados
            const nItens = recomendacao[0].length;

            const resultado = recomendacao[0].map(recomendacao => ({
                ...recomendacao,
                liv_foto_capa: geraUrl(recomendacao.liv_foto_capa)

            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de recomendações.',
                dados: resultado,
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
    async cadastrarRecomendacao(request, response) {
        try {
            // parâmetros recebidos no corpo da requisição
            const { cur_cod, liv_cod, usu_cod, rcm_mod1, rcm_mod2, rcm_mod3, rcm_mod4 } = request.body;
            // instrução SQL
            const sql = `INSERT INTO recomendacao
                (cur_cod, liv_cod, usu_cod, rcm_mod1, rcm_mod2, rcm_mod3, rcm_mod4) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            // definição dos dados a serem inseridos em um array
            const values = [cur_cod, liv_cod, usu_cod, rcm_mod1, rcm_mod2, rcm_mod3, rcm_mod4];
            // execução da instrução sql passando os parâmetros
            const execSql = await db.query(sql, values);
            // identificação do ID do registro inserido
            const rcm_cod = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: `Cadastro da recomendação ${rcm_cod} efetuada com sucesso.`,
                dados: rcm_cod
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
    async editarRecomendacao(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const { cur_cod, liv_cod, usu_cod, rcm_mod1, rcm_mod2, rcm_mod3, rcm_mod4 } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { rcm_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE recomendacao SET cur_cod = ?, liv_cod = ?,
             usu_cod = ?, rcm_mod1 = ?, rcm_mod2 = ?, rcm_mod3 = ?, rcm_mod4 = ?
             Where rcm_cod = ?;`;
            // preparo do array com dados que serão atualizados
            const values = [cur_cod, liv_cod, usu_cod, rcm_mod1, rcm_mod2, rcm_mod3, rcm_mod4, rcm_cod];
            // execução e obtenção de confirmação da atualização realizada
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Recomendação ${rcm_cod} atualizada com sucesso!`,
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
    async apagarRecomendacao(request, response) {
        try {
            // parâmetro passado via url na chamada da api pelo front-end
            const { rcm_cod } = request.params;
            // comando de exclusão
            const sql = `DELETE FROM recomendacao WHERE rcm_cod = ?`;
            // array com parâmetros da exclusão
            const values = [rcm_cod];
            // executa instrução no banco de dados
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Recomendação ${rcm_cod} excluída com sucesso`,
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