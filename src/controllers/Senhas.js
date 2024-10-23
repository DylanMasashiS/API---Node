const db = require('../database/connection'); // Importa a conexão com o banco de dados
const { randomUUID } = require('crypto'); // Importa a função para gerar UUIDs
const { hash } = require('bcrypt'); // Importa a função para criptografar senhas
const sendEmail = require('../config/sendEmail'); // Importa a função para enviar e-mails

module.exports = {
    async solRedSenha(request, response) {
        try {
            const { usu_email } = request.body;

            // Verificar se o usuário existe
            const sql = "SELECT usu_cod FROM usuarios WHERE usu_email = ?";
            const [usuario] = await db.query(sql, [usu_email]);

            if (!usuario.length) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'E-mail não encontrado.'
                });
            }

            // Gerar um token único
            const token = randomUUID();

            // Salvar o token no banco de dados
            const sqlToken = "INSERT INTO reset_tokens (usu_email, token) VALUES (?, ?)";
            await db.query(sqlToken, [usu_email, token]);

            // Enviar o e-mail com o token
            const resetLink = `${process.env.DOMINIO}/resetar_senha/${token}`;
            await sendEmail({
                from: process.env.EMAIL_USER,
                to: usu_email,
                subject: 'Redefinição de Senha',
                text: `Clique aqui para redefinir sua senha: ${resetLink}`
            });

            return response.status(200).json({
                sucesso: true,
                mensagem: 'E-mail de redefinição de senha enviado com sucesso.'
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na solicitação de redefinição de senha.',
                dados: error.message
            });
        }
    },

    async redefinirSenha(request, response) {
        try {
            const { token, novaSenha } = request.body;

            // Verificar se o token é válido
            const sqlToken = "SELECT usu_email FROM reset_tokens WHERE token = ?";
            const [tokenValido] = await db.query(sqlToken, [token]);

            if (!tokenValido.length) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Token inválido ou expirado.'
                });
            }

            const usu_email = tokenValido[0].usu_email;

            // Criptografar a nova senha
            const senhaHash = await hash(novaSenha, 10);

            // Atualizar a senha do usuário
            const sqlAtualizarSenha = "UPDATE usuarios SET usu_senha = ? WHERE usu_email = ?";
            await db.query(sqlAtualizarSenha, [senhaHash, usu_email]);

            // Remover o token após a redefinição
            await db.query("DELETE FROM reset_tokens WHERE token = ?", [token]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Senha redefinida com sucesso.'
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na redefinição de senha.',
                dados: error.message
            });
        }
    },
    async FormRedefinicao(request, response) {
        const { token } = request.params;

        // Aqui você pode verificar se o token é válido
        const sqlToken = "SELECT usu_email FROM reset_tokens WHERE token = ?";
        const [tokenValido] = await db.query(sqlToken, [token]);

        if (!tokenValido.length) {
            return response.status(400).json({
                sucesso: false,
                mensagem: 'Token inválido ou expirado.'
            });
        }

        // Renderizar o formulário de redefinição de senha
        return response.render('form_senha', { token }); // Aqui você renderiza uma página HTML, ou pode responder com JSON.
    }
}
