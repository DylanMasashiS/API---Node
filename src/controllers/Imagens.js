const db = require('../database/connection');
var fs = require('fs-extra');  
const express = require('express'); 
const router = express.Router(); 

module.exports = {

    async inserirCapa (request, response) {

        const {livro_foto_capa} = request.params;

        try {
            const sql = `INSERT INTO livros (livro_foto_capa) VALUES (?)`;

            const values = [livro_foto_capa];
            
            const capa = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Capa inserida com sucesso.',
                dados: capa
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao inserir capa.',
                dados: error.message
            });
        }
    }
}