// const db = require('../database/connection');
// var fs = require('fs-extra');   


const express = require('express'); 
const router = express.Router(); 

function geraUrl (aut_foto) {
    let img = aut_foto ? aut_foto : 'default.jpg';
    if (!fs.existsSync ('./public/uploads/CapaAutores/' + img)) {
        img = 'autor.jpg';
    }
    return '/uploads/CapaAutores/' + img;
}

module.exports = {
    async listarAutores(request, response) {
        try {
            const {aut_nome} = request.body;
            const autPesq = aut_nome ? `%${aut_nome}%` : `%%`;
            // instruções SQL
            const sql = `SELECT aut_cod, aut_nome, aut_foto 
                        from autores
                        where aut_nome like ?;`;

            const values = [autPesq];
            // executa instruções SQL e armazena o resultado na variável usuários
            const autores = await db.query(sql, values);
            // armazena em uma variável o número de registros retornados
            const nItens = autores[0].length;

            const resultado = autores[0].map(autores => ({
                ...autores,
                aut_foto: geraUrl(autores.aut_foto)

            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de autores.',
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
    async cadastrarAutores(request, response) {
        try {
            // parâmetros recebidos no corpo da requisição
            const { aut_nome } = request.body;

            //insert com imagem
            const img = request.file.filename;

            // instrução SQL
            const sql = `INSERT INTO autores (aut_nome, aut_foto) VALUES (?, ?);`;
            // definição dos dados a serem inseridos em um array com o insert de foto pela API
            const values = [aut_nome, img];
            // execução da instrução sql passando os parâmetros
            const execSql = await db.query(sql, values);
            // identificação do ID do registro inserido
            const aut_cod = execSql[0].insertId;

            const dados = {
                aut_cod,
                aut_nome,
                img: '/public/uploads/CapaAutores/' + img
            };

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro do autor efetuado com sucesso.',
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
    async editarAutores(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const { aut_nome, aut_foto } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { aut_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE autores SET aut_nome = ?, 
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
            const { aut_cod } = request.body;
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