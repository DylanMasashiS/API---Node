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

    async cadastrarEmprestimos(req, res) {
        const { usu_cod, exe_cod, emp_data_emp, func_cod } = req.body;  // Adiciona func_cod
        
        if (!func_cod) {
            return res.status(400).json({ message: 'Código do funcionário (func_cod) é obrigatório.' });
        }
    
        try {
            // Verifica se o exemplar está disponível (não emprestado e não reservado)
            const [exemplarDisponivel] = await db.query(
                `SELECT * FROM emprestimos 
                 WHERE exe_cod = ? AND emp_status IN ('Pendente', 'Reservado') 
                 AND (emp_data_limite_retirada >= NOW() OR emp_data_prevista_devol >= NOW())`,
                [exe_cod]
            );
    
            if (exemplarDisponivel.length > 0) {
                return res.status(400).json({ message: 'Este exemplar já está reservado ou emprestado no período solicitado.' });
            }
    
            // Verifica se o exemplar está disponível para empréstimo
            const [exemplar] = await db.query('SELECT * FROM exemplares WHERE exe_cod = ? AND exe_devol = 1', [exe_cod]);
    
            if (!exemplar) {
                return res.status(400).json({ message: 'Este exemplar não está disponível para empréstimo.' });
            }
    
            // Calcula a data limite de retirada (3 dias após a solicitação)
            const emp_data_limite_retirada = new Date();
            emp_data_limite_retirada.setDate(emp_data_limite_retirada.getDate() + 3);  // 3 dias após a solicitação
    
            // Inicializa o status como "pendente" para aguardar a confirmação do administrador
            const emp_status = 'Pendente';
    
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
                func_cod  // Adiciona o código do funcionário no novo empréstimo
            };
    
            // Insere o empréstimo na tabela
            const [result] = await db.query('INSERT INTO emprestimos SET ?', novoEmprestimo);
    
            // Atualiza a disponibilidade do exemplar para "não disponível" até a retirada ou devolução
            await db.query('UPDATE exemplares SET exe_status = "Indisponível", exe_devol = 0 WHERE exe_cod = ?', [exe_cod]);
    
            // Formatando as datas para o formato 'YYYY-MM-DD'
            const formatDate = (date) => {
                return date.toISOString().split('T')[0];  // Retorna no formato 'YYYY-MM-DD'
            };
    
            res.status(201).json({
                sucesso: true,
                mensagem: 'Empréstimo solicitado com sucesso! A retirada será confirmada pelo administrador. 😊',
                data: {
                    emp_cod: result.insertId,
                    usu_cod,
                    exe_cod,
                    emp_data_emp: formatDate(new Date(emp_data_emp)),  // Formata a data de empréstimo
                    emp_data_limite_retirada: formatDate(emp_data_limite_retirada),  // Formata a data limite de retirada
                    emp_data_prevista_devol: formatDate(emp_data_prevista_devol),  // Formata a data prevista de devolução
                    emp_status,
                    emp_reserva: true,
                    func_cod  // Retorna o código do funcionário que fez a operação
                }
            });
        } catch (err) {
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar empréstimo. 😔', error: err.message });
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

    async devolverEmprestimos(req, res) {
        const { emp_cod, exe_cod } = req.body;
    
        try {
            // Verifica se há uma reserva e o limite de retirada
            const [resultadoEmprestimo] = await db.query(
                `SELECT * FROM emprestimos
                 WHERE emp_cod = ? AND emp_status IN ('Pendente', 'Reservado') 
                 AND emp_data_limite_retirada >= NOW()`, 
                [emp_cod]
            );
    
            if (resultadoEmprestimo.length === 0) {
                return res.status(400).json({ message: 'Empréstimo não encontrado ou já devolvido, ou limite de retirada expirado.' });
            }
    
            // Atualiza o status do empréstimo para "Devolvido"
            const [resultadoDevolucao] = await db.query(
                `UPDATE emprestimos 
                 SET emp_status = 'Devolvido' 
                 WHERE emp_cod = ? AND emp_status = 'Pendente'`, 
                [emp_cod]
            );
    
            // Verifica se o empréstimo foi atualizado
            if (resultadoDevolucao.affectedRows === 0) {
                return res.status(400).json({ message: 'Erro ao devolver o empréstimo.' });
            }
    
            // Atualiza o status do exemplar
            const [exemplar] = await db.query(
                `SELECT * FROM exemplares WHERE exe_cod = ?`, 
                [exe_cod]
            );
    
            if (!exemplar) {
                return res.status(400).json({ message: 'Exemplar não encontrado.' });
            }
    
            if (exemplar.exe_reservado) {
                // Se houver reserva, muda o status para "indisponível"
                await db.query('UPDATE exemplares SET exe_status = "Indisponível" WHERE exe_cod = ?', [exe_cod]);
    
                // Se houver a reserva, podemos definir o status de devolução para "reservado" até o limite de retirada
                await db.query('UPDATE emprestimos SET emp_status = "Reservado" WHERE exe_cod = ? AND emp_status = "Pendente"', [exe_cod]);
            } else {
                // Se não houver reserva, deixa o exemplar disponível
                await db.query('UPDATE exemplares SET exe_status = "Disponível" WHERE exe_cod = ?', [exe_cod]);
            }
    
            res.status(200).json({
                sucesso: true,
                mensagem: 'Empréstimo devolvido e exemplar atualizado. 😊',
            });
        } catch (err) {
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao processar devolução. 😔', error: err.message });
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
            const { usu_cod, emp_data_devol, emp_data_renov, func_cod } = request.body;
            const { emp_cod } = request.params;
    
            // Formatar datas para o formato aceito pelo MySQL
            const formattedEmpDataDevol = new Date(emp_data_devol).toISOString().split('T')[0];
            const formattedEmpDataRenov = new Date(emp_data_renov).toISOString().split('T')[0];
    
            const sql = `UPDATE emprestimos 
                         SET emp_data_devol = ?, emp_renovacao = 1, emp_devolvido = 1, 
                             emp_data_renov = ?, func_cod = ?
                         WHERE emp_cod = ? AND usu_cod = ?;`;
    
            const values = [formattedEmpDataDevol, formattedEmpDataRenov, func_cod, emp_cod, usu_cod];
            const atualizaDados = await db.query(sql, values);
    
            return response.status(200).json({
                sucesso: true,
                mensagem: `Renovação do empréstimo ${emp_cod} atualizada com sucesso!`,
                dados: atualizaDados[0].affectedRows
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

