document.addEventListener('DOMContentLoaded', () => {
    const columns = document.querySelectorAll('.column');

    // Charger les tâches depuis le LocalStorage
    loadTasks();

    columns.forEach(column => {
        const addButton = column.querySelector('.add-task button');
        const input = column.querySelector('.add-task input');
        const taskList = column.querySelector('.task-list');

        addButton.addEventListener('click', () => addTask(column, input, taskList));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask(column, input, taskList);
        });
    });

    function addTask(column, input, taskList) {
        if (input.value.trim() === '') return;
        const task = createTaskElement(input.value);
        taskList.appendChild(task);
        input.value = '';
        saveTasks();
    }

    function createTaskElement(text, completed = false) {
        const task = document.createElement('div');
        task.classList.add('task');
        if (completed) {
            task.classList.add('completed');
        }
        task.setAttribute('draggable', 'true');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', () => {
            task.classList.toggle('completed');
            saveTasks();
        });

        const span = document.createElement('span');
        span.textContent = text;

        task.appendChild(checkbox);
        task.appendChild(span);

        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);

        return task;
    }

    let draggedTask = null;

    function dragStart() {
        draggedTask = this;
        setTimeout(() => this.style.display = 'none', 0);
    }

    function dragEnd() {
        this.style.display = 'flex';
        draggedTask = null;
        saveTasks();
    }

    const taskLists = document.querySelectorAll('.task-list');

    taskLists.forEach(list => {
        list.addEventListener('dragover', (e) => e.preventDefault());
        list.addEventListener('dragenter', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '#f0f0f0';
        });
        list.addEventListener('dragleave', function() {
            this.style.backgroundColor = '';
        });
        list.addEventListener('drop', function() {
            this.style.backgroundColor = '';
            if (draggedTask) {
                this.appendChild(draggedTask);
                saveTasks();
            }
        });
    });

    function saveTasks() {
        const data = {};

        columns.forEach(column => {
            const columnId = column.getAttribute('data-column');
            const tasks = [];
            const taskList = column.querySelectorAll('.task');
            taskList.forEach(task => {
                const text = task.querySelector('span').textContent;
                const completed = task.querySelector('input[type="checkbox"]').checked;
                tasks.push({ text, completed });
            });
            data[columnId] = tasks;
        });

        localStorage.setItem('eisenhowerMatrixTasks', JSON.stringify(data));
    }

    function loadTasks() {
        const data = JSON.parse(localStorage.getItem('eisenhowerMatrixTasks'));
        if (!data) return;

        columns.forEach(column => {
            const columnId = column.getAttribute('data-column');
            const taskList = column.querySelector('.task-list');
            taskList.innerHTML = '';

            if (data[columnId]) {
                data[columnId].forEach(taskData => {
                    const task = createTaskElement(taskData.text, taskData.completed);
                    taskList.appendChild(task);
                });
            }
        });
    }
});
