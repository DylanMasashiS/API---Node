const db = require('../database/connection');
const fs = require('fs-extra');
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
    async listarEmprestimos(request, response) {
        try {
            const { usu_nome, aut_nome, liv_nome, emp_data_emp } = request.body;

            let params = [];
            let whereClauses = [];

            if (emp_data_emp) {
                whereClauses.push("emp.emp_data_emp = ?");
                params.push(emp_data_emp);
            }

            if (aut_nome) {
                whereClauses.push("aut.aut_nome LIKE ?");
                params.push(`%${aut_nome}%`);
            }
            if (liv_nome) {
                whereClauses.push("liv.liv_nome LIKE ?");
                params.push(`%${liv_nome}%`);
            }
            if (usu_nome) {
                whereClauses.push("usu.usu_nome LIKE ?");
                params.push(`%${usu_nome}%`);
            }

            const sql = `SELECT emp.emp_cod, DATE_FORMAT(emp.emp_data_emp, '%d/%m/%Y') AS Empréstimo, 
                            DATE_FORMAT(emp.emp_data_devol, '%d/%m/%Y') AS Devolução, liv.liv_nome, 
                            liv.liv_foto_capa, exe.exe_cod, aut.aut_nome, usu.usu_cod, usu.usu_nome,
                            gen.gen_nome, gen.gen_cod, cur.cur_nome,
                            (SELECT usu_nome FROM usuarios WHERE usu_cod = emp.func_cod) as Funcionario
                        FROM emprestimos emp
                        INNER JOIN exemplares exe ON exe.exe_cod = emp.exe_cod
                        INNER JOIN livros liv ON liv.liv_cod = exe.liv_cod
                        INNER JOIN livros_autores lau ON lau.liv_cod = liv.liv_cod 
                        INNER JOIN autores aut ON aut.aut_cod = lau.aut_cod
                        INNER JOIN usuarios usu ON usu.usu_cod = emp.usu_cod
                        INNER JOIN livros_generos lge ON lge.liv_cod = liv.liv_cod
                        INNER JOIN generos gen ON gen.gen_cod = lge.gen_cod
                        INNER JOIN usuarios_cursos ucu ON ucu.usu_cod = usu.usu_cod
                        INNER JOIN cursos cur ON cur.cur_cod = ucu.cur_cod
                        ${whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : ''}
                        AND usu_ativo = 1`;

            const emprestimos = await db.query(sql, params);

            const nItens = emprestimos.length;

            const resultado = emprestimos[0].map(emprestimo => ({
                ...emprestimo,
                liv_foto_capa: geraUrl(emprestimo.liv_foto_capa)
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de empréstimos.',
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

    async cadastrarEmprestimos(request, response) {

        const { usu_cod, exe_cod, emp_data_emp, emp_data_devol, emp_devolvido, emp_renovacao, emp_data_renov, func_cod } = request.body;

        try {
            // Verificar se já existe um empréstimo para o exemplar (exe_cod) nas datas fornecidas
            const verificaSql = `
                SELECT COUNT(*) AS conflito 
                FROM emprestimos
                WHERE exe_cod = ?
                AND (
                    (emp_data_emp <= ? AND emp_data_devol >= ?)  -- Novo período de empréstimo se sobrepõe ao existente
                    OR (emp_data_emp <= ? AND emp_data_devol >= ?)  -- Novo período de empréstimo se sobrepõe ao existente
                    OR (emp_data_emp >= ? AND emp_data_devol <= ?)  -- Novo período está contido no existente
                )
                AND emp_devolvido = 0;  -- Verifica apenas empréstimos não devolvidos
            `;

            const [conflito] = await db.query(verificaSql, [
                exe_cod,
                emp_data_emp, emp_data_emp,
                emp_data_devol, emp_data_devol,
                emp_data_emp, emp_data_devol
            ]);

            if (conflito[0].conflito > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Conflito de datas: o exemplar já está emprestado no período solicitado.'
                });
            }

            // Se não há conflito, insere o novo empréstimo
            const sql = `INSERT INTO emprestimos
                        (usu_cod, exe_cod, emp_data_emp, emp_data_devol, emp_devolvido, emp_renovacao, emp_data_renov, func_cod) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

            const values = [usu_cod, exe_cod, emp_data_emp, emp_data_devol, emp_devolvido, emp_renovacao, emp_data_renov, func_cod];

            const execSql = await db.query(sql, values);

            const emp_cod = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: `Cadastro do empréstimo ${emp_cod} efetuado com sucesso.`,
                dados: emp_cod
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
            const values = [usu_cod, exe_cod, emp_data_emp, emp_data_devol, emp_devolvido, emp_renovacao, emp_data_renov, func_cod, emp_cod];
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
            const { emp_data_devol, emp_renovacao, emp_data_renov, func_cod } = request.body;
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

