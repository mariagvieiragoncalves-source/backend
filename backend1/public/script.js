const API_URL = 'http://localhost:3000/api/alunos';

const form = document.getElementById('aluno-form');
const tbody = document.getElementById('alunos-tbody');
const btnCancel = document.getElementById('btn-cancel');
const btnSave = document.getElementById('btn-save');

// Campos do form
const inputID = document.getElementById('aluno-id');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputCurso = document.getElementById('curso');
const inputCpf = document.getElementById('cpf');
const inputIdade = document.getElementById('idade');
const inputRg = document.getElementById('rg');

//Estado local
let editandoID = null;


// 1. LER (GET): Buscar dados do backend e renderizar na tela
async function carregarAlunos() {
    try {
        const resposta = await fetch(API_URL);
        const alunos = await resposta.json();

        tbody.innerHTML = '';

        if(alunos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum aluno cadastrado.</td></tr>';
            return;
        }

        alunos.forEach(aluno => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
            <td>#${aluno.id}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.email}</td>
            <td>${aluno.curso}</td>
            <td>${aluno.cpf}</td>
            <td>${aluno.idade}</td>
            <td>${aluno.rg}</td>
            <td class="actions">

            <button class="btn-icon btn-edit" onclick=
            "iniciarEdicao(${aluno.id},
            '${aluno.nome}', '${aluno.email}',
            '${aluno.curso}', '${aluno.cpf}', '${aluno.idade}',  '${aluno.rg}')">
            Editar
            </button>

            <button class="btn-icon btn-delete"
            onclick="deletarAluno(${aluno.id})">
            Excluir
            </button>

            </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (erro) {
        console.error('erro ao buscar alunos:', erro);
        alert('Erro de conexão com o servidor!');
    }
}


// 2. Criar ou Atualizar (POST / PUT)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const aluno = {
        nome: inputNome.value,
        email: inputEmail.value,
        curso: inputCurso.value,
        cpf: inputCpf.value,
        idade: inputIdade.value,
        rg: inputRg.value
    };

    try {

        if (editandoID) {

            // Se tem um id, estamos editando (PUT)
            await fetch(`${API_URL}/${editandoID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(aluno)
            });

            editandoID = null;

        } else {

            // Se não tem ID, estamos criando (POST)
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(aluno)
            });
        }

        resetarFormulario();

        carregarAlunos();

    } catch (erro) {
        console.error('Erro ao salvar;', erro);
        alert('Erro ao salvar os dados no servidor');
    }
});


// 3. DELETAR
async function deletarAluno(id) {

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        carregarAlunos();

    } catch (erro) {
        console.error('Erro ao deletar:', erro);
        alert('Erro ao deletar aluno!');
    }
}


// 4. EDITAR
function iniciarEdicao(id, nome, email, curso, cpf) {

    editandoID = id;

    inputID.value = id;
    inputNome.value = nome;
    inputEmail.value = email;
    inputCurso.value = curso;
    inputCpf.value = cpf;
    inputIdade.value = idade;
    inputRg.value = rg;

    btnSave.textContent = 'Atualizar Aluno';

    btnCancel.style.display = 'inline-block';
}


// 5. CANCELAR EDIÇÃO
btnCancel.addEventListener('click', () => {
    resetarFormulario();
});


// 6. RESETAR FORMULÁRIO
function resetarFormulario() {

    form.reset();

    inputID.value = '';

    editandoID = null;

    btnSave.textContent = 'Salvar Aluno';

    btnCancel.style.display = 'none';
}


// Carregar alunos ao iniciar
carregarAlunos();
