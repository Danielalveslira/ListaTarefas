const inputTarefa = document.querySelector('#input-nova-tarefa');
const btnAddTarefa = document.querySelector('#btn-add-tarefa');
const tarefas = document.querySelector('#tarefas');

function criaLi() {
  const li = document.createElement('li');
  li.classList.add('tarefa');
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

function criaBotãoApagar(li) {
  li.innerText += ' ';
  const botaoApagar = document.createElement('button');
  botaoApagar.innerText = 'Apagar'
  botaoApagar.setAttribute('class', 'apagar');
  li.appendChild(botaoApagar);
  botaoApagar.style.color = '#3fb950';
  botaoApagar.style.fontWeight = 'bold';
}

function criaTarefa(textoInput) {
  const li = criaLi();
  li.innerText = textoInput;
  tarefas.appendChild(li);
  limpaInput();
  criaBotãoApagar(li)
  salvarTarefa();
}

btnAddTarefa.addEventListener('click', function () {
  if (!inputTarefa.value) return;
  criaTarefa(inputTarefa.value);
});

document.addEventListener('click', function (e) {
  const el = e.target;

  if (el.classList.contains('apagar')) {
    el.parentElement.remove();
    salvarTarefa();
  }
});

function salvarTarefa() {
  const liTarefas = tarefas.querySelectorAll('li');
  const listaDeTarefas = [];

  for (let tarefa of liTarefas) {
    let tarefaTexto = tarefa.innerText;
    tarefaTexto = tarefaTexto.replace('Apagar', '').trim();
    listaDeTarefas.push(tarefaTexto);
  }
  const tarefasJSON = JSON.stringify(listaDeTarefas);
  localStorage.setItem('tarefas', tarefasJSON);
}

function adicionaTarefasSalvas() {
  const tarefas = localStorage.getItem('tarefas');
  const listaDeTarefas = JSON.parse(tarefas);
  for (let tarefa of listaDeTarefas) {
    criaTarefa(tarefa);
  }
}
adicionaTarefasSalvas();
