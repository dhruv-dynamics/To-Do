// ======================================================
// Intermediate Level Simple & Clean JavaScript
// Easy to read, understand and modify for beginners/intermediates
// ======================================================

// 1. Select DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const statsText = document.getElementById('stats-text');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// 2. State Variables
// LocalStorage se tasks load karenge, agar nahi hai to empty array []
let tasks = JSON.parse(localStorage.getItem('my_tasks')) || [];
let currentFilter = 'all'; // 'all', 'pending', ya 'completed'

// 3. Save tasks to LocalStorage
function saveTasks() {
  localStorage.setItem('my_tasks', JSON.stringify(tasks));
}

// 4. Update Header and Footer Counts
function updateStats() {
  const total = tasks.length;
  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = total - completedCount;

  statsText.textContent = `${completedCount} completed of ${total} tasks`;
  itemsLeft.textContent = `${pendingCount} tasks pending`;
}

// 5. Render/Display Tasks in DOM
function renderTasks() {
  // Purana list content saaf karo
  taskList.innerHTML = '';

  // Filter tasks based on selected tab
  let filteredTasks = tasks;
  if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }

  // Agar koi task nahi hai
  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<li class="empty-msg">No tasks to display!</li>`;
    updateStats();
    return;
  }

  // Tasks create karke append karo
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="task-left">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          ${task.completed ? 'checked' : ''}
        />
        <span class="task-text">${task.text}</span>
      </div>
      <button class="delete-btn" title="Delete Task">✕</button>
    `;

    // Checkbox click: Toggle complete/pending
    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => {
      toggleTask(task.id);
    });

    // Delete button click
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      deleteTask(task.id);
    });

    taskList.appendChild(li);
  });

  updateStats();
}

// 6. Add New Task
function addTask(e) {
  e.preventDefault(); // Page refresh hone se roko

  const text = taskInput.value.trim();
  if (text === '') return;

  const newTask = {
    id: Date.now(), // Unique ID using timestamp
    text: text,
    completed: false
  };

  tasks.unshift(newTask); // Naya task shuruat me add karo
  saveTasks();
  renderTasks();

  taskInput.value = ''; // Input empty karo
  taskInput.focus();
}

// 7. Toggle Task Completed
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

// 8. Delete Single Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// 9. Clear All Completed Tasks
clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

// 10. Filter Tabs (All / Pending / Completed)
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Active class switch
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// 11. Form Submit Event
taskForm.addEventListener('submit', addTask);

// Initial Load par sample task agar pehli baar khola hai
if (tasks.length === 0 && !localStorage.getItem('app_opened')) {
  tasks = [
    { id: 1, text: 'Learn JavaScript basics', completed: true },
    { id: 2, text: 'Build a responsive To-Do project', completed: false }
  ];
  localStorage.setItem('app_opened', 'true');
  saveTasks();
}

// Pehli baar screen par render karo
renderTasks();
