const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // modelo do usuário

// Configuração do transporte de e-mails
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou seu serviço de e-mail
  auth: {
    user: process.env.EMAIL_USER, // do arquivo .env
    pass: process.env.EMAIL_PASS
  }
});

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }

    // Gerar um token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar e-mail com o link de redefinição de senha
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Redefinição de senha',
      text: `Clique no link para redefinir sua senha: ${resetLink}`,
    });

    res.status(200).send('E-mail de redefinição de senha enviado.');
  } catch (error) {
    res.status(500).send('Erro ao processar a solicitação.');
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }

    // Criptografar a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).send('Senha redefinida com sucesso.');
  } catch (error) {
    res.status(500).send('Erro ao redefinir a senha.');
  }
};