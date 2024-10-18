// controllers/senhaController.js
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const connection = require('../db'); // Conexão com o banco de dados
const bcrypt = require('bcryptjs');

// Gera um token aleatório
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Envia o e-mail com o link de redefinição de senha
async function sendResetEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'seu-email@gmail.com',
      pass: 'sua-senha'
    }
  });

  const resetLink = `http://seusite.com/reset-password/${token}`;
  const mailOptions = {
    from: 'seu-email@gmail.com',
    to: email,
    subject: 'Redefinição de senha',
    text: `Clique no link para redefinir sua senha: ${resetLink}`
  };

  await transporter.sendMail(mailOptions);
}

// Função para iniciar o processo de recuperação de senha
exports.esquecerSenha = async (req, res) => {
  try {
    const { email } = req.body;

    // Verifica se o e-mail existe
    const checkEmailQuery = 'SELECT * FROM usuarios WHERE email = ?';
    const [rows] = await connection.query(checkEmailQuery, [email]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'E-mail não encontrado.' });
    }

    const token = generateToken();
    const expires = new Date(Date.now() + 3600000); // 1 hora

    const query = 'UPDATE usuarios SET reset_token = ?, reset_expires = ? WHERE email = ?';
    await connection.query(query, [token, expires, email]);

    await sendResetEmail(email, token);

    res.status(200).json({ message: 'E-mail de redefinição de senha enviado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar a solicitação.' });
  }
};

// Função para redefinir a senha
exports.redefinirSenha = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const query = 'SELECT * FROM usuarios WHERE reset_token = ? AND reset_expires > ?';
    const [rows] = await connection.query(query, [token, new Date()]);
    
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateQuery = 'UPDATE usuarios SET senha = ?, reset_token = NULL, reset_expires = NULL WHERE reset_token = ?';
    await connection.query(updateQuery, [hashedPassword, token]);

    res.status(200).json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar a solicitação.' });
  }
};
