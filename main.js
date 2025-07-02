$(document).ready(function () {
function salvarTarefas() {
const tarefas = [];
$('#task-table tbody tr').each(function () {
tarefas.push($(this).find('td:first').text());
});
localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function salvarConcluidas() {
const concluidas = [];
$('#completed-tasks tbody tr').each(function () {
concluidas.push({
tarefa: $(this).find('td:first').text(),
data: $(this).find('td:last').data('datahora') || 0,
dataFormatada: $(this).find('td:last').text()
});
});
localStorage.setItem('concluidas', JSON.stringify(concluidas));
}

function carregarTarefas() {
const tarefas = JSON.parse(localStorage.getItem('tarefas') || '[]');
tarefas.forEach(function (tarefa) {
$('#task-table tbody').append(`
<tr>
<td>${tarefa}</td>
<td>
<button class="concluir-btn">Concluir</button>
<button class="limpar-btn">Limpar</button>
</td>
</tr>
`);
});
const concluidas = JSON.parse(localStorage.getItem('concluidas') || '[]');
concluidas.forEach(function (item) {
const dataHora = item.data ? item.data : 0;
$('#completed-tasks tbody').append(`
<tr>
<td>${item.tarefa}</td>
<td data-datahora="${dataHora}">${item.dataFormatada}</td>
</tr>
`);
});
}

carregarTarefas();

$('#task-form').on('submit', function (e) {
e.preventDefault();
const tarefa = $('#tarefa').val().trim();
if (tarefa) {
$('#task-table tbody').append(`
<tr>
<td>${tarefa}</td>
<td>
<button class="concluir-btn">Concluir</button>
<button class="limpar-btn">Limpar</button>
</td>
</tr>
`);
$('#tarefa').val('');
salvarTarefas();
}
});

// Limpa tarefas concluídas com mais de 24h ao clicar em "Limpar Tarefas"
$('#task-form').on('reset', function (e) {
e.preventDefault();
alert('Atenção: Só é possível excluir tarefas concluídas após 24 horas da conclusão.');
const agora = Date.now();
$('#completed-tasks tbody tr').each(function () {
const tdData = $(this).find('td:last');
const dataHora = Number(tdData.data('datahora')) || 0;
if (agora - dataHora > 24 * 60 * 60 * 1000) {
$(this).remove();
}
});
salvarConcluidas();
});

// Evento para concluir tarefa
$('#task-table').on('click', '.concluir-btn', function () {
const row = $(this).closest('tr');
const tarefa = row.find('td:first').text();
const dataHora = Date.now();
const dataFormatada = new Date(dataHora).toLocaleString('pt-BR');
$('#completed-tasks tbody').append(`
<tr>
<td>${tarefa}</td>
<td data-datahora="${dataHora}">${dataFormatada}</td>
</tr>
`);
row.remove();
salvarTarefas();
salvarConcluidas();
});

// Evento para limpar tarefa individual com confirmação
$('#task-table').on('click', '.limpar-btn', function () {
const row = $(this).closest('tr');
const tarefa = row.find('td:first').text();
if (confirm(`Tem certeza que deseja limpar a tarefa "${tarefa}" da sua lista de afazeres?`)) {
row.remove();
salvarTarefas();
}
});
});