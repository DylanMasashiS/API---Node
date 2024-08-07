const db = require('../database/connection');
var fs = require('fs-extra');

function geralUrl (e) {
    let img = e.usu_foto ? e.usu_foto : 'default.jpg';
    if (!fs.existsSync ('./public/uploads/FotoUsuarios/' + img)) {
        img = 'usuario.jpg';
    }

    const usuarios = {
        usu_cod:  e.usu_cod,
        usu_rm:  e.usu_rm,
        usu_nome: e.usu_nome,
        usu_email: e.usu_email,
        usu_senha: e.usu_senha,
        usu_tipo: e.usu_tipo,
        usu_sexo: e.usu_sexo,
        usu_foto: 'http://10.67.23.44:3333/public/uploads/FotoUsuarios/' + img
    }   

    return usuarios;
}

module.exports = {
    async listarUsuarios(request, response) {
        try {

            const {usu_nome} = request.body;
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

            const resultado = usuarios[0].map(geralUrl);

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
            const { usu_rm, usu_nome, usu_email, usu_senha, usu_tipo, usu_sexo, usu_ativo } = request.body;

            //insert com imagem
            const img = request.file.filename;
            // instrução SQL
            const sql = `INSERT INTO usuarios 
                (usu_rm, usu_nome, usu_email, usu_senha, usu_tipo, usu_sexo, usu_ativo) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            // definição dos dados a serem inseridos em um array
            const values = [usu_rm, usu_nome, usu_email, usu_senha, usu_tipo, usu_sexo, usu_ativo, img];
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
                usu_ativo,
                usu_foto: 'http://10.67.23.27:3333/public/uploads/FotoUsuarios/' + img
            };

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro do usuário efetuado com sucesso.',
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
    async apagarUsuarios(request, response) {
        try {
            // parâmetro passado via url na chamada da api pelo front-end
            const { usu_cod } = request.body;
            // comando de exclusão
            const sql = `DELETE FROM usuarios WHERE usu_cod = ?`;
            // array com parâmetros da exclusão
            const values = [usu_cod];
            // executa instrução no banco de dados
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${usu_cod} excluído com sucesso`,
                dados: excluir[0].affectedRows
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

            const { usu_email, usu_senha } = request.body;

            const sql = `SELECT usu_cod, usu_nome, usu_tipo, usu_ativo = 1 AS usu_ativo FROM usuarios 
                WHERE usu_email = ? AND usu_senha = ?;`;

            const values = [usu_email, usu_senha];

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

