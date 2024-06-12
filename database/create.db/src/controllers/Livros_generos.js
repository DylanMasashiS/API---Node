// const db = require('../database/connection');

module.exports = {
    async listarLivros_Generos(request, response) {
        try {
            // instruções SQL
            const sql = `SELECT 
                lge_cod, gen_cod, liv_cod;`;
            // executa instruções SQL e armazena o resultado na variável usuários
            const livros_generos = await db.query(sql);
            // armazena em uma variável o número de registros retornados
            const nItens = livros_generos[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista dos Livros e seus Gêneros.',
                dados: livros_generos[0],
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
    async cadastrarLivros_Generos(request, response) {
        try {
            // parâmetros recebidos no corpo da requisição
            const {gen_cod, liv_cod} = request.body;
            // instrução SQL
            const sql = `INSERT INTO livros_generos
                (lge_cod, gen_cod, liv_cod) 
                VALUES (?, ?, ?)`;
            // definição dos dados a serem inseridos em um array
            const values = [lge_cod, gen_cod, liv_cod];
            // execução da instrução sql passando os parâmetros
            const execSql = await db.query(sql, values);
            // identificação do ID do registro inserido
            const lge_cod = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de Livros e seus Gêneros efetuado com sucesso.',
                dados: lge_cod
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
    async editarLivros_Generos(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const { gen_cod, liv_cod } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { lge_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE livros_generos SET lge_cod = ?, gen_cod = ?, 
                        liv_cod = ?
                        WHERE lge_cod = ?;`;
            // preparo do array com dados que serão atualizados
            const values = [gen_cod, liv_cod, lge_cod];
            // execução e obtenção de confirmação da atualização realizada
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Livro e Gênero ${lge_cod} atualizado com sucesso!`,
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
    async apagarLivros_Generos(request, response) {
        try {
            // parâmetro passado via url na chamada da api pelo front-end
            const { lge_cod } = request.params;
            // comando de exclusão
            const sql = `DELETE FROM livros_generos WHERE lge_cod = ?`;
            // array com parâmetros da exclusão
            const values = [lge_cod];
            // executa instrução no banco de dados
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Livro e Gênero ${lge_cod} excluído com sucesso`,
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