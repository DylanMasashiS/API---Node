const db = require('../database/connection');
const fs = require('fs-extra');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

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
            const { usu_cod, usu_rm, usu_nome, usu_tipo } = request.body;
            const { page = 1, limit = 10 } = request.query;

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
                whereClauses.push("usu.usu_rm = ?");
                params.push(`${usu_rm}`);
            }
            if (usu_cod) {
                whereClauses.push("usu.usu_cod = ?");
                params.push(`${usu_cod}`);
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
            params.push(limitNum);
            params.push(offset);
            // Instruções SQL com junção das tabelas usuarios, usuarios_cursos e cursos
            const sql = `
                SELECT 
                    usu.usu_cod, 
                    usu.usu_rm, 
                    usu.usu_nome,
                    usu.usu_social, 
                    usu.usu_email, 
                    usu.usu_senha, 
                    usu.usu_sexo, 
                    usu.usu_foto, 
                    ucu.ucu_cod,
                    cur.cur_cod, 
                    cur.cur_nome,
                    CASE WHEN usu.usu_ativo = 1 THEN 'Ativo' ELSE 'Inativo' END AS usu_ativo, 
                    CASE WHEN usu.usu_aprovado = 0 THEN 'Não Aprovado' ELSE 'Aprovado' END AS usu_aprovado, 
                    CASE WHEN usu.usu_tipo = 4 THEN 'Pendente' ELSE 'Pendente' END AS usu_tipo
                FROM usuarios usu
                INNER JOIN usuarios_cursos ucu ON usu.usu_cod = ucu.usu_cod
                INNER JOIN cursos cur ON ucu.cur_cod = cur.cur_cod
                ${whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : ''}
                GROUP BY usu.usu_cod, ucu.ucu_cod, cur.cur_cod
                ORDER BY usu.usu_cod
                LIMIT ? OFFSET ?
            `;

            // Executa a consulta SQL
            const [rows] = await db.query(sql, params);
            // console.log(sql);
            // console.log(params);


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
                        usu_social: row.usu_social,
                        usu_email: row.usu_email,
                        usu_sexo: row.usu_sexo,
                        usu_foto: geraUrl(row.usu_foto),
                        usu_ativo: row.usu_ativo,
                        usu_aprovado: row.usu_aprovado,
                        usu_tipo: row.usu_tipo,
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
            // Parâmetros recebidos no corpo da requisição
            const {
                usu_rm, usu_nome, usu_email, usu_senha, usu_tipo = 4, usu_sexo,
                usu_ativo = 1, usu_aprovado = 0, cur_cod, ucu_status = 0,
                ucu_ativo = 1, ucu_aprovado = 0 } = request.body;

            // Verifica se o valor de usu_sexo é válido
            const sexosValidos = [0, 1, 2, 3];
            if (!sexosValidos.includes(Number(usu_sexo))) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Sexo inválido. Deve ser 0 (feminino),1 (masculino) ou 3 (padrão).",
                });
            }

            // Instrução SQL para inserção em `usuarios`
            const sqlUsuarios = `
                INSERT INTO usuarios 
                (usu_rm, usu_nome, usu_email, usu_senha, usu_tipo, usu_sexo, usu_ativo, usu_aprovado) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `;
            const valuesUsuarios = [usu_rm, usu_nome, usu_email, usu_senha, usu_tipo, usu_sexo, usu_ativo, usu_aprovado];

            // Execução da instrução SQL para `usuarios`
            const execSql = await db.query(sqlUsuarios, valuesUsuarios);
            const usu_cod = execSql[0].insertId;

            // Instrução SQL para associar usuário ao curso
            const sqlUsuariosCursos = `
                INSERT INTO usuarios_cursos
                (usu_cod, cur_cod, ucu_status, ucu_ativo, ucu_aprovado) 
                VALUES (?, ?, ?, ?, ?);
            `;
            const valuesUsuariosCursos = [usu_cod, cur_cod, ucu_status, ucu_ativo, ucu_aprovado];

            // Execução da instrução SQL para `usuarios_cursos`
            const execSqlUsuariosCursos = await db.query(sqlUsuariosCursos, valuesUsuariosCursos);
            const ucu_cod = execSqlUsuariosCursos[0].insertId;

            // Dados a serem retornados
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
                cur_cod,
                ucu_cod,
                ucu_status,
                ucu_ativo,
                ucu_aprovado
            };

            // Resposta de sucesso do cadastro todo
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro do usuário efetuado com sucesso. Aguarde a confirmação do administrador.',
                dados
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async listarUsuariosPendentes(request, response) {
        try {
            const sqlUsP = `SELECT usu.usu_cod, usu.usu_nome, usu.usu_email, usu.usu_tipo, 
                            usu.usu_ativo, usu.usu_aprovado, ucu.ucu_status, ucu.ucu_cod,
                            ucu.ucu_ativo, ucu.ucu_aprovado
                            FROM usuarios usu
                            INNER JOIN usuarios_cursos ucu ON usu.usu_cod = ucu.usu_cod
                            WHERE usu.usu_tipo = 4
                            AND usu.usu_ativo = 1
                            AND usu.usu_aprovado = 0
                            AND ucu.ucu_status = 0; `;

            const [usuariosPendentes] = await db.query(sqlUsP)
            // Converte campos de Buffer para número
            const usuariosConvertidos = usuariosPendentes.map(usuario => ({
                ...usuario,
                usu_ativo: usuario.usu_ativo[0], // Converte Buffer para número
                usu_aprovado: usuario.usu_aprovado[0], // Converte Buffer para número
                ucu_status: usuario.ucu_status[0], // Converte Buffer para número
                ucu_ativo: usuario.ucu_ativo[0], // Converte Buffer para número
                ucu_aprovado: usuario.ucu_aprovado[0], // Converte Buffer para número
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Usuários pendentes recuperados com sucesso',
                dados: usuariosConvertidos
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao recuperar usuários pendentes.',
                dados: error.message
            });
        }
    },

    async listarUsuariosReprovados(request, response) {
        try {
            const sql = `SELECT usu.usu_cod, usu.usu_nome, usu.usu_email, usu.usu_tipo, 
                        usu.usu_ativo = 1 as usu_ativo, usu.usu_aprovado = 1 as usu_aprovado
                        FROM usuarios usu
                        WHERE usu.usu_tipo = 5
                        AND usu.usu_ativo = 1
                        AND usu.usu_aprovado = 0;`;
    
            const [usuariosReprovados] = await db.query(sql);
    
            // Log para depuração
            console.log("Usuários reprovados retornados pela query:", usuariosReprovados);
    
            if (!usuariosReprovados.length) {
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Nenhum usuário reprovado encontrado.',
                    dados: []
                });
            }
    
            // Converte campos de Buffer para número
            // const usuariosConvertidos = usuariosReprovados.map(usuario => ({
            //     ...usuario,
            //     usu_ativo: Buffer.isBuffer(usuario.usu_ativo) ? usuario.usu_ativo[0] : usuario.usu_ativo,
            //     usu_aprovado: Buffer.isBuffer(usuario.usu_aprovado) ? usuario.usu_aprovado[0] : usuario.usu_aprovado,
            //     ucu_status: Buffer.isBuffer(usuario.ucu_status) ? usuario.ucu_status[0] : usuario.ucu_status,
            //     ucu_ativo: Buffer.isBuffer(usuario.ucu_ativo) ? usuario.ucu_ativo[0] : usuario.ucu_ativo,
            //     ucu_aprovado: Buffer.isBuffer(usuario.ucu_aprovado) ? usuario.ucu_aprovado[0] : usuario.ucu_aprovado,
            // }));
    
            // Log para depuração
            // console.log("Usuários convertidos:", usuariosConvertidos);
    
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Usuários reprovados foram recuperados com sucesso',
                dados: usuariosReprovados
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao recuperar usuários reprovados.',
                dados: error.message
            });
        }
    },

    async buscarUsuariosAprovados(request, response) {
        try {
            // Consulta para buscar usuários com usu_tipo = 0 (Aluno) ou usu_tipo = 1 (Professor)
            const sqlConsulta = `
                SELECT usu_cod, usu_nome, usu_email, usu_tipo
                FROM usuarios
                WHERE usu_tipo IN (0, 1)
                AND usu_aprovado = 1;
            `;
            
            const [resultados] = await db.query(sqlConsulta);
    
            if (resultados.length === 0) {
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Nenhum usuário aprovado encontrado.',
                    dados: [],
                });
            }
    
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Usuários aprovados encontrados com sucesso.',
                dados: resultados,
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar usuários aprovados.',
                dados: error.message,
            });
        }
    },   
    
    async analisarUsuariosReprovados(request, response) {
        try {
            const { usuarios } = request.body;
    
            // Validação inicial para assegurar que 'usuarios' seja uma lista
            if (!Array.isArray(usuarios)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Dados de entrada inválidos. Esperado uma lista de usuários.'
                });
            }
    
            const resultadoFinal = {
                sucesso: true,
                mensagem: '',
                dados: {}
            };
    
            for (const usuario of usuarios) {
                const { usu_cod, usu_tipo, usu_ativo, usu_aprovado } = usuario;
    
                // Verifica se o usuário está reprovado e do tipo correto
                if (usu_aprovado === 0 && usu_tipo === 5) {
                    // Atualização do usuário na tabela 'usuarios'
                    const sqlUsuarios = `
                        UPDATE usuarios
                        SET usu_tipo = ?, 
                            usu_ativo = ?, 
                            usu_aprovado = ?
                        WHERE usu_cod = ?;
                    `;
                    const valoresUsuarios = [usu_tipo, usu_ativo, usu_aprovado, usu_cod];
                    const [resultUsuarios] = await db.query(sqlUsuarios, valoresUsuarios);
    
                    // Adiciona informações ao resultado final
                    resultadoFinal.dados[usu_cod] = {
                        usuariosAtualizados: resultUsuarios.affectedRows
                    };
                }
            }
    
            resultadoFinal.mensagem = 'Usuários reprovados analisados com sucesso.';
            return response.status(200).json(resultadoFinal);
    
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao processar análise dos usuários reprovados.',
                dados: error.message
            });
        }
    },
    
    async analisarUsuariosCursos(request, response) {
        try {
            const { usuarios, novoTipo } = request.body; // Expecting an array of users and the new type
    
            // Validar o tipo fornecido
            const tiposValidos = [0, 1, 2, 3, 5];
            if (!Array.isArray(usuarios) || !tiposValidos.includes(novoTipo)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Dados de entrada inválidos ou tipo de usuário não permitido.',
                });
            }
    
            // Resposta padrão
            const resultadoFinal = {
                sucesso: true,
                mensagem: '',
                dados: {},
            };
    
            for (const usuario of usuarios) {
                const { usu_cod, usu_tipo } = usuario;
    
                // Garantir que apenas pendentes (usu_tipo = 4) sejam alterados
                if (usu_tipo === 4) {
                    const sql = `
                        UPDATE usuarios
                        SET usu_tipo = ?
                        WHERE usu_cod = ?;
                    `;
                    const valores = [novoTipo, usu_cod];
                    const [result] = await db.query(sql, valores);
    
                    // Adicionar informações ao resultado final
                    resultadoFinal.dados[usu_cod] = {
                        alterado: result.affectedRows > 0,
                        novoTipo,
                    };
                } else {
                    // Usuário não pendente
                    resultadoFinal.dados[usu_cod] = {
                        alterado: false,
                        motivo: 'Usuário não está pendente.',
                    };
                }
            }
    
            resultadoFinal.mensagem = 'Usuários processados com sucesso.';
            return response.status(200).json(resultadoFinal);
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message,
            });
        }
    },
     
    async editarPerfil(request, response) {
        try {
            // parâmetros recebidos pelo corpo da requisição
            const { usu_nome, usu_social, usu_email, usu_sexo } = request.body;
            // parâmetro recebido pela URL via params ex: /usuario/1
            const { usu_cod } = request.params;
            // instruções SQL
            const sql = `UPDATE usuarios SET usu_nome = ?, usu_social = ?, 
                        usu_email = ?,
                        usu_sexo = ?
                        WHERE usu_cod = ?;`;
            // preparo do array com dados que serão atualizados
            const values = [usu_nome, usu_social, usu_email, usu_sexo, usu_cod];
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
                            AND usu.usu_aprovado  = 1`;

            const values = [usu_email_rm, usu_email_rm, usu_senha];

            // Executando a consulta
            const result = await db.query(sql, values);
            const usuarios = result[0];

            // Verificando se o usuário existe
            if (usuarios.length < 1) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Usuário inválido.',
                    dados: null,
                });
            }

            // Comparando a senha fornecida com o hash no banco de dados
            const usuario = usuarios[0];

            // Login bem-sucedido
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Login efetuado com sucesso',
                dados: usuario
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async redSenha(request, response) {
        try {
            const { usu_email_rm, usu_senha } = request.body;

            const sql = 'UPDATE usuarios SET usu_senha = ? WHERE usu_email = ? AND usu_cod = ?';

            const values = [usu_senha, usu_email_rm, usu_cod];

            const result = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Senha alterada com sucesso.',
                dados: result
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async envioEmailRedSenha(request, response) {
        try {
            const { usu_email } = request.body;
            const sql = `SELECT usu_cod, usu_email, usu_nome FROM usuarios WHERE usu_email = ?;`;
            const values = [usu_email];
            const result = await db.query(sql, values);
            const usu_cod = result[0][0].usu_cod;
            const usu_nome = result[0][0].usu_nome;

            if (result[0].length > 0) {
                // envia email
                const transport = nodemailer.createTransport({
                    host: 'sandbox.smtp.mailtrap.io',
                    port: 2525,
                    auth: {
                        user: '3ce40f784d716e',
                        pass: '33738389fcfa8a'
                    },
                });

                let message = {
                    from: '3ce40f784d716e@sandbox.smtp.mailtrap.io',
                    to: usu_email,
                    subject: "Instruções para a ativação da conta.",
                    text: `Olá ${usu_nome},\nSejam bem-vindos à nossa plataforma SmoakBook! Por favor, copie o link a seguir e cole na barra de pesquisa do navegador.\nVocê será direcionado automaticamente para a página de autenticação de cadastro.\nhttp://10.67.23.25:3333/ativacao/usuarios/${usu_cod}`,
                    html: `<div>
                    <h1>Ativação do usuário</h1>
                    <h2>Olá ${usu_nome},</h2>
                    <p>Sejam bem-vindos à nossa plataforma SmoakBook. Por favor, clique no link a seguir </p>
                    <a href=http://10.67.23.25:3333/ativacao/usuarios/${usu_cod}>Ativar Conta</a>
                    </div>`,
                };

                // Envio do e-mail com tratamento de erro
                transport.sendMail(message)
                    .then(info => {
                        console.log("Mensagem enviada: ", info.response);
                        return { success: true };
                    })
                    .catch(err => {
                        console.error("Erro ao enviar o e-mail: ", err);
                        return { success: false, message: 'Não foi possível enviar o e-mail. Contate-nos.' };
                    });
            } else {
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Email inválido.',
                });
            }


            return response.status(200).json({
                sucesso: true,
                mensagem: 'Email enviado com sucesso.',
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async cadastrarImagemUsuario(request, response) {
        try {
            const img = request.file.filename;
            return response.status(200).json({
                confirm: 'Upload realizado com sucesso.', message: img
            });
        } catch (error) {
            return response.status(500).json({
                confirm: 'Erro', message: error.message
            });
        }
    },
}

