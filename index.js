const express = require ('express'); 
const cors = require ('cors');
const router = require ('./src/routes/routes');


const app = express();
app.use (cors());
app.use (express.json());
app.use (router);

app.use('/public', express.static('public'));

const port = 3333;

app.listen (port, () => {
    console.log (`Servidor iniciado na porta ${port}`);
});

app.get('/', (request, response) => {
    response.send('Hello World');
});
