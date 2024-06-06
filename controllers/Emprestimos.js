// const db = require('../database/connection');

module.exports = {
    async listarEmprestimos(request, response) {
        try {
            const {usu_nome} = request.body
            const nomePesq = usu_nome ? `%${usu_nome}%` : '%%';
            // instruções SQL
            const sql = `SELECT 
                emp.emp_cod, usu.usu_nome as usu_nome, exe_cod, emp_data_emp, emp_data_devol, emp_devolvido
                FROM emprestimos emp
                Inner Join exemplares exe ON exe.exe_cod = emp.exe_cod
                Inner Join usuarios usu ON usu.usu_cod = emp.usu_cod
                Where usu.usu_nome = ?;`;
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
            const { usu_cod, exe_cod, emp_data_emp, emp_data_devol, emp_devolvido} = request.body;
            // instrução SQL
            const sql = `INSERT INTO emprestimos
                (emp_cod, usu_cod, exe_cod, emp_data_emp, emp_data_devol, emp_devolvido) 
                VALUES (?, ?, ?, ?, ?, ?)`;
            // definição dos dados a serem inseridos em um array
            const values = [emp_cod, usu_cod, exe_cod, emp_data_emp, emp_data_devol, emp_devolvido];
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
            const { usu_cod, exe_cod, emp_data_emp, emp_data_devol, emp_devolvido } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { emp_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE emprestimos SET emp_cod = ?, usu_cod = ?, 
                        exe_cod = ?, emp_data_emp = ?, emp_data_devol = ?, emp_devolvido = ?
                        WHERE emp_cod = ?;`;
            // preparo do array com dados que serão atualizados
            const values = [usu_cod, exe_cod, emp_cod, emp_data_emp, emp_data_devol, emp_devolvido, emp_cod];
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
    }
}