const db = require('../database/connection');
const fs = require('fs-extra');


const express = require('express'); 
const router = express.Router(); 

function geraUrl (gen_foto) {
    let img = gen_foto ? gen_foto : 'default.jpg';
    if (!fs.existsSync ('./public/uploads/CapaGeneros/' + img)) {
        img = 'genero.jpg';
    }

    return '/public/uploads/CapaGeneros/' + img;
}

module.exports = {
    async listarGeneros(request, response) {
        try {
            const {gen_nome} = request.body;
            const genPesq = gen_nome ? `%${gen_nome}%` : `%%`;
            // instruções SQL
            const sql = `SELECT gen_cod, gen_nome, gen_foto 
                        from generos
                        where gen_nome like ? order by gen_nome;`;

            const values = [genPesq];
            // executa instruções SQL e armazena o resultado na variável usuários
            const generos = await db.query(sql, values);
            // armazena em uma variável o número de registros retornados
            const nItens = generos[0].length;

            const resultado = generos[0].map(generos => ({
                ...generos,
                gen_foto: geraUrl(generos.gen_foto), 
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de gêneros.',
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
    async cadastrarGeneros(request, response) {
        try {
            // parâmetros recebidos no corpo da requisição
            const { gen_nome } = request.body;

            const img = request.file.filename;
            // instrução SQL
            const sql = `INSERT INTO generos
                (gen_nome, gen_foto) 
                VALUES (?, ?)`;
            // definição dos dados a serem inseridos em um array
            const values = [gen_nome, img];
            // execução da instrução sql passando os parâmetros
            const execSql = await db.query(sql, values);
            // identificação do ID do registro inserido
            const gen_cod = execSql[0].insertId;

            const dados = {
                gen_cod,
                gen_nome,
                gen_foto: '/public/uploads/CapaGeneros/' + img
            };

            return response.status(200).json({
                sucesso: true,
                mensagem: `Cadastro do gênero ${gen_cod} efetuado com sucesso.`,
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
    async editarGeneros(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const { gen_nome, gen_foto } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { gen_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE generos SET gen_nome = ?, 
                        gen_foto = ?
                        WHERE gen_cod = ?;`;
            // preparo do array com dados que serão atualizados
            const values = [gen_nome, gen_foto, gen_cod];
            // execução e obtenção de confirmação da atualização realizada
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Gênero ${gen_cod} atualizado com sucesso!`,
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
    async apagarGeneros(request, response) {
        try {
            // parâmetro passado via url na chamada da api pelo front-end
            const { gen_cod } = request.body;
            // comando de exclusão
            const sql = `DELETE FROM generos WHERE gen_cod = ?`;
            // array com parâmetros da exclusão
            const values = [gen_cod];
            // executa instrução no banco de dados
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Gênero ${gen_cod} excluído com sucesso`,
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