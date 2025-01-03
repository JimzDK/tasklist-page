let tasks = [];

document.addEventListener('DOMContentLoaded', () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = savedTasks;
    renderTasks();
    updateTaskCount();
});

function saveTask(task, text) {
    const tasklist = document.querySelector('.tasklist');
    if (!tasklist.contains(task)) return;
    if (!text || text.trim() === '') {
        tasklist.removeChild(task);
        tasks = tasks.filter((v) => v.id != task.dataset.id);
    } else {
        const existingTask = tasks.find((v) => v.id == task.dataset.id);
        if (existingTask) {
            const checkbox = task.querySelector('input[type="checkbox"]');
            existingTask.text = text.trim();
            existingTask.completed = checkbox.checked;
        } else {
            tasks.push({ id: task.dataset.id, text: text.trim(), completed: false });
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskCount();
}

function deleteTask(task) {
    const tasklist = document.querySelector('.tasklist');
    tasklist.removeChild(task);
    tasks = tasks.filter((v) => v.id != task.dataset.id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskCount();
}

function addTask(focus, text = '', checked = false, id = null) {
    const tasklist = document.querySelector('.tasklist');
    const task = document.createElement('div');
    task.classList.add('task');
    task.dataset.id = id || Date.now();

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;

    const taskInput = document.createElement('div');
    taskInput.classList.add('textarea');
    taskInput.contentEditable = true;
    taskInput.innerText = text;
    taskInput.spellcheck = false;

    taskInput.style.opacity = checkbox.checked ? '0.5' : '1.0';
    taskInput.style.textDecoration = checkbox.checked ? 'line-through' : 'none';

    const deleteButton = document.createElement('button');
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-trash');

    deleteButton.appendChild(icon);

    task.appendChild(checkbox);
    task.appendChild(taskInput);
    task.appendChild(deleteButton);

    tasklist.appendChild(task);

    deleteButton.addEventListener('click', () => deleteTask(task));

    taskInput.addEventListener('blur', () => saveTask(task, taskInput.innerText));

    taskInput.addEventListener('keydown', (event) => {
        if ((event.key === 'Enter' && !event.shiftKey) || event.key === 'Escape') {
            event.preventDefault();
            taskInput.blur();
            if (event.key === 'Enter') addTask(true);
        }
    });

    checkbox.addEventListener('click', () => {
        taskInput.style.opacity = checkbox.checked ? '0.5' : '1.0';
        taskInput.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
        saveTask(task, taskInput.innerText);
        renderTasks();
    });

    if (focus) taskInput.focus();
    updateTaskCount();
}

function renderTasks() {
    const tasklist = document.querySelector('.tasklist');
    tasklist.innerHTML = '';
    const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);
    sortedTasks.forEach((task) => addTask(false, task.text, task.completed, task.id));
}

function updateTaskCount() {
    const header = document.getElementById('headerCount');
    const completedTasks = tasks.filter((task) => !task.completed).length;
    header.innerText = `Tasks (${completedTasks})`;
}

document.getElementById('searchField').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const tasks = document.querySelectorAll('.tasklist .task .textarea');

    tasks.forEach((task) => {
        const compare = task.innerText.toLowerCase();
        const parentDiv = task.parentElement;
        parentDiv.style.display = compare.includes(filter) ? '' : 'none';
    });
});

document.getElementById('addTask').addEventListener('click', () => {
    addTask(true);
});
