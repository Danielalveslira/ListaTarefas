// Seletores globais
const inputTarefa = document.querySelector('#input-nova-tarefa');
const btnAddTarefa = document.querySelector('#btn-add-tarefa');
const tarefas = document.querySelector('#tarefas');
const tarefasConcluidas = document.querySelector('#tarefas-concluidas');
const tarefasContainer = document.querySelector('#tarefas-container');

/**
 * Função utilitária para formatar datas
 * (Extraída para evitar repetição de código ao lidar com datas)
 */
function formatarData(data) {
  const opcoesDeData = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return data.toLocaleDateString('pt-BR', opcoesDeData);
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
  const botaoEditar = criarBotao('Editar', 'editar', '#2196f3'); // Botão Editar
  const botaoApagar = criarBotao('Excluir', 'apagar', '#f44336');

  divBotoes.appendChild(botaoConcluir);
  divBotoes.appendChild(botaoEditar);
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
  botao.style.marginRight = classe === 'apagar' ? '10px' : '0';
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


  // Obtém o elemento <li> mais próximo
  const tarefaLi = el.closest('li');
  if (!tarefaLi) return; // Sai se tarefaLi for nulo ou indefinido

  // Verifica se a tarefa está em edição
  const emEdicao = tarefaLi.classList.contains('em-edicao');

  // Se a tarefa estiver em edição e o usuário clicar em 'concluir', mostra o alerta
  if (emEdicao && el.classList.contains('concluir')) {
    alert('Finalize a edição antes de concluir esta tarefa.');
    return; // Não prossegue com a conclusão da tarefa
  }

  // Ação para concluir uma tarefa
  if (el.classList.contains('concluir')) {
    el.parentElement.remove(); // Remove os botões ao mover o elemento
    criaBotaoLimpar(tarefaLi); // Adiciona o botão limpar
    tarefasConcluidas.appendChild(tarefaLi);
    salvarTarefas();
  }
  // Ação para apagar uma tarefa
  else if (el.classList.contains('apagar')) {
    // Verifica se a tarefa foi concluída
    const isConcluida = tarefasConcluidas.contains(tarefaLi);

    if (!isConcluida) {
    }
    tarefaLi.remove();
    salvarTarefas();
  }

  // Ação para salvar a tarefa editada
  if (el.classList.contains('salvar-edicao')) {
    // Remover a classe 'em-edicao' e salvar as alterações feitas
    tarefaLi.classList.remove('em-edicao');
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

adicionaTarefasSalvas();
