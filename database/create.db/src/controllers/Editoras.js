// const db = require('../database/connection');

module.exports = {
    async listarEditoras(request, response) {
        try {
            // instruções SQL
            const sql = `SELECT 
                edt_cod, edt_nome, edt_foto;`;
            // executa instruções SQL e armazena o resultado na variável usuários
            const editoras = await db.query(sql);
            // armazena em uma variável o número de registros retornados
            const nItens = editoras[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de editoras.',
                dados: editoras[0],
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
    async cadastrarEditoras(request, response) {
        try {
            // parâmetros recebidos no corpo da requisição
            const { edt_nome, edt_foto} = request.body;
            // instrução SQL
            const sql = `INSERT INTO editoras
                (edt_cod, edt_nome, edt_foto) 
                VALUES (?, ?, ?)`;
            // definição dos dados a serem inseridos em um array
            const values = [edt_cod, edt_nome, edt_foto];
            // execução da instrução sql passando os parâmetros
            const execSql = await db.query(sql, values);
            // identificação do ID do registro inserido
            const edt_cod = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro da editora efetuado com sucesso.',
                dados: edt_cod
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
    async editarEditoras(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const { edt_nome, edt_foto } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { edt_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE editoras SET edt_cod = ?, edt_nome = ?, 
                        edt_foto = ?
                        WHERE edt_cod = ?;`;
            // preparo do array com dados que serão atualizados
            const values = [edt_nome, edt_foto, edt_cod];
            // execução e obtenção de confirmação da atualização realizada
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Editora ${edt_cod} atualizada com sucesso!`,
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
    async apagarEditoras(request, response) {
        try {
            // parâmetro passado via url na chamada da api pelo front-end
            const { edt_cod } = request.params;
            // comando de exclusão
            const sql = `DELETE FROM editoras WHERE edt_cod = ?`;
            // array com parâmetros da exclusão
            const values = [edt_cod];
            // executa instrução no banco de dados
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Editora ${edt_cod} excluída com sucesso`,
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