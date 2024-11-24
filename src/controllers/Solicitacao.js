const db = require('../database/connection');
const fs = require('fs-extra');
const express = require('express');
const router = express.Router();

module.exports = {
    // Listar usuários pendentes
    async listarUsuariosPendentes(request, response) {
        try {
            const sqlUsP = `SELECT usu.usu_cod, usu.usu_rm, usu.usu_nome, usu.usu_email, usu.usu_tipo, 
                            usu.usu_ativo, usu.usu_aprovado, cur.cur_nome, cur.cur_cod, 
                            ucu.ucu_status, ucu.ucu_cod, ucu.ucu_ativo, ucu.ucu_aprovado
                            FROM usuarios usu
                            INNER JOIN usuarios_cursos ucu ON usu.usu_cod = ucu.usu_cod
                            INNER JOIN cursos cur ON ucu.cur_cod = cur.cur_cod
                            WHERE usu.usu_tipo = 4
                            AND usu.usu_aprovado = 0
                            AND usu.usu_ativo = 1
                            AND ucu.ucu_ativo = 1
                            AND ucu.ucu_status = 0
                            AND ucu.ucu_aprovado = 0;`;

            const [usuariosPendentes] = await db.query(sqlUsP);

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

    // Listar usuários reprovados
    async listarUsuariosReprovados(request, response) {
        try {
            const sql = `
                SELECT usu.usu_cod, usu.usu_rm, usu.usu_nome, usu.usu_email, usu.usu_tipo, 
                       usu.usu_ativo, usu.usu_aprovado, ucu.ucu_status AS ucu_status,
                       ucu.ucu_cod AS ucu_cod, ucu.ucu_ativo AS ucu_ativo, 
                       ucu.ucu_aprovado AS ucu_aprovado, cur.cur_cod, cur.cur_nome
                       FROM usuarios usu
                       INNER JOIN usuarios_cursos ucu ON usu.usu_cod = ucu.usu_cod
                       INNER JOIN cursos cur ON ucu.cur_cod = cur.cur_cod
                       WHERE usu.usu_tipo = 5
                       AND usu.usu_ativo = 0
                       AND usu.usu_aprovado = 0
                       AND ucu.ucu_status = 0
                       AND ucu.ucu_ativo = 0
                       AND ucu.ucu_aprovado = 0;
            `;
    
            const [usuariosReprovados] = await db.query(sql);
    
            if (!usuariosReprovados.length) {
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Nenhum usuário reprovado encontrado.',
                    dados: []
                });
            }
    
            // Converte buffers para números
            const usuariosFormatados = usuariosReprovados.map(usuario => ({
                ...usuario,
                usu_ativo: usuario.usu_ativo ? usuario.usu_ativo[0] : 0,
                usu_aprovado: usuario.usu_aprovado ? usuario.usu_aprovado[0] : 0,
                ucu_status: usuario.ucu_status ? usuario.ucu_status[0] : 0,
                ucu_ativo: usuario.ucu_ativo ? usuario.ucu_ativo[0] : 0,
                ucu_aprovado: usuario.ucu_aprovado ? usuario.ucu_aprovado[0] : 0,
            }));
    
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Usuários reprovados foram recuperados com sucesso.',
                dados: usuariosFormatados
            });
        } catch (error) {
            console.error('Erro ao listar usuários reprovados:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao recuperar usuários reprovados.',
                dados: error.message
            });
        }
    },

    // Listar usuários aprovados
    async listarUsuariosAprovados(request, response) {
        try {
            const sql = `
                SELECT usu.usu_cod, usu.usu_rm, usu.usu_nome, usu.usu_email, usu.usu_tipo,
                       usu.usu_ativo, usu.usu_aprovado,
                       ucu.ucu_status, ucu.ucu_cod, ucu.ucu_ativo, ucu.ucu_aprovado,
                       cur.cur_cod, cur.cur_nome
                FROM usuarios usu
                INNER JOIN usuarios_cursos ucu ON usu.usu_cod = ucu.usu_cod
                INNER JOIN cursos cur ON ucu.cur_cod = cur.cur_cod
                WHERE usu.usu_tipo IN (0, 1)
                  AND usu.usu_ativo = 1
                  AND usu.usu_aprovado = 1
                  AND ucu.ucu_status = 1
                  AND ucu.ucu_ativo = 1
                  AND ucu.ucu_aprovado = 1;
            `;
    
            const [usuariosAprovados] = await db.query(sql);
    
            // Verifica se não há resultados
            if (!usuariosAprovados.length) {
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Nenhum usuário aprovado encontrado.',
                    dados: []
                });
            }
    
            // Converte buffers para números
            const usuariosFormatados = usuariosAprovados.map(usuario => ({
                ...usuario,
                usu_ativo: usuario.usu_ativo ? usuario.usu_ativo[0] : 0,
                usu_aprovado: usuario.usu_aprovado ? usuario.usu_aprovado[0] : 0,
                ucu_status: usuario.ucu_status ? usuario.ucu_status[0] : 0,
                ucu_ativo: usuario.ucu_ativo ? usuario.ucu_ativo[0] : 0,
                ucu_aprovado: usuario.ucu_aprovado ? usuario.ucu_aprovado[0] : 0,
            }));
    
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Usuários aprovados encontrados com sucesso.',
                dados: usuariosFormatados
            });
        } catch (error) {
            console.error('Erro ao listar usuários aprovados:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao recuperar usuários aprovados.',
                dados: error.message
            });
        }
    },

    // Analisar usuários reprovados e atualizar tipo
    async analisarUsuariosReprovados(request, response) {
        try {
            const { usuarios, novoTipo } = request.body;

            const tiposValidos = [0, 1];

            if (!Array.isArray(usuarios) || !tiposValidos.includes(novoTipo)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Dados de entrada inválidos ou tipo de usuário não permitido.',
                });
            }

            const resultadoFinal = {
                sucesso: true,
                mensagem: '',
                dados: {},
            };

            for (const usuario of usuarios) {
                const { usu_cod, usu_tipo } = usuario;

                if (usu_tipo === 5) {
                    const sqlUsuarios = `
                        UPDATE usuarios
                        SET usu_tipo = ?, usu_aprovado = 1, usu_ativo = 1
                        WHERE usu_cod = ? AND usu_tipo = 5
                    `;
                    const valoresUsuarios = [novoTipo, usu_cod];
                    const [resultUsuarios] = await db.query(sqlUsuarios, valoresUsuarios);

                    if (resultUsuarios.affectedRows > 0) {
                        const sqlUcu = `
                            UPDATE usuarios_cursos
                            SET ucu_status = 1, ucu_ativo = 1, ucu_aprovado = 1
                            WHERE usu_cod = ?
                        `;
                        const [resultUcu] = await db.query(sqlUcu, [usu_cod]);

                        resultadoFinal.dados[usu_cod] = {
                            usuariosAtualizados: true,
                            cursosAtualizados: resultUcu.affectedRows > 0,
                            novoTipo,
                        };
                    } else {
                        resultadoFinal.dados[usu_cod] = {
                            usuariosAtualizados: false,
                            cursosAtualizados: false,
                            motivo: 'Usuário já atualizado ou não encontrado como reprovado.',
                        };
                    }
                } else {
                    resultadoFinal.dados[usu_cod] = {
                        usuariosAtualizados: false,
                        cursosAtualizados: false,
                        motivo: 'Usuário não está reprovado (usu_tipo != 5).',
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

    // Analisar e atualizar tipos de usuários e cursos
    async analisarUsuariosCursos(request, response) {
        try {
            const { usuarios, novoTipo } = request.body;

            const tiposValidos = [0, 1, 5];

            if (!Array.isArray(usuarios) || !tiposValidos.includes(novoTipo)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Dados de entrada inválidos ou tipo de usuário não permitido.',
                });
            }

            const resultadoFinal = {
                sucesso: true,
                mensagem: '',
                dados: {},
            };

            for (const usuario of usuarios) {
                const { usu_cod, usu_tipo } = usuario;

                if (usu_tipo === 4) {
                    const sqlUsuarios = `
                        UPDATE usuarios
                        SET usu_tipo = ?
                        WHERE usu_cod = ?;
                    `;
                    const valoresUsuarios = [novoTipo, usu_cod];
                    const [resultUsuarios] = await db.query(sqlUsuarios, valoresUsuarios);

                    const sqlUcu = `
                        UPDATE usuarios_cursos
                        SET ucu_status = 1, ucu_ativo = 1, ucu_aprovado = 1
                        WHERE usu_cod = ?;
                    `;
                    const [resultUcu] = await db.query(sqlUcu, [usu_cod]);

                    resultadoFinal.dados[usu_cod] = {
                        usuariosAtualizados: resultUsuarios.affectedRows > 0,
                        cursosAtualizados: resultUcu.affectedRows > 0,
                    };
                }
            }

            resultadoFinal.mensagem = 'Atualizações de usuários e cursos concluídas.';
            return response.status(200).json(resultadoFinal);

        } catch (error) {
            console.error(error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao analisar e atualizar usuários e cursos.',
                erro: error.message,
            });
        }
    }
}