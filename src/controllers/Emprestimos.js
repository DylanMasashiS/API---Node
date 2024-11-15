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

    async confirmarRetirada(req, res) {
        const { emp_cod } = req.params;

        try {
            // Atualiza o status do empréstimo para 'confirmado'
            const [result] = await db.query('UPDATE emprestimos SET emp_status = "Confirmado" WHERE emp_cod = ? AND emp_status = "pendente"', [emp_cod]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Empréstimo não encontrado ou já confirmado.' });
            }

            // Atualiza a data de retirada
            const emp_data_retirada = new Date();
            await db.query('UPDATE emprestimos SET emp_data_retirada = ? WHERE emp_cod = ?', [emp_data_retirada, emp_cod]);

            // Atualiza o exemplar como não disponível
            const [exemplar] = await db.query('SELECT exe_cod FROM emprestimos WHERE emp_cod = ?', [emp_cod]);
            await db.query('UPDATE exemplares SET exe_devol = 0 WHERE exe_cod = ?', [exemplar.exe_cod]);

            res.status(200).json({
                message: 'Retirada confirmada com sucesso!',
            });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao confirmar retirada', error: err });
        }
    },

    async cadastrarEmprestimos(req, res) {
        const { usu_cod, exe_cod, emp_data_emp } = req.body;
    
        try {
            // Verifica se o exemplar está disponível
            const [exemplarDisponivel] = await db.query('SELECT * FROM exemplares WHERE exe_cod = ? AND exe_devol = 1', [exe_cod]);
    
            if (!exemplarDisponivel) {
                return res.status(400).json({ message: 'Este exemplar não está disponível para empréstimo.' });
            }
    
            // Calcula a data limite de retirada (3 dias após a solicitação)
            const emp_data_limite_retirada = new Date();
            emp_data_limite_retirada.setDate(emp_data_limite_retirada.getDate() + 3);  // 3 dias após a solicitação
    
            // Inicializa o status como "pendente" para aguardar a confirmação do administrador
            const emp_status = 'pendente';
    
            // Define a data prevista de devolução (14 dias após a data de retirada confirmada)
            const emp_data_prevista_devol = new Date();
            emp_data_prevista_devol.setDate(emp_data_prevista_devol.getDate() + 17); // 3 dias de retirada + 14 dias de empréstimo
    
            // Cria o novo registro de empréstimo
            const novoEmprestimo = {
                usu_cod,
                exe_cod,
                emp_data_emp,
                emp_data_limite_retirada,
                emp_data_prevista_devol,
                emp_status,
                emp_reserva: true, // Reservado até confirmação
            };
    
            // Insere o empréstimo na tabela
            const [result] = await db.query('INSERT INTO emprestimos SET ?', novoEmprestimo);
    
            // Atualiza a disponibilidade do exemplar para "não disponível" até a retirada ou devolução
            await db.query('UPDATE exemplares SET exe_devol = 0 WHERE exe_cod = ?', [exe_cod]);
    
            res.status(201).json({
                sucesso: true,
                mensagem: 'Empréstimo solicitado com sucesso! A retirada será confirmada pelo administrador.',
                data: {
                    emp_cod: result.insertId,
                    ...novoEmprestimo
                }
            });
        } catch (err) {
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar empréstimo', error: err.message });
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

