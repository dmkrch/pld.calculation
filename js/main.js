// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksLists = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

// Добавить задачу
form.addEventListener('submit', addTask)

function addTask(event) {
    // Отменяем отправку формы
    event.preventDefault();

    // Достаем текст задачи из поля ввода
    const taskText = taskInput.value    
    
    const taskHTML = `		
                    <li class="list-group-item d-flex justify-content-between task-item">
                        <span class="task-title">${taskText}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                            <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                    </li>`;


    // Добавляем задачу на страницу
    tasksLists.insertAdjacentHTML('beforeend', taskHTML);

    // Очищаем поле ввода и фокус оставляем на вводе
    taskInput.value = "";
    taskInput.focus()

    // Если есть задачи - скрыть
    if (tasksLists.children.length > 1) {
        emptyList.classList.add('none')
    }
}

// Удалить задачу
tasksLists.addEventListener('click', deleteTask)

function deleteTask(event) {
    if (event.target.dataset.action === 'delete') {
        const parentNode = event.target.closest('.list-group-item');

        parentNode.remove()
    }

    if (tasksLists.children.length === 1) {
        emptyList.classList.remove('none')
    }
}