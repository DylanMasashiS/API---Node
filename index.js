const express = require ('express');
const app = express();
const port = 3333;

app.listen (port, () => {
    console.log (`Servidor iniciado na porta ${port}`);
});