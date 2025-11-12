const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuração para servir arquivos estáticos
app.use(express.static('pages'));

// Rota dinâmica para renderizar páginas HTML
app.get('/:pageName', (req, res) => {
    const pageName = req.params.pageName;
    const filePath = path.join(__dirname, 'pages', `${pageName}.html`);
    
    // Verifica se o arquivo existe
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Página não encontrada');
    }
});

// Rota raiz - pode ser configurada para uma página padrão
app.get('/', (req, res) => {
    const defaultPage = path.join(__dirname, 'pages', 'index.html');
    
    if (fs.existsSync(defaultPage)) {
        res.sendFile(defaultPage);
    } else {
        res.send('Servidor funcionando! Acesse localhost:3000/nomeDaPagina');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});


module.exports = app;
