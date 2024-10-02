const db = require('../database/connection');
const fs = require('fs-extra');
const express = require('express'); 
const router = express.Router(); 

function geraUrl (liv_foto_capa) {
    let img = liv_foto_capa ? liv_foto_capa : 'default.jpg';
    if (!fs.existsSync ('./public/uploads/CapaLivros/' + img)) {
        img = 'livros.jpg';
    }
    return '/public/uploads/CapaLivros/' + img;
}

module.exports = {
    async listarReservas(request, response) {
        try {
            const { usu_cod } = request.body;

            const sql = `SELECT emp.emp_cod, DATE_FORMAT(emp.emp_data_emp, '%d/%m/%Y') AS Empréstimo, 
                            DATE_FORMAT(emp.emp_data_devol, '%d/%m/%Y') AS Devolução , liv.liv_nome, 
                            liv.liv_foto_capa, exe.exe_cod, aut.aut_nome, usu.usu_cod, usu.usu_nome,
                            gen.gen_nome, gen.gen_cod,
                            (SELECT usu_nome FROM usuarios WHERE usu_cod = emp.func_cod) as Funcionario
                        FROM emprestimos emp
                        INNER JOIN exemplares exe ON exe.exe_cod = emp.exe_cod
                        INNER JOIN livros liv ON liv.liv_cod = exe.liv_cod
                        INNER JOIN livros_autores lau ON lau.liv_cod = liv.liv_cod 
                        INNER JOIN autores aut ON aut.aut_cod = lau.aut_cod
                        INNER JOIN usuarios usu ON usu.usu_cod = emp.usu_cod
                        INNER JOIN livros_generos lge ON lge.liv_cod = liv.liv_cod
                        INNER JOIN generos gen ON gen.gen_cod = lge.gen_cod
                        WHERE usu.usu_cod = ? AND usu_ativo = 1`;

                        const values = [usu_cod];

            const reservas = await db.query(sql, values);

            const nItens = reservas.length;

            const resultado = reservas.map(reservas => ({
                ...reservas,
                liv_foto_capa: geraUrl(reservas.liv_foto_capa)
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de reservas.',
                dados: resultado,
                nItens
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }
}