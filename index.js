const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env


const app = express();

// Porta para o servidor
const port = process.env.PORT || 5000;

// Conexão com o banco de dados MongoDB
mongoose.connect('mongodb+srv://lucaspedrofernandes:WGhKw7GWbpTR5bl2@cluster0.xfmeyqk.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conexão com o banco de dados estabelecida com sucesso!');
}).catch((error) => {
  console.error('Erro ao conectar com o banco de dados:', error);
});

// Configuração de Middleware
app.use(cors({
    origin: '*', // Permite todas as origens
    methods: 'GET, POST, PUT, DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization', // Cabeçalhos permitidos
  }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Permite qualquer origem
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  
app.use(bodyParser.json()); // Parsear JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parsear dados de formulários

// Rota de boas-vindas
app.get('/', (req, res) => {
  res.send('Bem-vindo ao sistema Kanban!');
});

const kanbanRoutes = require('./src/Routes/Routes');
app.use('/api', kanbanRoutes); // Certifique-se de que isso está configurado


// Iniciar o servidor
app.listen(5000, () => {
  console.log(`Servidor rodando na porta 5000`);
});
