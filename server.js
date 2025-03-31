// Import required modules
const express = require('express');
const path = require('path');

const bodyParser = require('body-parser')
const Crypto = require('crypto');

// Initialize the app
const app = express();
const PORT = 3000;

app.use(bodyParser.json())

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Routes

// 1. Mensagem de boas-vindas
app.get('/', (req, res) => {
    res.send('Bem-vindo');
  })

// 3. Middleware de Autenticação Fake
// Middleware
const isAuth = (req, res, next) => {
    if (req.headers.authorization == "123") {
        next();
    } else {
        res.send('401 - Não autorizado');
    }
}

app.get('/logado', isAuth, (req, res) => {
    res.send('Área logada');
})

let lista = [
    { id:"123abC", nome: "Notebook", preco: 3500.0 },
    { id:"123abD", nome: "Smartphone", preco: 2500.0 },
    { id:"123abE", nome: "Tablet", preco: 1200.0 },
    { id:"123abF", nome: "Tablet 2", preco: 1200.0 }
];

// 4. Manipulação de Dados com Query Params
app.get('/produtos', (req, res) => {
    const busca = req.query.busca;
    
    res.send(lista.filter( ({nome}) => nome.toLowerCase().includes(busca.toLocaleLowerCase()) ));
})

// 5. Receber Dados com POST
app.post('/produtos', (req, res) => {
    const produto = req.body;
    const id = Crypto.randomUUID();

    produto.id = id;

    lista.push(produto);
    
    res.send(lista)
})

// 6. Validação de Dados com Middleware
// Middleware nome
const isName = (req, res, next) => {
    const nome = req.body.nome;
    const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{3,}$/;

    if (nomeRegex.test(nome)) {
        next();
    } else {
        res.send("O nome deve ter pelo menos 3 caracteres e apenas letras e espaços");
    }
}

// Middleware email
const isEmail = (req, res, next) => {
    const email = req.body.email;
    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailRegex.test(email)) {
        next();
    } else {
        res.send("Email inválido");
    }
}

app.post('/usuarios', isName, isEmail, (req, res) => {
    const usuarios = req.body;
    res.send("Nome e email validos");
})

// 7. Gerenciamento de Erros Globais
app.get('/erro', (req, res, next) => {
    const erro = new Error("Erro forçado");
    next(erro);
})

// 2. Rotas Dinâmicas
app.get('/:nome', (req, res) => {
    res.send('Olá, ' + req.params.nome);
})

// Middleware de erro (p/ item 7)
app.use((err, req, res, next) => {
    res.status(500).json({ erro: "Erro interno no servidor" });
})