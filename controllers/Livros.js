// const db = require('../database/connection');

module.exports = {
    async listarLivros(request, response) {
        try {
            // instruções SQL
            const sql = `liv.liv_cod, liv.liv_desc, 
            liv.liv_categ_cod, liv.liv_foto_capa, 
            liv.liv_nome, liv.liv_pha_cod, edt.edt_nome, edt.edt_foto 
            from livros liv 
            inner join editora edt on edt.edt_cod = liv.edt_cod 
            where liv.liv_cod = ?;`;
            // executa instruções SQL e armazena o resultado na variável usuários
            const livros = await db.query(sql);
            // armazena em uma variável o número de registros retornados
            const nItens = livros[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de livros.',
                dados: livros[0],
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
    async cadastrarLivros(request, response) {
        try {
            // parâmetros recebidos no corpo da requisição
            const { liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, liv_foto_capa} = request.body;
            // instrução SQL
            const sql = `INSERT INTO livros
                (liv_cod, liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, liv_foto_capa) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            // definição dos dados a serem inseridos em um array
            const values = [liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, liv_foto_capa];
            // execução da instrução sql passando os parâmetros
            const execSql = await db.query(sql, values);
            // identificação do ID do registro inserido
            const liv_cod = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro do livro efetuado com sucesso.',
                dados: liv_cod
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
    async editarLivros(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const { liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, liv_foto_capa } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { liv_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE livros SET liv_pha_cod = ?, liv_categ_cod = ?, liv_nome = ?, 
                        liv_desc, edt_cod, liv_foto_capa
                        WHERE liv_cod = ?;`;
            // preparo do array com dados que serão atualizados
            const values = [liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, liv_foto_capa, liv_cod];
            // execução e obtenção de confirmação da atualização realizada
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Livro ${liv_cod} atualizado com sucesso!`,
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
    async apagarLivros(request, response) {
        try {
            // parâmetro passado via url na chamada da api pelo front-end
            const { liv_cod } = request.params;
            // comando de exclusão
            const sql = `DELETE FROM livros WHERE liv_cod = ?`;
            // array com parâmetros da exclusão
            const values = [liv_cod];
            // executa instrução no banco de dados
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Livro ${liv_cod} excluído com sucesso`,
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