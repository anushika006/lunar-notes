document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todoForm');
  const taskInput = document.getElementById('taskInput');
  const taskCategory = document.getElementById('taskCategory');
  const todoList = document.getElementById('todoList');

  let todos = JSON.parse(localStorage.getItem('aurora_todos') || '[]');

  function saveTodos() {
    localStorage.setItem('aurora_todos', JSON.stringify(todos));
  }

  function renderTodos() {
    todoList.innerHTML = '';

    if (todos.length === 0) {
      todoList.textContent = 'No tasks yet.';
      return;
    }

    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.className = todo.completed ? 'completed' : '';

      const taskSpan = document.createElement('span');
      taskSpan.className = 'task-text';
      taskSpan.textContent = todo.text;

      const categorySpan = document.createElement('span');
      categorySpan.className = 'task-category';
      categorySpan.textContent = `[${todo.category}]`;

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'todo-actions';

      // Tick/Undo button
      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = todo.completed ? 'Undo' : 'Tick';
      toggleBtn.addEventListener('click', () => {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
      });

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
      });

      actionsDiv.appendChild(toggleBtn);
      actionsDiv.appendChild(deleteBtn);

      li.appendChild(taskSpan);
      li.appendChild(categorySpan);
      li.appendChild(actionsDiv);

      todoList.appendChild(li);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    const category = taskCategory.value;

    if (!text || !category) {
      alert('Please enter a task and select a category.');
      return;
    }

    todos.push({
      text,
      category,
      completed: false,
    });

    saveTodos();
    renderTodos();
    form.reset();
  });

  renderTodos();
});
