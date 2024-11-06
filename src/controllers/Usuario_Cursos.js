const db = require('../database/connection');
const express = require('express'); 
const router = express.Router(); 

module.exports = {
    async listarUsuarios_Cursos(request, response) {
        try {

            const {ucu_cod} = request.body;
            // instruções SQL
            const sql = `SELECT 
                ucu_cod, usu_cod, cur_cod
                FROM usuarios_cursos
                INNER JOIN cursos on cur_cod = cur_cod
                WHERE ucu_cod = ?
                ORDER BY cur_cod;`;

            const values = [ucu_cod];
            // executa instruções SQL e armazena o resultado na variável usuários
            const usuarios_cursos = await db.query(sql, values);
            // armazena em uma variável o número de registros retornados
            const nItens = usuarios_cursos[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista dos Usuários e seus Cursos.',
                dados: usuarios_cursos[0],
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

    async dispUsucursos(request, response) {
        try {
            const { usu_cod } = request.body;
            
            // Consulta SQL que retorna cursos que o usuário ainda não possui
            const sql = `
                        SELECT cur.cur_cod, cur.nome
                        FROM cursos AS cur
                        WHERE cur.cur_cod NOT IN (
                            SELECT ucu.cur_cod
                            FROM usuarios_cursos AS ucu
                            WHERE ucu.usu_cod = ?
                            ORDER BY cur.cur_cod
                        );`;
    
            const values = [usu_cod];

            const cursos_disponiveis = await db.query(sql, values);
    
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de cursos disponíveis para o usuário.',
                dados: cursos_disponiveis[0],
            });
            
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar cursos disponíveis.',
                dados: error.message,
            });
        }
    },
    
    async cadastrarUsuarios_Cursos(request, response) {
        try {
            // parâmetros recebidos no corpo da requisição
            const {usu_cod, cur_cod} = request.body;
            // instrução SQL
            const sql = `INSERT INTO usuarios_cursos
                            (usu_cod, cur_cod) 
                            VALUES (?, ?)`;
            // definição dos dados a serem inseridos em um array
            const values = [usu_cod, cur_cod];
            // execução da instrução sql passando os parâmetros
            const execSql = await db.query(sql, values);
            // identificação do ID do registro inserido
            const ucu_cod = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: `Cadastro de Usuários e Cursos ${ucu_cod} efetuado com sucesso.`,
                dados: ucu_cod
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
    async editarUsuarios_Cursos(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const { usu_cod, cur_cod } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { ucu_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE usuarios_cursos SET usu_cod = ?, 
                        cur_cod = ?
                        WHERE ucu_cod = ?;`;
            // preparo do array com dados que serão atualizados
            const values = [usu_cod, cur_cod, ucu_cod];
            // execução e obtenção de confirmação da atualização realizada
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário e Curso ${ucu_cod} atualizado com sucesso!`,
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
    async apagarUsuarios_Cursos(request, response) {
        try {
            // parâmetro passado via url na chamada da api pelo front-end
            const { ucu_cod } = request.params;
            // comando de exclusão
            const sql = `DELETE FROM usuarios_cursos WHERE ucu_cod = ?`;
            // array com parâmetros da exclusão
            const values = [ucu_cod];
            // executa instrução no banco de dados
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário e Curso ${ucu_cod} excluído com sucesso`,
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