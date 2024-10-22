const nodemailer = require('nodemailer');

import mailConfig = require (../config/mail.json);

const transport = nodemailer.createTransport({
    host:,
    port:,
    auth: { user , pass:}
});

module.exports = transport;