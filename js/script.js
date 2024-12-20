// Seletores globais
const inputTarefa = document.querySelector('#input-nova-tarefa');
const btnAddTarefa = document.querySelector('#btn-add-tarefa');
const tarefas = document.querySelector('#tarefas');
const tarefasConcluidas = document.querySelector('#tarefas-concluidas');
const xpDisplay = document.querySelector('#xpPoints');
const tarefasContainer = document.querySelector('#tarefas-container');
let xpPoints = 0;

/**
 * Função utilitária para formatar datas
 * (Extraída para evitar repetição de código ao lidar com datas)
 */
function formatarData(data) {
  const opcoesDeData = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return data.toLocaleDateString('pt-BR', opcoesDeData);
}

/** Carrega o XP do localStorage */
function loadXP() {
  const savedXP = localStorage.getItem('xpPoints');
  if (savedXP !== null) {
    xpPoints = parseFloat(savedXP);
    xpDisplay.innerText = xpPoints.toFixed(1);
  }
}

/** Salva o XP no localStorage */
function saveXP() {
  localStorage.setItem('xpPoints', xpPoints);
}

/** Cria um elemento de lista (<li>) para a tarefa */
function criaLi() {
  const li = document.createElement('li');
  li.classList.add('tarefa');
  return li;
}

/** Limpa o input e foca nele */
function limpaInput() {
  inputTarefa.value = '';
  inputTarefa.focus();
}

/** Cria os botões de Concluir e Apagar */
function criaBotoes(li) {
  const divBotoes = document.createElement('div');
  divBotoes.classList.add('botoes');

  const botaoConcluir = criarBotao('Concluir', 'concluir', '#4caf50');
  const botaoApagar = criarBotao('Excluir', 'apagar', '#f44336');

  divBotoes.appendChild(botaoConcluir);
  divBotoes.appendChild(botaoApagar);
  li.appendChild(divBotoes);
}

// Cria botão LimparTotal
function criaBotaoLimpar(li) {
  const divBotoes = document.createElement('div');
  divBotoes.classList.add('botoes');

  const botaoLimpar = criarBotao('Excluir', 'apagar', '#f44336');

  divBotoes.appendChild(botaoLimpar);
  li.appendChild(divBotoes);
}

/** Cria um botão genérico */
function criarBotao(texto, classe, cor) {
  const botao = document.createElement('button');
  botao.innerText = texto;
  botao.setAttribute('class', classe);
  botao.style.color = cor;
  botao.style.fontWeight = 'bold';
  botao.style.marginRight = classe === 'concluir' ? '10px' : '0';
  return botao;
}

/** Cria uma nova tarefa */
function criaTarefa(textoInput, dataCriacaoSalva, concluida = false) {
  const texto = textoInput.trim();

  if (!texto) return;

  const li = criaLi();
  const tarefaTexto = document.createElement('span');
  tarefaTexto.classList.add('tarefa-texto');
  tarefaTexto.innerText = texto;

  const dataCriacao = document.createElement('span');
  dataCriacao.classList.add('data-criacao');

  const dataAtual = dataCriacaoSalva ? new Date(dataCriacaoSalva) : new Date();
  dataCriacao.innerHTML = `Criado em: ${formatarData(dataAtual)}`; // Alterado para usar a função utilitária
  li.dataset.dataCriacao = dataAtual.toISOString();
  li.id = dataAtual.getTime();

  li.appendChild(tarefaTexto);

  if (!concluida) {
    criaBotoes(li);
    li.appendChild(dataCriacao);
    tarefas.appendChild(li);
  } else {
    li.appendChild(dataCriacao);
    criaBotaoLimpar(li);
    tarefasConcluidas.appendChild(li);
  }

  dataCriacao.style.marginLeft = '5px';
  dataCriacao.style.fontSize = '12px';

  limpaInput();
  salvarTarefas();
}

/** Valida o texto da tarefa */
function validarTarefa(texto) {
  if (texto.length > 400) {
    alert("A tarefa não pode ter mais de 400 caracteres.");
    return false;
  }
  const listaDeTarefas = Array.from(tarefas.querySelectorAll('.tarefa-texto')).map(tarefa => tarefa.innerText);
  if (listaDeTarefas.includes(texto)) {
    alert('Essa tarefa já existe! 🔴');
    return false;
  }
  return true;
}

/** Adiciona uma tarefa */
function adicionarTarefa() {
  if (!inputTarefa.value.trim()) {
    limpaInput();
    return;
  }
  if (validarTarefa(inputTarefa.value)) {
    criaTarefa(inputTarefa.value);
  }
}

/** Atualiza o XP e salva no localStorage */
function atualizarXP(incremento) {
  xpPoints = Math.max(0, xpPoints + incremento);
  xpDisplay.innerText = xpPoints.toFixed(1);
  saveXP();
}

/** Salva as tarefas no localStorage */
function salvarTarefas() {
  const tarefasPendentes = Array.from(tarefas.querySelectorAll('li')).map(li => ({
    id: li.id,
    texto: li.querySelector('.tarefa-texto').innerText,
    dataCriacao: li.dataset.dataCriacao,
    concluida: false,
  }));

  const tarefasConcluidasArray = Array.from(tarefasConcluidas.querySelectorAll('li')).map(li => ({
    id: li.id,
    texto: li.querySelector('.tarefa-texto').innerText,
    dataCriacao: li.dataset.dataCriacao,
    concluida: true,
  }));

  const todasAsTarefas = [...tarefasPendentes, ...tarefasConcluidasArray];
  localStorage.setItem('tarefas', JSON.stringify(todasAsTarefas));
}

/** Restaura as tarefas do localStorage */
function adicionaTarefasSalvas() {
  const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas'));

  if (!tarefasSalvas) return;

  tarefasSalvas.forEach(tarefa => {
    criaTarefa(tarefa.texto, tarefa.dataCriacao, tarefa.concluida);
  });
}

/** Lida com os cliques nos botões */
document.addEventListener('click', function (e) {
  const el = e.target;

  if (el.classList.contains('concluir')) {
    atualizarXP(0.3);
    const tarefaLi = el.parentElement.parentElement;
    el.parentElement.remove(); // Remove os botões ao mover o elemento
    criaBotaoLimpar(tarefaLi); // Já adiciona o botão limpar ao concluir a tarefa
    tarefasConcluidas.appendChild(tarefaLi);
    salvarTarefas();
  } else if (el.classList.contains('apagar')) {
    atualizarXP(-0.2);
    el.parentElement.parentElement.remove();
    salvarTarefas();
  }

});

/** Adiciona uma tarefa ao pressionar Enter */
inputTarefa.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    adicionarTarefa();
  }
});

// Adiciona uma tarefa ao clicar no botão
btnAddTarefa.addEventListener('click', adicionarTarefa);

loadXP();
adicionaTarefasSalvas();
