// const db = require('../database/connection');

module.exports = {
    async listarCursos(request, response) {
        try {
            // instruções SQL
            const sql = `SELECT 
                cur_cod, cur_nome, cur_ativo;`;
            // executa instruções SQL e armazena o resultado na variável usuários
            const cursos = await db.query(sql);
            // armazena em uma variável o número de registros retornados
            const nItens = cursos[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de cursos.',
                dados: cursos[0],
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
    async cadastrarCursos(request, response) {
        try {
            // parâmetros recebidos no corpo da requisição
            const { cur_nome, cur_ativo} = request.body;
            // instrução SQL
            const sql = `INSERT INTO cursos
                (cur_cod, cur_nome, cur_ativo) 
                VALUES (?, ?, ?)`;
            // definição dos dados a serem inseridos em um array
            const values = [cur_cod, cur_nome, cur_ativo];
            // execução da instrução sql passando os parâmetros
            const execSql = await db.query(sql, values);
            // identificação do ID do registro inserido
            const cur_cod = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro do curso efetuado com sucesso.',
                dados: cur_cod
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
    async editarCursos(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const { cur_nome, cur_ativo } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { cur_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE cursos SET cur_cod = ?, cur_nome = ?, 
                        cur_ativo = ?
                        WHERE cur_cod = ?;`;
            // preparo do array com dados que serão atualizados
            const values = [cur_nome, cur_ativo, cur_cod];
            // execução e obtenção de confirmação da atualização realizada
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Curso ${cur_cod} atualizado com sucesso!`,
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
    async apagarCursos(request, response) {
        try {
            // parâmetro passado via url na chamada da api pelo front-end
            const { cur_cod } = request.params;
            // comando de exclusão
            const sql = `DELETE FROM cursos WHERE cur_cod = ?`;
            // array com parâmetros da exclusão
            const values = [cur_cod];
            // executa instrução no banco de dados
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Curso ${cur_cod} excluído com sucesso`,
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