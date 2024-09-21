document.addEventListener('DOMContentLoaded', () => {
    const columns = document.querySelectorAll('.column');

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
        const task = document.createElement('div');
        task.classList.add('task');
        task.setAttribute('draggable', 'true');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => {
            task.classList.toggle('completed');
        });

        const span = document.createElement('span');
        span.textContent = input.value;

        task.appendChild(checkbox);
        task.appendChild(span);

        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);

        taskList.appendChild(task);
        input.value = '';
    }

    let draggedTask = null;

    function dragStart() {
        draggedTask = this;
        setTimeout(() => this.style.display = 'none', 0);
    }

    function dragEnd() {
        this.style.display = 'flex';
        draggedTask = null;
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
            }
        });
    });
});
