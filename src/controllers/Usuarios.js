require('dotenv').config();
const nodemailer = require("nodemailer");

const smtp = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const configEmail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Email de teste",
    text: "Email de teste",
    html: "<h1>Email de teste</h1>"
};

const sendEmail = () => {
    return new Promise((resolve, reject) => {
        smtp.sendMail(configEmail)
            .then(result => {
                smtp.close();
                resolve(result);
            })
            .catch(error => {
                console.log(error);
                smtp.close();
                reject(error);
            });
    });
};

app.listen(3002, () => {
    console.log("projeto rodando");
});
