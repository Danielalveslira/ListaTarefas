/** Função para criar o botão de editar */
function criarBotaoEditar() {
  return criarBotao('Editar', 'editar', '#2196f3');
}

/** Lógica para habilitar a edição de uma tarefa */
function habilitarEdicao(tarefaLi) {
  if (document.querySelector(".input-edicao")) {
    const confirma = confirm('Você tem uma edição em andamento. Deseja descartá-la?');
    if (!confirma) return;

    const inputEdicaoAtivo = document.querySelector('.input-edicao');
    const tarefaLiAtiva = inputEdicaoAtivo.closest('li');

    // Reverte o estado anterior
    const tarefaTextoAnterior = document.createElement('span');
    tarefaTextoAnterior.classList.add('tarefa-texto');
    tarefaTextoAnterior.innerText = inputEdicaoAtivo.value.trim();
    tarefaLiAtiva.replaceChild(tarefaTextoAnterior, inputEdicaoAtivo);

    const botaoSalvarAnterior = tarefaLiAtiva.querySelector('.salvar');
    const botaoEditarAnterior = criarBotaoEditar();
    botaoSalvarAnterior.parentElement.replaceChild(botaoEditarAnterior, botaoSalvarAnterior);

    tarefaLiAtiva.classList.remove('em-edicao');
  }

  const tarefaTexto = tarefaLi.querySelector('.tarefa-texto');

  // Substitui o texto por um campo de input
  const inputEdicao = document.createElement('input');
  inputEdicao.type = 'text';
  inputEdicao.value = tarefaTexto.innerText;
  inputEdicao.classList.add('input-edicao');
  tarefaLi.replaceChild(inputEdicao, tarefaTexto);

  // Substitui o botão "Editar" por "Salvar"
  const botaoEditar = tarefaLi.querySelector('.editar');
  const botaoSalvar = criarBotao('Salvar', 'salvar', '#4caf50');
  botaoEditar.parentElement.replaceChild(botaoSalvar, botaoEditar);

  tarefaLi.classList.add('em-edicao');

  inputEdicao.focus(); // Foca no campo de edição
}

/** Lógica para salvar a edição de uma tarefa */
function salvarEdicao(tarefaLi) {
  const inputEdicao = tarefaLi.querySelector('.input-edicao');

  if (!inputEdicao) {
    alert('Nenhuma edição está em andamento.');
    return;
  }

  const novoTexto = inputEdicao.value.trim();

  if (novoTexto) {
    // Substitui o input pelo texto atualizado
    const tarefaTexto = document.createElement('span');
    tarefaTexto.classList.add('tarefa-texto');
    tarefaTexto.innerText = novoTexto;
    tarefaLi.replaceChild(tarefaTexto, inputEdicao);

    // Substitui o botão "Salvar" por "Editar"
    const botaoSalvar = tarefaLi.querySelector('.salvar');
    const botaoEditar = criarBotaoEditar();
    botaoSalvar.parentElement.replaceChild(botaoEditar, botaoSalvar);

    tarefaLi.classList.remove('em-edicao');

    salvarTarefas(); // Salva as alterações no localStorage
  } else {
    alert('O texto da tarefa não pode estar vazio.');
  }
}

/** Lógica para concluir a tarefa */
// function concluirTarefa(tarefaLi) {
//   if (!tarefaLi) {
//     console.error('Elemento da tarefa não encontrado.');
//     return;
//   }

//   if (tarefaLi.classList.contains('em-edicao')) {
//     alert('Finalize a edição antes de concluir esta tarefa.');
//     return;
//   }

//   tarefaLi.classList.toggle('concluida');
//   salvarTarefas(); // Atualiza o estado no localStorage
// }

/** Adiciona a lógica de edição ao evento de clique */
document.addEventListener('click', function (e) {
  const el = e.target;

  if (el.classList.contains('editar')) {
    const tarefaLi = el.closest('li');
    if (tarefaLi) habilitarEdicao(tarefaLi);
  } else if (el.classList.contains('salvar')) {
    const tarefaLi = el.closest('li');
    if (tarefaLi) salvarEdicao(tarefaLi);
  } else if (el.classList.contains('concluir')) {
    const tarefaLi = el.closest('li');
    if (tarefaLi) concluirTarefa(tarefaLi);
  }
});
