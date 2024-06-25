const db = require('../config/database/connection');

module.exports = {
    async listarRecomendacao(request, response) {
        try {
            const {usu_nome} = request.body;
            const usuPesq = usu_nome ? `%${usu_nome}%` : `%%`;
            // instruções SQL
            const sql = `SELECT 
                rec.rcm_cod, cur.cur_cod, liv.liv_cod, usu.usu_nome, rec.rcm_mod1, rec.rcm_mod2, rec.rcm_mod3, rec.rcm_mod4
                from recomendacao rec
                inner join usuarios usu on usu.usu_cod = rec.usu_cod
                inner join cursos cur on cur.cur_cod = rec.cur_cod
                inner join livros liv on liv.liv_cod = rec.liv_cod
                where usu.usu_nome like ?;`;

            const values = [usuPesq];
            // executa instruções SQL e armazena o resultado na variável usuários
            const recomendacao = await db.query(sql, values);
            // armazena em uma variável o número de registros retornados
            const nItens = recomendacao[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de recomendações.',
                dados: recomendacao[0],
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
            const values = [cur_cod, liv_cod, usu_cod, rcm_mod1, rcm_mod2, rcm_mod3, rcm_mod4];
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