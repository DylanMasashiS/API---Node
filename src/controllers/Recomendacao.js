const db = require('../database/connection');
var fs = require('fs-extra');  

const express = require('express'); 
const router = express.Router(); 

function geraUrl (liv_foto_capa) {
    let img = liv_foto_capa ? liv_foto_capa : 'default.jpg';
    if (!fs.existsSync ('./public/uploads/CapaLivros/' + img)) {
        img = 'livros.jpg';
    }
    return '/public/uploads/CapaLivros/' + img;
}

module.exports = {
    async listarRecomendacao(request, response) {
        try {
            const {usu_cod} = request.body;

            // instruções SQL
            const sql = `    SELECT liv.liv_cod, 
           liv.liv_nome, 
           liv.liv_foto_capa, 
           liv.liv_desc, 
           edt.edt_nome, 
           edt.edt_foto,
           aut.aut_nome, 
           aut.aut_foto,
           gen.gen_nome, 
           gen.gen_foto,
           count(exe.exe_cod) as exemplares,
           (    SELECT COUNT(*) 
			      FROM emprestimos emp 
			INNER JOIN exemplares  subexe ON emp.exe_cod = subexe.exe_cod            
			     WHERE subexe.liv_cod = liv.liv_cod
                   AND emp.emp_devolvido = 0) as emprestados,
           (count(exe.exe_cod) - (    SELECT COUNT(*) 
										FROM emprestimos emp 
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
     WHERE liv.liv_cod = 74
       AND exe.exe_data_saida IS NULL
  GROUP BY liv.liv_cod, 
           liv.liv_nome, 
           liv.liv_foto_capa, 
           edt.edt_nome, 
           edt.edt_foto, 
           aut.aut_nome, 
           aut.aut_foto;`;

            const values = [usu_cod];
            // executa instruções SQL e armazena o resultado na variável usuários
            const livros = await db.query(sql, values);
            // armazena em uma variável o número de registros retornados
            const nItens = livros[0].length;

            const resultado = livros[0].map(livros => ({
                ...livros,
                liv_foto_capa: geraUrl(livros.liv_foto_capa)

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
            const {cur_cod, liv_cod, usu_cod, rcm_mod1, rcm_mod2, rcm_mod3, rcm_mod4} = request.body;
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
                mensagem: 'Cadastro da recomendação efetuada com sucesso.',
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