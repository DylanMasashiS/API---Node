const express = require("express");
const nodemailer = require("nodemailer")

const app = express();

const smtp = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: "danikawari@gmail.com",
        pass: "Danikawari123"
    }
})

const configEmail = {
    from: "danikawari@gmail.com",
    to: "danikawari@gmail.com",
    subject: "Email de teste",
    text: "Email de teste",
    html: "<h1>Email de teste</h1>"
}

const sendEmail = () => {
    new Promise((resolve, reject) => {
        smtp.sendMail(configEmail)
            .then(resolve => {
                smtp.close()
                return resolve(resolve)
            })
            .catch(error => {
                console.log(error);
                smtp.close()
                return reject(error);
            })
    })
}

app.listen(3002, () => {
    console.log("projeto rodando")
});

// # EMAIL_USER=danikawari@gmail.com
// # EMAIL_PASS=Danikawari123
// # JWT_SECRET=D1aniK2awar3i