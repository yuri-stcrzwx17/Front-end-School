const baseUrl = 'https://lion-school-backend.onrender.com';

window.addEventListener('DOMContentLoaded', montarHome);

// ================= HOME =================

async function montarHome() {
    try {
        const res = await fetch(`${baseUrl}/cursos`);
        const json = await res.json();

        const cursos = Array.isArray(json)
            ? json
            : json.cursos || json.data || [];

        renderizarHome(cursos);

    } catch {
        renderizarHome([
            { id: 1, sigla: 'DS', nome: 'Desenvolvimento de Sistemas' },
            { id: 2, sigla: 'RDS', nome: 'Redes' }
        ]);
    }
}

function renderizarHome(cursos) {
    const container = document.getElementById('conteudo-home');

    container.innerHTML = `
        <div class="main-esquerdo">
            <img src="../Imgs/text.png" class="img-texto">
            <img src="../Imgs/devices.png" class="img-devices">
        </div>

        <div class="main-centro">
            <img src="../Imgs/studant.png" class="img-estudante">
        </div>

        <div class="main-direito" id="lista-botoes-cursos"></div>
    `

    const area = document.getElementById('lista-botoes-cursos');

    cursos.forEach(curso => {
        const btn = document.createElement('div');
        btn.className = 'btn-curso';
        btn.textContent = curso.sigla || curso.abreviatura || curso.code;

        btn.onclick = () => irParaAlunos(
            curso.nome || curso.name,
            curso.id || curso.idCurso
        );

        area.appendChild(btn);
    });
}

// ================= TELA =================

function irParaAlunos(nomeCurso, cursoId) {
    document.getElementById('home').style.display = 'none';
    document.getElementById('pagina-alunos').style.display = 'block';
    document.getElementById('titulo-dinamico').innerText = nomeCurso;

    carregarAlunos(cursoId);
}

function irParaHome() {
    document.getElementById('home').style.display = 'block';
    document.getElementById('pagina-alunos').style.display = 'none';
}

// ================= ALUNOS =================

async function carregarAlunos(cursoId) {
    const grid = document.querySelector('.grid-alunos');
    grid.innerHTML = "Carregando...";

    try {
        const res = await fetch(`${baseUrl}/cursos/${cursoId}/alunos`);
        const json = await res.json();

        const alunos = Array.isArray(json)
            ? json
            : json.alunos || json.students || json.data || [];

        renderizarAlunos(alunos);

    } catch (e) {
        console.error(e);
        grid.innerHTML = "<p>Erro ao carregar alunos</p>";
    }
}

// ================= RENDER =================

function renderizarAlunos(lista) {
    const grid = document.querySelector('.grid-alunos');
    grid.innerHTML = "";

    if (!lista.length) {
        grid.innerHTML = "<p>Nenhum aluno encontrado.</p>";
        return;
    }

    lista.forEach(a => {
        const nome = a.nome || a.name;
        const sexo = (a.sexo || a.gender || "M").toUpperCase();

        const card = document.createElement('div');
        card.className = `card ${sexo === 'F' ? 'amarelo' : 'azul'}`;

        card.innerHTML = `
            <img src="../Imgs/${sexo === 'F' ? 'aluna.png' : 'studant.png'}">
            <p>${nome}</p>
        `;

        grid.appendChild(card);
    });
}
