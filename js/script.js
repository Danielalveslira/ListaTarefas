const inputTarefa = document.querySelector('#input-nova-tarefa');
const btnAddTarefa = document.querySelector('#btn-add-tarefa');
const tarefas = document.querySelector('#tarefas');
const xpDisplay = document.querySelector('#xpPoints');
let xpPoints = 0;

function loadXP() {
  const savedXP = localStorage.getItem('xpPoints');
  if (savedXP !== null) {
    xpPoints = parseFloat(savedXP);
    xpDisplay.innerText = xpPoints.toFixed(1);
  }
}

function saveXP() {
  localStorage.setItem('xpPoints', xpPoints);
}

function criaLi() {
  const li = document.createElement('li');
  li.classList.add('tarefa', 'bg-gray-800', 'p-2', 'rounded');
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
  const divBotoes = document.createElement('div');
  divBotoes.classList.add('botoes');

  const botaoConcluir = document.createElement('button');
  botaoConcluir.innerText = 'Concluir';
  botaoConcluir.setAttribute('class', 'concluir');
  botaoConcluir.style.color = '#4caf50';
  botaoConcluir.style.fontWeight = 'bold';
  botaoConcluir.style.marginRight = '10px';

  const botaoApagar = document.createElement('button');
  botaoApagar.innerText = 'Excluir';
  botaoApagar.setAttribute('class', 'apagar');
  botaoApagar.style.color = '#f44336';
  botaoApagar.style.fontWeight = 'bold';

  divBotoes.appendChild(botaoConcluir);
  divBotoes.appendChild(botaoApagar);
  li.appendChild(divBotoes);
}

function criaTarefa(textoInput) {
  const li = criaLi();

  const tarefaTexto = document.createElement('span');
  tarefaTexto.classList.add('tarefa-texto');
  tarefaTexto.innerText = textoInput;

  li.appendChild(tarefaTexto);
  criaBotoes(li);
  tarefas.appendChild(li);
  limpaInput();
  salvarTarefa();
}

function incrementXP() {
  xpPoints += 0.6;
  xpDisplay.innerText = xpPoints.toFixed(1);
  saveXP();
}

function decrementXP() {
  xpPoints = Math.max(0, xpPoints - 0.5);
  xpDisplay.innerText = xpPoints.toFixed(1);
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
    el.parentElement.parentElement.remove();
    salvarTarefa();
  } else if (el.classList.contains('apagar')) {
    decrementXP();
    el.parentElement.parentElement.remove();
    salvarTarefa();
  }
});

function salvarTarefa() {
  const liTarefas = tarefas.querySelectorAll('li');
  const listaDeTarefas = [];

  for (let tarefa of liTarefas) {
    let tarefaTexto = tarefa.querySelector('.tarefa-texto').innerText;
    listaDeTarefas.push(tarefaTexto);
  }
  const tarefasJSON = JSON.stringify(listaDeTarefas);
  localStorage.setItem('tarefas', tarefasJSON);
}

function adicionaTarefasSalvas() {
  const tarefasSalvas = localStorage.getItem('tarefas');
  if (tarefasSalvas) {
    const listaDeTarefas = JSON.parse(tarefasSalvas);
    for (let tarefa of listaDeTarefas) {
      criaTarefa(tarefa);
    }
  }
}

loadXP();
adicionaTarefasSalvas();
