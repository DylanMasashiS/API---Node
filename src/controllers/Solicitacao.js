const db = require('../database/connection');
const fs = require('fs-extra');
const express = require('express');
const router = express.Router();

module.exports = {
    async listarUsuariosPendentes(request, response) {
        try {
            const sqlUsP = `SELECT usu.usu_cod, usu.usu_rm, usu.usu_nome, usu.usu_email, usu.usu_tipo, 
                        usu.usu_ativo, usu.usu_aprovado, cur.cur_nome, cur.cur_cod, 
                        ucu.ucu_status, ucu.ucu_cod, ucu.ucu_ativo, ucu.ucu_aprovado
                        FROM usuarios usu
                        INNER JOIN usuarios_cursos ucu ON usu.usu_cod = ucu.usu_cod
                        WHERE usu.usu_tipo = 4
                        AND usu.usu_ativo = 1
                        AND usu.usu_aprovado = 0
                        AND ucu.ucu_status = 0
                        AND ucu.ucu_ativo = 0
                        AND ucu.ucu_aprovado = 0; `;

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
            const sql = `SELECT usu.usu_cod, usu.usu_rm, usu.usu_nome, usu.usu_email, usu.usu_tipo, 
                    usu.usu_ativo = 1 as usu_ativo, usu.usu_aprovado = 1 as usu_aprovado,
                    cur.cur_cod, cur.cur_nome
                    FROM usuarios usu
                    INNER JOIN cursos cur ON usu.cur_cod = cur.cur_cod
                    WHERE usu.usu_tipo = 5
                    AND usu.usu_ativo = 0
                    AND usu.usu_aprovado = 0
                    AND ucu.ucu_status = 0
                    AND ucu.ucu_ativo = 0
                    AND ucu.ucu_aprovado = 0;`;

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

    async listarUsuariosAprovados(request, response) {
        try {
            // Consulta para buscar usuários com usu_tipo = 0 (Aluno) ou usu_tipo = 1 (Professor)
            const sqlConsulta = `
                        SELECT usu.usu_cod, usu.usu_rm, usu.usu_nome, usu.usu_email, usu.usu_tipo, 
                        usu.usu_ativo, usu.usu_aprovado, cur.cur_nome, cur.cur_cod, 
                        ucu.ucu_status, ucu.ucu_cod, ucu.ucu_ativo, ucu.ucu_aprovado
                        FROM usuarios usu
                        INNER JOIN usuarios_cursos ucu ON usu.usu_cod = ucu.usu_cod
                        WHERE usu.usu_tipo IN (0, 1)
                        AND usu.usu_ativo = 1
                        AND usu.usu_aprovado = 1
                        AND ucu.ucu_status = 1
                        AND ucu.ucu_ativo = 1
                        AND ucu.ucu_aprovado = 1; `;

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
            const { usuarios, novoTipo } = request.body;
    
            // Lista de tipos permitidos: 0 e 1 (evitando 2 e 3 por segurança)
            const tiposValidos = [0, 1];
    
            // Validação de entrada
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
    
                // Processar apenas usuários reprovados (usu_tipo = 5)
                if (usu_tipo === 5) {
                    // Atualiza a tabela 'usuarios'
                    const sqlUsuarios = `
                        UPDATE usuarios
                        SET usu_tipo = ?, usu_aprovado = 1, usu_ativo = 1
                        WHERE usu_cod = ?
                    `;
                    const valoresUsuarios = [novoTipo, usu_cod];
                    const [resultUsuarios] = await db.query(sqlUsuarios, valoresUsuarios);
    
                    // Atualiza a tabela 'usuarios_cursos'
                    const sqlUcu = `
                        UPDATE usuarios_cursos
                        SET ucu_status = 1, ucu_ativo = 1, ucu_aprovado = 1
                        WHERE usu_cod = ?
                    `;
                    const [resultUcu] = await db.query(sqlUcu, [usu_cod]);
    
                    resultadoFinal.dados[usu_cod] = {
                        usuariosAtualizados: resultUsuarios.affectedRows > 0,
                        cursosAtualizados: resultUcu.affectedRows > 0,
                        novoTipo,
                    };
                } else {
                    resultadoFinal.dados[usu_cod] = {
                        alterado: false,
                        motivo: 'Usuário não está reprovado.',
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
    
    async analisarUsuariosCursos(request, response) {
        try {
            const { usuarios, novoTipo } = request.body;
    
            // Lista de tipos permitidos: 0, 1, e 5 (evitando 2 e 3 por segurança)
            const tiposValidos = [0, 1, 5];
    
            // Validação de entrada
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
    
                // Processar apenas usuários pendentes (usu_tipo = 4)
                if (usu_tipo === 4) {
                    // Atualiza a tabela 'usuarios' (caso o usuário esteja pendente)
                    const sqlUsuarios = `
                        UPDATE usuarios
                        SET usu_tipo = ?
                        WHERE usu_cod = ?;
                    `;
                    const valoresUsuarios = [novoTipo, usu_cod];
                    const [resultUsuarios] = await db.query(sqlUsuarios, valoresUsuarios);
    
                    // Atualiza a tabela 'usuarios_cursos' se necessário (Exemplo: alterando status, se aplicável)
                    const sqlUcu = `
                        UPDATE usuarios_cursos
                        SET ucu_status = 1, ucu_ativo = 1, ucu_aprovado = 1
                        WHERE usu_cod = ?;
                    `;
                    const [resultUcu] = await db.query(sqlUcu, [usu_cod]);
    
                    // Armazenando o resultado da atualização
                    resultadoFinal.dados[usu_cod] = {
                        usuariosAtualizados: resultUsuarios.affectedRows > 0,
                        cursosAtualizados: resultUcu.affectedRows > 0,
                        novoTipo,
                    };
                } else {
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
    }    
}