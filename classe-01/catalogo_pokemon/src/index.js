const express = require('express');
const rotas = require('./rotas');
const app = express();

app.use(express.json());
app.use(rotas);

app.get('/', (req, res) => {
    res.send('tudo ok');
})
app.listen(3000);