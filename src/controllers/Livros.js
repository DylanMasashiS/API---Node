const db = require('../database/connection');
var fs = require('fs-extra');

function geralUrl (e) {
    let img = e.liv_foto ? e.liv_foto : 'default.jpg';
    if (!fs.existsSync ('./public/uploads/CapaLivros/' + img)) {
        img = 'livros.jpg';
    }

    const livros = {
        liv_cod:  e.liv_cod,
        liv_nome: e.liv_nome,
        liv_pha_cod: e.liv_pha_cod,
        liv_categ_cod: e.liv_categ_cod,
        liv_desc: e.liv_desc,
        edt_nome: e.edt_nome,
        liv_foto: 'http://10.67.23.44:3333/public/uploads/CapaLivros/' + img
    }   

    return livros;
}

module.exports = {
    async listarLivros(request, response) {
        try {
            const {liv_nome, edt} = request.body;

            // instruções SQL
            const sql = `SELECT liv.liv_cod, liv.liv_nome, liv.liv_pha_cod, 
            liv.liv_categ_cod, liv.liv_foto_capa, 
            liv.liv_desc, edt.edt_nome, edt.edt_foto 
            from livros liv 
            inner join editoras edt on edt.edt_cod = liv.edt_cod
            inner join autores aut on aut.aut_cod = liv.aut_cod
            inner join generos gen on gen.gen_cod = liv.gen_cod
            where liv.liv_nome like ?;`;

            const values = [livPesq];
            // executa instruções SQL e armazena o resultado na variável usuários
            const livros = await db.query(sql, values);
            // armazena em uma variável o número de registros retornados
            const nItens = livros[0].length;

            const resultado = livros[0].map(geralUrl);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de livros.',
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
    async cadastrarLivros(request, response) {
        try {
            // parâmetros recebidos no corpo da requisição
            const { liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod} = request.body;

            const img = request.file.filename;
            // instrução SQL
            const sql = `INSERT INTO livros
                (liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, liv_foto_capa) 
                VALUES (?, ?, ?, ?, ?, ?)`;
            // definição dos dados a serem inseridos em um array
            const values = [liv_pha_cod, liv_categ_cod, liv_nome, liv_desc, edt_cod, img];
            // execução da instrução sql passando os parâmetros
            const execSql = await db.query(sql, values);
            // identificação do ID do registro inserido
            const liv_cod = execSql[0].insertId;

            const dados = {
                liv_cod,
                liv_pha_cod,
                liv_categ_cod,
                liv_nome,
                liv_desc,
                edt_cod,
                liv_foto_capa: 'http://localhost:3333/public/uploads/CapaLivros/' + img
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro do livro efetuado com sucesso.',
                dados
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
                        liv_desc = ?, edt_cod = ?, liv_foto_capa = ?
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