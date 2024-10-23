require('dotenv').config();
const nodemailer = require('nodemailer');

// Configurando o transporte de e-mail
const smtp = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_PORT === '465', // true para porta 465, false para outras
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Função para enviar o email
const sendEmail = (configEmail) => {
    return new Promise((resolve, reject) => {
        smtp.sendMail(configEmail)
            .then(result => {
                console.log('Email enviado:', result);
                resolve(result);
            })
            .catch(error => {
                console.error('Erro ao enviar email:', error);
                reject(error);
            });
    });
};

module.exports = { sendEmail };