const db = require('../database/connection');


const express = require('express'); 
const router = express.Router(); 

module.exports = {
    async listarEmprestimos(request, response) {
        try {
            const {usu_nome} = request.body

            const nomePesq = usu_nome ? `%${usu_nome}%` : '%%';
            // instruções SQL
            const sql = `SELECT emp.emp_cod, DATE_FORMAT(emp.emp_data_emp, '%d/%m/%Y') AS Empréstimo, DATE_FORMAT(emp.emp_data_devol, '%d/%m/%Y') AS Devolução , liv.liv_nome, liv.liv_foto_capa, 
                            exe.exe_cod, aut.aut_nome, usu.usu_cod, usu.usu_nome,
                            (SELECT usu_nome FROM usuarios WHERE usu_cod = emp.func_cod) as Funcionario
                            FROM emprestimos emp
                            INNER JOIN exemplares exe ON exe.exe_cod = emp.exe_cod
                            INNER JOIN livros liv ON liv.liv_cod = exe.liv_cod
                            INNER JOIN livros_autores lau ON lau.liv_cod = liv.liv_cod 
                            INNER JOIN autores aut ON aut.aut_cod = lau.aut_cod
                            INNER JOIN usuarios usu ON usu.usu_cod = emp.usu_cod
                            WHERE usu_nome = "Kawany Bandeira" && usu_ativo = 1;`;

            // executa instruções SQL e armazena o resultado na variável usuários
            const values = [nomePesq];

            const emprestimos = await db.query(sql, values);
            // armazena em uma variável o número de registros retornados
            const nItens = emprestimos[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de empréstimos.',
                dados: emprestimos[0],
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
    async cadastrarEmprestimos(request, response) {
        try {
            // parâmetros recebidos no corpo da requisição
            const { usu_cod, exe_cod, emp_data_emp, emp_data_devol, emp_devolvido, emp_renovacao, emp_data_renov, func_cod} = request.body;
            // instrução SQL
            const sql = `INSERT INTO emprestimos
                (usu_cod, exe_cod, emp_data_emp, emp_data_devol, emp_devolvido, emp_renovacao, emp_data_renov, func_cod) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
            // definição dos dados a serem inseridos em um array
            const values = [usu_cod, exe_cod, emp_data_emp, emp_data_devol, emp_devolvido, emp_renovacao, emp_data_renov, func_cod];
            // execução da instrução sql passando os parâmetros
            const execSql = await db.query(sql, values);
            // identificação do ID do registro inserido
            const emp_cod = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro do empréstimo efetuado com sucesso.',
                dados: emp_cod
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
    async editarEmprestimos(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const { usu_cod, exe_cod, emp_data_emp, emp_data_devol, emp_devolvido, emp_renovacao, emp_data_renov, func_cod } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { emp_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE emprestimos SET usu_cod = ?, 
                        exe_cod = ?, emp_data_emp = ?, emp_data_devol = ?, emp_devolvido = ?,
                        emp_renovacao = ?, emp_data_renov = ?, func_cod = ?
                        WHERE emp_cod = ?;`;
            // preparo do array com dados que serão atualizados
            const values = [usu_cod, exe_cod,emp_data_emp, emp_data_devol, emp_devolvido, emp_renovacao, emp_data_renov, func_cod, emp_cod];
            // execução e obtenção de confirmação da atualização realizada
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Empréstimo ${emp_cod} atualizado com sucesso!`,
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
    async apagarEmprestimos(request, response) {
        try {
            // parâmetro passado via url na chamada da api pelo front-end
            const { emp_cod } = request.params;
            // comando de exclusão
            const sql = `DELETE FROM emprestimos WHERE emp_cod = ?`;
            // array com parâmetros da exclusão
            const values = [emp_cod];
            // executa instrução no banco de dados
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Empréstimo ${emp_cod} excluído com sucesso`,
                dados: excluir[0].affectedRows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }    
    },
    async renovarEmprestimos(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const {emp_data_devol, emp_renovacao, emp_data_renov, func_cod } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { emp_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE emprestimos SET emp_data_devol = ?,
                        emp_renovacao = ?, emp_data_renov = ?, func_cod = ?
                        WHERE emp_cod = ?;`;
            // preparo do array com dados que serão atualizados
            const values = [emp_data_devol, emp_renovacao, emp_data_renov, func_cod, emp_cod];
            // execução e obtenção de confirmação da atualização realizada
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Renovação do empréstimo ${emp_cod} atualizado com sucesso!`,
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
    }
}

