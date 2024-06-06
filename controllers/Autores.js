// const db = require('../database/connection');

module.exports = {
    async listarAutores(request, response) {
        try {
            // instruções SQL
            const sql = `SELECT 
                aut_cod, aut_nome, aut_foto;`;
            // executa instruções SQL e armazena o resultado na variável usuários
            const autores = await db.query(sql);
            // armazena em uma variável o número de registros retornados
            const nItens = autores[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de autores.',
                dados: autores[0],
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
    async cadastrarAutores(request, response) {
        try {
            // parâmetros recebidos no corpo da requisição
            const { aut_nome, aut_foto} = request.body;
            // instrução SQL
            const sql = `INSERT INTO autores
                (aut_cod, aut_nome, aut_foto) 
                VALUES (?, ?, ?)`;
            // definição dos dados a serem inseridos em um array
            const values = [aut_cod, aut_nome, aut_foto];
            // execução da instrução sql passando os parâmetros
            const execSql = await db.query(sql, values);
            // identificação do ID do registro inserido
            const aut_cod = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro do autor efetuado com sucesso.',
                dados: aut_cod
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
    async editarAutores(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const { aut_nome, aut_foto } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { aut_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE autores SET aut_cod = ?, aut_nome = ?, 
                        aut_foto = ?
                        WHERE aut_cod = ?;`;
            // preparo do array com dados que serão atualizados
            const values = [aut_nome, aut_foto, aut_cod];
            // execução e obtenção de confirmação da atualização realizada
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Autor ${aut_cod} atualizado com sucesso!`,
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
    async apagarAutores(request, response) {
        try {
            // parâmetro passado via url na chamada da api pelo front-end
            const { aut_cod } = request.params;
            // comando de exclusão
            const sql = `DELETE FROM autores WHERE aut_cod = ?`;
            // array com parâmetros da exclusão
            const values = [aut_cod];
            // executa instrução no banco de dados
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Autor ${aut_cod} excluído com sucesso`,
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