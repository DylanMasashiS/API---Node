const db = require('../database/connection');
const fs = require('fs-extra');

const express = require('express');
const router = express.Router();

function geraUrl(usu_foto) {
    let img = usu_foto ? usu_foto : 'usuarios.jpg';
    if (!fs.existsSync('./public/uploads/FotoUsuarios/' + img)) {
        img = 'usuarios.jpg';
    }
    return '/public/uploads/FotoUsuarios/' + img;
}

module.exports = {
    async listarUsuarios(request, response) {
        try {

            const { usu_nome } = request.body;
            const usuPesq = usu_nome ? `%${usu_nome}%` : `%%`;
            // instruções SQL
            const sql = `SELECT usu_cod,
                usu_rm, usu_nome, usu_email, usu_senha, usu_sexo,
                usu_foto, usu_ativo = 1 as usu_ativo
                FROM usuarios 
                WHERE usu_nome like ?`;

            const values = [usuPesq];
            // executa instruções SQL e armazena o resultado na variável usuários
            const usuarios = await db.query(sql, values);
            // armazena em uma variável o número de registros retornados
            const nItens = usuarios[0].length;

            const resultado = usuarios[0].map(usuarios => ({
                ...usuarios,
                usu_foto: geraUrl(usuarios.usu_foto),
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuários.',
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
    async cadastrarUsuarios(request, response) {
        try {
            // parâmetros recebidos no corpo da requisição
            const { usu_rm, usu_nome, usu_email, usu_senha, usu_tipo = 5, usu_sexo, usu_ativo = 0, usu_aprovado = 0 } = request.body;
            console.log(usu_rm + ' - ' + usu_nome + ' - ' + usu_tipo);
            
            // const ativo = usu_ativo ? 1 : 0;
            // const aprovado = usu_aprovado ? 1 : 0;

            // Se a foto não for enviada, define img como null ou uma string padrão
            // const img = request.file ? request.file.filename : null;

            // if (!request.file) {
            //     return response.status(400).json({
            //         sucesso: false,
            //         mensagem: 'A imagem do usuário é obrigatória.'
            //     });
            // }

            //insert com imagem
            // const img = request.file.filename;
            // instrução SQL
            const sql = `
                            INSERT INTO usuarios 
                            (usu_rm, usu_nome, usu_email, usu_senha, usu_tipo, usu_sexo, usu_ativo, usu_aprovado) 
                            VALUES 
                            (?, ?, ?, ?, ?, ?, ?, ?);
                        `;
            // definição dos dados a serem inseridos em um array
            const values = [usu_rm, usu_nome, usu_email, usu_senha, usu_tipo, usu_sexo, usu_ativo, usu_aprovado ];


            // execução da instrução sql passando os parâmetros
            const execSql = await db.query(sql, values);
            // identificação do ID do registro inserido
            const usu_cod = execSql[0].insertId;

            const dados = {
                usu_cod,
                usu_rm,
                usu_nome,
                usu_email,
                usu_senha, 
                usu_tipo, 
                usu_sexo,
                usu_foto: '/public/uploads/FotoUsuarios/usuarios.jpg',
                usu_ativo, 
                usu_aprovado
            };

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro do usuário efetuado com sucesso. Aguarde a confirmação do administrador.',
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
    async editarUsuarios(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const { usu_nome, usu_email, usu_senha, usu_tipo, usu_sexo, usu_ativo } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { usu_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE usuarios SET usu_nome = ?, 
                        usu_email = ?, usu_senha = ?, usu_tipo = ?, 
                        usu_sexo = ?, usu_ativo = ? 
                        WHERE usu_cod = ?;`;
            // preparo do array com dados que serão atualizados
            const values = [usu_nome, usu_email, usu_senha, usu_tipo, usu_sexo, usu_ativo, usu_cod];
            // execução e obtenção de confirmação da atualização realizada
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${usu_cod} atualizado com sucesso!`,
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
    async ocultarUsuarios(request, response) {
        try {
            const usu_ativo = false;
            const { usu_cod } = request.body;
            const sql = `UPDATE usuarios SET usu_ativo = ? 
                WHERE usu_cod = ?;`;
            const values = [usu_ativo, usu_cod];
            const atualizacao = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${usu_cod} ocultado com sucesso`,
                dados: atualizacao[0].affectedRows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async loginUsuarios(request, response) {
        try {

            const { usu_email_rm, usu_senha } = request.body;

            const sql = ` SELECT usu.usu_cod, 
                                 usu.usu_nome, 
                                 usu.usu_rm,
                                 usu.usu_tipo, 
                                  usu.usu_ativo = 1 as usu_ativo, 
                                 usu.usu_email, 
                                 usu.usu_senha, 
                                 cur.cur_cod, 
                                 cur.cur_nome
                            FROM usuarios usu
                      LEFT JOIN usuarios_cursos ucu on ucu.usu_cod = usu.usu_cod
                      LEFT JOIN cursos cur on cur.cur_cod = ucu.cur_cod
                           WHERE (   usu.usu_email = ?
                                  OR usu.usu_rm    = ?)
                             AND usu.usu_senha     = ?
                             AND usu.usu_aprovado  = 1`;

            const values = [usu_email_rm, usu_email_rm, usu_senha];

            const usuarios = await db.query(sql, values);
            const nItens = usuarios[0].length;

            if (nItens < 1) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Login e/ou senha inválido.',
                    dados: null,
                });
            }
            // fazendo login
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Login efetuado com sucesso',
                dados: usuarios[0]
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
}

