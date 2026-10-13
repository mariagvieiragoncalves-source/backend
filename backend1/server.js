const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// Função auxiliar para ler o banco de dados do arquivo JSON
function lerBancoDados() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(
            DB_FILE,
            JSON.stringify({ alunos: [] }, null, 2)
        );
    }

    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
}


// Função auxiliar para salvar no banco de dados
function salvarBancoDados(dados) {
    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(dados, null, 2)
    );
}


// ... ROTAS DA API (CRUD) ---


// CREATE (Create - POST)
app.post('/api/alunos', (req, res) => {
    const { nome, email, curso, cpf, idade, rg } = req.body;

    // Validação simples
    if (!nome || !email || !curso || !cpf || !idade || !rg) {
        return res.status(400).json({
            erro: 'Todos os campos são obrigatórios!'
        });
    }

    const db = lerBancoDados();

    // calcula o próximo ID
    const nextID = db.alunos.length > 0
        ? Math.max(...db.alunos.map(a => a.id)) + 1
        : 1;

    const novoAluno = {
        id: nextID,
        nome,
        email,
        curso,
        cpf,
        idade,
        rg
    };

    db.alunos.push(novoAluno);

    salvarBancoDados(db);

    res.status(201).json(novoAluno);
});


// READ (Ler/Listar - GET)
app.get('/api/alunos', (req, res) => {
    const db = lerBancoDados();

    res.json(db.alunos);
});


// READ (Buscar por ID - GET)
app.get('/api/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const db = lerBancoDados();

    const aluno = db.alunos.find(a => a.id === id);

    if (!aluno) {
        return res.status(404).json({
            erro: 'Aluno não encontrado!'
        });
    }

    res.json(aluno);
});


// UPDATE (Atualizar - PUT)
app.put('/api/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const { nome, email, curso, cpf, rg } = req.body;

    if (!nome || !email || !curso || !cpf || !idade || !rg) {
        return res.status(400).json({
            erro: 'Todos os campos são obrigatórios!'
        });
    }

    const db = lerBancoDados();

    const index = db.alunos.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({
            erro: 'Aluno não encontrado!'
        });
    }

    db.alunos[index] = {
        id,
        nome,
        email,
        curso,
        cpf,
        idade,
        rg
    };

    salvarBancoDados(db);

    res.json(db.alunos[index]);
});


// DELETE (deletar - DELETE)
app.delete('/api/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const db = lerBancoDados();

    const index = db.alunos.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({
            erro: 'Aluno não encontrado!'
        });
    }

    db.alunos.splice(index, 1);

    salvarBancoDados(db);

    res.status(204).send();
});


// Iniciar o Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`Banco de dados local ativo no arquivo db.json`);
});
