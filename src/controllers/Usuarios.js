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
            // Extrair parâmetros de consulta para pesquisa e paginação
            const { usu_rm, usu_nome, usu_tipo, page = 1, limit = 10 } = request.query;

            // Converter page e limit para números inteiros
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);

            // Validar os parâmetros
            if (isNaN(pageNum) || pageNum < 1) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Parâmetro "page" inválido.',
                });
            }

            if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) { // Limite máximo de 100 itens por página
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Parâmetro "limit" inválido. Deve ser um número entre 1 e 100.',
                });
            }

            // Calcular OFFSET
            const offset = (pageNum - 1) * limitNum;

            let params = [];
            let whereClauses = [];

            // Adiciona cláusulas de pesquisa baseadas nos critérios fornecidos
            if (usu_rm) {
                whereClauses.push("usu.usu_rm LIKE ?");
                params.push(`%${usu_rm}%`);
            }
            if (usu_nome) {
                whereClauses.push("usu.usu_nome LIKE ?");
                params.push(`%${usu_nome}%`);
            }
            if (usu_tipo) {
                whereClauses.push("usu.usu_tipo = ?");
                params.push(usu_tipo);
            }

	     // Adicionar LIMIT e OFFSET aos parâmetros
            params.push(limitNum, offset);

            // Instruções SQL com junção das tabelas usuarios, usuarios_cursos e cursos
            const sql = `
                SELECT 
                    usu.usu_cod, 
                    usu.usu_rm, 
                    usu.usu_nome, 
                    usu.usu_email, 
                    usu.usu_senha, 
                    usu.usu_sexo, 
                    usu.usu_foto, 
                    uc.ucu_cod,
                    c.cur_cod, 
                    c.cur_nome,
                    CASE WHEN usu.usu_ativo = 1 THEN 'Ativo' ELSE 'Inativo' END AS status_ativo, 
                    CASE WHEN usu.usu_aprovado = 0 THEN 'Não Aprovado' ELSE 'Aprovado' END AS status_aprovado, 
                    CASE WHEN usu.usu_tipo = 4 THEN 'Pendente' ELSE 'Outro Tipo' END AS status_tipo
                FROM usuarios usu
                INNER JOIN usuarios_cursos uc ON usu.usu_cod = uc.usu_cod
                INNER JOIN cursos c ON uc.cur_cod = c.cur_cod
                ${whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : ''}
                GROUP BY usu.usu_cod, uc.ucu_cod, c.cur_cod
                ORDER BY usu.usu_cod
                LIMIT ? OFFSET ?
            `;

            // Executa a consulta SQL
            const [rows] = await db.query(sql, params);

            // Contar o total de itens (sem LIMIT e OFFSET) para calcular o total de páginas
            const countSql = `
                SELECT COUNT(DISTINCT usu.usu_cod) AS total 
                FROM usuarios usu
                ${whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : ''}
            `;
            const [countRows] = await db.query(countSql, params.slice(0, params.length - 2)); // Remover LIMIT e OFFSET
            const totalItems = countRows[0].total;
            const totalPages = Math.ceil(totalItems / limitNum);

            // Mapa para agrupar cursos por usuário
            const usuariosMap = {};

            rows.forEach(row => {
                if (!usuariosMap[row.usu_cod]) {
                    usuariosMap[row.usu_cod] = {
                        usu_cod: row.usu_cod,
                        usu_rm: row.usu_rm,
                        usu_nome: row.usu_nome,
                        usu_email: row.usu_email,
                        usu_sexo: row.usu_sexo,
                        usu_foto: geraUrl(row.usu_foto),
                        status_ativo: row.status_ativo,
                        status_aprovado: row.status_aprovado,
                        status_tipo: row.status_tipo,
                        cursos: []
                    };
                }

                if (row.cur_cod && row.cur_nome) {
                    usuariosMap[row.usu_cod].cursos.push({
                        ucu_cod: row.ucu_cod,
                        cur_cod: row.cur_cod,
                        cur_nome: row.cur_nome
                    });
                }
            });

            // Converte o mapa para um array
            const resultado = Object.values(usuariosMap);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuários.',
                dados: resultado,
                nItens: totalItems,
                paginaAtual: pageNum,
                totalPaginas: totalPages
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
            const { usu_rm, usu_nome, usu_email, usu_senha, usu_tipo = 4, usu_sexo, usu_ativo = 1, usu_aprovado = 0, cur_cod } = request.body;

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

            // relaciona o usuário com o curso
            const sqlUsuCurso = `
                        INSERT INTO usuarios_cursos
                        (usu_cod, cur_cod) 
                        VALUES (?, ?);
                        `;
            // definição dos dados a serem inseridos em um array
            const valuesUsuCurso = [usu_cod, cur_cod ];

            // execução da instrução sql passando os parâmetros
            const execSqlUsuCurso = await db.query(sqlUsuCurso, valuesUsuCurso);

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
                usu_aprovado, 
                cur_cod
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

    async analizarUsuariosCursos (request, response) {
        try {    
        const { usu_tipo, usu_ativo, usu_aprovado, usu_cod, ucu_status, ucu_ativo, ucu_aprovado, ucu_cod } = request.body; 

        // Verifique se o novo_tipo é válido (supondo que os tipos válidos são 0, 1 e 2)
        const tiposValidos = [0, 1, 2];
        if (!tiposValidos.includes(usu_tipo)) {
            return response.status(400).json({
                sucesso: false,
                mensagem: 'Tipo inválido. Deve ser 0, 1 ou 2.',
            });
        }

        //ucu_status: 0 = pendente, 1 = analisado (Para mostrar as solicitações pendentes de usuarios_cursos)
        //ucu_ativo: 0 = inativo, 1 = ativo (Para mostrar os cursos desativados de alunos ou professores, uma vez que pode haver erro)
        //ucu_aprovado: 0 = não aprovado, 1 = aprovado (Para mostrar os cursos de alunos ou professores que não foram aprovados)

        // execução da primeira instrução sql passando os parâmetros dos usuários
        const sqlUsuarios =       
                    `UPDATE usuarios
                        SET usu_tipo     = ?, 
                            usu_ativo    = ?, 
                            usu_aprovado = ?
                      WHERE usu_cod = ?;`;

        const values = [usu_tipo, usu_ativo, usu_aprovado, usu_cod];
        const result = await db.query(sqlUsuarios, values);

        // execução da próxima instrução sql passando os parâmetros dos cursos
        const sqlCursos =       
                    `UPDATE usuarios_cursos
                        SET ucu_status   = ?, 
                            ucu_ativo    = ?, 
                            ucu_aprovado = ?
                      WHERE ucu_cod = ?;`;

        const valores = [ucu_status, ucu_ativo, ucu_aprovado, ucu_cod ];
        const resultado = await db.query(sqlCursos, valores);

        return response.status(200).json({
            sucesso: true,
            mensagem: `Usuário ${usu_cod} analizado com sucesso`,
            dados: {
                usuariosAtualizados: result[0].affectedRows,
                cursosAtualizados: resultado[0].affectedRows
            }
        });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async editarPerfil(request, response) {
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

