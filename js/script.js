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
  li.classList.add(
    'tarefa',
    'p-2',
    'rounded',
    'bg-gray-200',
    'dark:bg-gray-900',
    'text-text-light'
  );
  return li;
}

inputTarefa.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    adicionarTarefa();
  }
});

btnAddTarefa.addEventListener('click', adicionarTarefa);

function limpaInput() {
  inputTarefa.value = '';
  inputTarefa.focus();
}

function criaBotoes(li) {
  const divBotoes = document.createElement('div');
  divBotoes.classList.add('botoes');

  const botaoConcluir = criarBotao('Concluir', 'concluir', '#4caf50');
  const botaoApagar = criarBotao('Excluir', 'apagar', '#f44336');

  divBotoes.appendChild(botaoConcluir);
  divBotoes.appendChild(botaoApagar);
  li.appendChild(divBotoes);
}

function criarBotao(texto, classe, cor) {
  const botao = document.createElement('button');
  botao.innerText = texto;
  botao.setAttribute('class', classe);
  botao.style.color = cor;
  botao.style.fontWeight = 'bold';
  botao.style.marginRight = classe === 'concluir' ? '10px' : '0';
  return botao;
}

function criaTarefa(textoInput) {
  const texto = textoInput.trim();

  if (!validarTarefa(texto)) {
    limpaInput();
    return;
  }

  const li = criaLi();
  const tarefaTexto = document.createElement('span');
  tarefaTexto.classList.add('tarefa-texto');
  tarefaTexto.innerText = texto;

  li.appendChild(tarefaTexto);
  criaBotoes(li);
  tarefas.appendChild(li);
  limpaInput();
  salvarTarefa();
}

function validarTarefa(texto) {
  if (texto === '') {
    alert("Você não digitou nenhuma tarefa 🔴");
    return false;
  }
  if (texto.length > 150) {
    alert("A tarefa não pode ter mais de 150 caracteres. 🔴");
    return false;
  }
  const listaDeTarefas = Array.from(tarefas.querySelectorAll('.tarefa-texto')).map(tarefa => tarefa.innerText);
  if (listaDeTarefas.includes(texto)) {
    alert('Essa tarefa já existe! 🟢');
    return false;
  }
  return true;
}

function adicionarTarefa() {
  if (!inputTarefa.value.trim()) {
    alert("Você não digitou nenhuma tarefa 😮‍💨");
    limpaInput();
    return;
  }
  criaTarefa(inputTarefa.value);
}

function atualizarXP(incremento) {
  xpPoints = Math.max(0, xpPoints + incremento);
  xpDisplay.innerText = xpPoints.toFixed(1);
  saveXP();
}

document.addEventListener('click', function (e) {
  const el = e.target;
  if (el.classList.contains('concluir')) {
    atualizarXP(0.3);
    el.parentElement.parentElement.remove();
    salvarTarefa();
  } else if (el.classList.contains('apagar')) {
    atualizarXP(-0.2);
    el.parentElement.parentElement.remove();
    salvarTarefa();
  }
});

function salvarTarefa() {
  const listaDeTarefas = Array.from(tarefas.querySelectorAll('.tarefa-texto')).map(tarefa => tarefa.innerText);
  localStorage.setItem('tarefas', JSON.stringify(listaDeTarefas));
}

function adicionaTarefasSalvas() {
  const tarefasSalvas = localStorage.getItem('tarefas');
  if (tarefasSalvas) {
    const listaDeTarefas = JSON.parse(tarefasSalvas);
    listaDeTarefas.forEach(criaTarefa);
  }
}

loadXP();
adicionaTarefasSalvas();
