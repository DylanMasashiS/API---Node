// Carregar variáveis de ambiente
require('dotenv').config();
const nodemailer = require('nodemailer');

// Configurar transporte de e-mail
const smtp = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_PORT === '465', // true para porta 465 (SSL), false para outras
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000 // 10 segundos para timeout
});

// Função para enviar email
const sendEmail = (configEmail) => {
  return new Promise((resolve, reject) => {
    smtp.sendMail(configEmail)
      .then(result => {
        console.log('Email enviado com sucesso:', result);
        resolve(result);
      })
      .catch(error => {
        console.error('Erro ao enviar email:', error);
        reject(error);
      });
  });
};

// Configurações do email que será enviado
const configEmail = {
  from: `"Seu Nome ou App" <${process.env.EMAIL_USER}>`, // remetente
  to: 'destinatario@gmail.com', // destinatário
  subject: 'Assunto do email', // assunto
  text: 'Texto simples do email', // corpo do email em texto puro
  html: '<b>Corpo do email em HTML</b>' // corpo do email em HTML
};

// Chamar a função para enviar o email
sendEmail(configEmail)
  .then(result => {
    console.log('Email enviado com sucesso:', result);
  })
  .catch(error => {
    console.error('Erro ao enviar email:', error);
  });

// Exportando a função para que outros arquivos possam utilizá-la
module.exports = { sendEmail };
