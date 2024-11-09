const inputTarefa = document.querySelector('#input-nova-tarefa');
const btnAddTarefa = document.querySelector('#btn-add-tarefa');
const tarefas = document.querySelector('#tarefas');
const xpDisplay = document.querySelector('#xpPoints');
let xpPoints = 0;

function loadXP() {
  const savedXP = localStorage.getItem('xpPoints');
  if (savedXP !== null) {
    xpPoints = parseInt(savedXP, 10);
    xpDisplay.innerText = xpPoints;
  }
}

function saveXP() {
  localStorage.setItem('xpPoints', xpPoints);
}

function criaLi() {
  const li = document.createElement('li');
  li.classList.add('tarefa', 'flex', 'items-center', 'justify-between', 'bg-gray-800', 'p-2', 'rounded');
  return li;
}

inputTarefa.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    if (!inputTarefa.value) return;
    criaTarefa(inputTarefa.value);
  }
});

function limpaInput() {
  inputTarefa.value = '';
  inputTarefa.focus();
}

function criaBotoes(li) {
  const botaoConcluir = document.createElement('button');
  botaoConcluir.innerText = 'Concluir';
  botaoConcluir.setAttribute('class', 'concluir');
  botaoConcluir.style.color = '#4caf50';
  botaoConcluir.style.fontWeight = 'bold';
  botaoConcluir.style.marginRight = '10px';
  botaoConcluir.style.marginLeft = '10px';
  li.appendChild(botaoConcluir);

  const botaoApagar = document.createElement('button');
  botaoApagar.innerText = 'Excluir';
  botaoApagar.setAttribute('class', 'apagar');
  botaoApagar.style.color = '#f44336';
  botaoApagar.style.fontWeight = 'bold';
  li.appendChild(botaoApagar);
}


function criaTarefa(textoInput) {
  const li = criaLi();
  li.innerText = textoInput;
  tarefas.appendChild(li);
  limpaInput();
  criaBotoes(li);
  salvarTarefa();
}

function incrementXP() {
  xpPoints += 4; // Valor de XP por tarefa
  xpDisplay.innerText = xpPoints;
  saveXP();
}

function decrementXP() {
  xpPoints = Math.max(0, xpPoints - 2);
  xpDisplay.innerText = xpPoints;
  saveXP();
}

btnAddTarefa.addEventListener('click', function () {
  if (!inputTarefa.value) return;
  criaTarefa(inputTarefa.value);
});

document.addEventListener('click', function (e) {
  const el = e.target;

  if (el.classList.contains('concluir')) {
    incrementXP();
    el.parentElement.remove();
    salvarTarefa();
  } else if (el.classList.contains('apagar')) {
    decrementXP();
    el.parentElement.remove();
    salvarTarefa();
  }
});

function salvarTarefa() {
  const liTarefas = tarefas.querySelectorAll('li');
  const listaDeTarefas = [];

  for (let tarefa of liTarefas) {
    let tarefaTexto = tarefa.innerText;
    tarefaTexto = tarefaTexto.replace('Concluir', '').replace('Excluir', '').trim();
    listaDeTarefas.push(tarefaTexto);
  }
  const tarefasJSON = JSON.stringify(listaDeTarefas);
  localStorage.setItem('tarefas', tarefasJSON);
}

function adicionaTarefasSalvas() {
  const tarefas = localStorage.getItem('tarefas');
  if (tarefas) {
    const listaDeTarefas = JSON.parse(tarefas);
    for (let tarefa of listaDeTarefas) {
      criaTarefa(tarefa);
    }
  }
}

loadXP(); // Carrega o XP salvo ao iniciar
adicionaTarefasSalvas(); // Adiciona as tarefas salvas
