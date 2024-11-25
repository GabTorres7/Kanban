// Funções principais
function inicializarKanban() {
    // A primeira função que é chamada para inicializar o Kanban.
    carregarTarefasSalvas();  // Carrega as tarefas salvas no armazenamento local (localStorage).
    configurarEventos();       // Configura todos os eventos necessários (como adicionar tarefas e interações de arrastar).
}

function configurarEventos() {
    // Aqui são configurados os eventos que acontecem quando o usuário interage com a interface do Kanban.
    
    const botaoAdicionar = document.getElementById('botaoAdicionar');  // Obtém o botão de adicionar tarefa.
    const entradaTarefa = document.getElementById('entradaTarefa');    // Obtém o campo de entrada de texto para a tarefa.
    
    if (botaoAdicionar && entradaTarefa) {
        // Verifica se os elementos existem na página (caso contrário, evita erros).
        
        // Quando o botão de adicionar é clicado, chama a função para adicionar a nova tarefa.
        botaoAdicionar.addEventListener('click', () => adicionarNovaTarefa(entradaTarefa.value));
        
        // Quando a tecla 'Enter' é pressionada na entrada de tarefa, também chama a função para adicionar a nova tarefa.
        entradaTarefa.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                adicionarNovaTarefa(entradaTarefa.value);
            }
        });
    }

    configurarDragAndDrop();  // Configura os eventos de arrastar e soltar (drag and drop).
}

function adicionarNovaTarefa(texto) {
    // Função para adicionar uma nova tarefa. Recebe o texto da tarefa como argumento.
    
    const entradaTarefa = document.getElementById('entradaTarefa');  // Obtém novamente o campo de entrada de tarefa.
    
    // Verifica se o texto não está vazio (ou seja, se a tarefa tem algum conteúdo).
    if (texto.trim() !== '') {
        const cartao = criarCartaoTarefa(texto);  // Cria um novo cartão de tarefa com o texto fornecido.
        
        const colunaAberto = document.querySelector('.coluna.aberto .conteudo-coluna');
        // Busca pela coluna "aberta" (onde as tarefas novas devem ser colocadas).
        
        if (colunaAberto) {
            // Se a coluna foi encontrada, adiciona o novo cartão à coluna.
            colunaAberto.appendChild(cartao);
            entradaTarefa.value = '';  // Limpa o campo de entrada após adicionar a tarefa.
            salvarEstadoKanban();      // Salva o estado atual do Kanban no localStorage.
        }
    }
}

function criarCartaoTarefa(texto) {
    // Função que cria o elemento de cartão de tarefa com o texto fornecido.
    
    const cartao = document.createElement('div');  // Cria um novo div para representar o cartão.
    cartao.className = 'cartao-tarefa aberto';     // Define as classes do cartão para estilização.
    cartao.draggable = true;  // Permite que o cartão seja arrastado.
    cartao.textContent = texto;  // Define o texto da tarefa no cartão.
    
    configurarEventosCartao(cartao);  // Configura os eventos do cartão (drag start e drag end).
    
    return cartao;  // Retorna o novo cartão criado.
}

function configurarEventosCartao(cartao) {
    // Função que configura os eventos para o comportamento de arrastar e soltar (drag).
    
    cartao.addEventListener('dragstart', (e) => {
        // Quando o arrasto do cartão começa:
        cartao.classList.add('arrastando');  // Adiciona uma classe para estilizar o cartão enquanto está sendo arrastado.
        // e.dataTransfer.setData('text/plain', cartao.textContent);  // Define o conteúdo a ser transferido.
    });

    cartao.addEventListener('dragend', () => {
        // Quando o arrasto do cartão termina:
        cartao.classList.remove('arrastando');  // Remove a classe "arrastando".
    });
}

function configurarDragAndDrop() {
    // Função que configura os eventos de arrastar e soltar nas colunas.
    
    const colunas = document.querySelectorAll('.coluna .conteudo-coluna');
    // Obtém todas as colunas onde os cartões podem ser soltos.
    
    colunas.forEach(coluna => {
        // Para cada coluna, adiciona os eventos de dragover, dragleave e drop.
        
        coluna.addEventListener('dragover', (e) => {
            e.preventDefault();  // Impede o comportamento padrão do navegador (necessário para permitir o drop).
            coluna.parentElement.classList.add('arrastando-sobre');  // Adiciona uma classe de estilo para indicar que a coluna está pronta para receber o cartão.
        });

        coluna.addEventListener('dragleave', () => {
            coluna.parentElement.classList.remove('arrastando-sobre');  // Remove a classe de "arrastando-sobre" quando o cartão sai da área da coluna.
        });

        coluna.addEventListener('drop', (e) => {
            e.preventDefault();  // Impede o comportamento padrão do navegador.
            const colunaParent = coluna.parentElement;
            colunaParent.classList.remove('arrastando-sobre');  // Remove o estilo de "arrastando-sobre".
            
            const cartaoArrastado = document.querySelector('.cartao-tarefa.arrastando');
            // Encontra o cartão que está sendo arrastado.
            
            if (cartaoArrastado) {
                const status = colunaParent.dataset.status;  // Obtém o status (status da coluna: "aberto", "negociacao", etc.).
                
                // Remove as classes de status anteriores (no caso, status da coluna de onde o cartão veio).
                cartaoArrastado.classList.remove('aberto', 'negociacao', 'andamento', 'entregue');
                // Adiciona a nova classe de status correspondente à coluna para onde o cartão foi arrastado.
                cartaoArrastado.classList.add(status);
                
                coluna.appendChild(cartaoArrastado);  // Adiciona o cartão à nova coluna.
                salvarEstadoKanban();  // Salva o estado atualizado do Kanban.
            }
        });
    });
}

function salvarEstadoKanban() {
    // Função para salvar o estado atual do Kanban no localStorage (para persistência de dados).
    
    const colunas = document.querySelectorAll('.coluna');  // Obtém todas as colunas.
    const estado = {};  // Cria um objeto vazio para armazenar o estado.
    
    colunas.forEach(coluna => {
        const status = coluna.dataset.status;  // Obtém o status da coluna (usado para identificar a coluna: "aberto", "negociacao", etc.).
        const tarefas = Array.from(coluna.querySelectorAll('.cartao-tarefa')).map(cartao => cartao.textContent);  // Cria um array com o texto de todas as tarefas da coluna.
        estado[status] = tarefas;  // Armazena o estado das tarefas por status.
    });
    
    localStorage.setItem('estadoKanban', JSON.stringify(estado));  // Salva o estado no localStorage, transformando o objeto em uma string JSON.
}

function carregarTarefasSalvas() {
    // Função para carregar o estado salvo do Kanban quando a página for carregada.
    
    const estadoSalvo = localStorage.getItem('estadoKanban');  // Obtém o estado salvo no localStorage.
    
    if (estadoSalvo) {
        // Se houver um estado salvo:
        const estado = JSON.parse(estadoSalvo);  // Converte o estado de volta para um objeto.
        
        // Itera sobre cada status de coluna e recria as tarefas para essas colunas.
        for (const [status, tarefas] of Object.entries(estado)) {
            const coluna = document.querySelector(`.coluna[data-status="${status}"] .conteudo-coluna`);
            
            if (coluna) {
                tarefas.forEach(texto => {
                    const cartao = criarCartaoTarefa(texto);  // Cria um novo cartão de tarefa.
                    cartao.classList.remove('aberto');  // Remove a classe "aberto" que era a padrão ao criar um novo cartão.
                    cartao.classList.add(status);  // Adiciona a classe do status da coluna salva.
                    coluna.appendChild(cartao);  // Adiciona o cartão à coluna correspondente.
                });
            }
        }
    }
}

// Inicializa o Kanban quando a página for carregada
document.addEventListener('DOMContentLoaded', inicializarKanban);
