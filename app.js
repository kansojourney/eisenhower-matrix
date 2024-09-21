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

        // Gestion de l'édition
        span.addEventListener('click', (e) => {
            e.stopPropagation();
            enterEditMode(task, span);
        });

        // Créer l'icône de poubelle
        const deleteIcon = document.createElement('span');
        deleteIcon.classList.add('delete-icon');
        deleteIcon.innerHTML = '&times;';

        deleteIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            task.remove();
            saveTasks();
        });

        task.appendChild(checkbox);
        task.appendChild(span);
        task.appendChild(deleteIcon);

        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);

        return task;
    }

    function enterEditMode(task, span) {
        const originalText = span.textContent;

        // Créer un champ input pour l'édition
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalText;
        input.classList.add('edit-input');

        // Stocker le texte original dans un attribut de données
        input.dataset.originalText = originalText;

        // Remplacer le span par l'input
        task.replaceChild(input, span);
        input.focus();

        // Gestion de la sauvegarde lors de l'appui sur Entrée
        input.addEventListener('keypress', function onKeyPress(e) {
            if (e.key === 'Enter') {
                exitEditMode(task, input, true);
            }
        });

        // Gestion de l'annulation lors du clic en dehors
        function onClickOutside(e) {
            if (!task.contains(e.target)) {
                exitEditMode(task, input, false);
                document.removeEventListener('click', onClickOutside);
            }
        }

        document.addEventListener('click', onClickOutside);

        // Empêcher la propagation du clic à la tâche
        input.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    function exitEditMode(task, input, save) {
        const newText = input.value.trim();
        const span = document.createElement('span');

        if (save && newText !== '') {
            span.textContent = newText;
        } else {
            // Récupérer le texte original depuis l'attribut de données
            span.textContent = input.dataset.originalText;
        }

        // Réattacher l'événement de clic pour l'édition
        span.addEventListener('click', (e) => {
            e.stopPropagation();
            enterEditMode(task, span);
        });

        task.replaceChild(span, input);
        saveTasks();
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

 
