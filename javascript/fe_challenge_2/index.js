// DOM Elements
const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskPrioritySelect = document.getElementById("task-priority");
const taskDueDateInput = document.getElementById("task-due-date");
const taskList = document.getElementById("task-list");
const taskFilter = document.getElementById("task-filter");
const taskSort = document.getElementById("task-sort");
const totalTasksElement = document.getElementById("total-tasks");
const completedTasksElement = document.getElementById("completed-tasks");
const pendingTasksElement = document.getElementById("pending-tasks");
const highPriorityTasksElement = document.getElementById("high-priority-tasks");

// Task Data Structure
let tasks = [];
let editingTaskId = null;

// Set today as minimum date for due date input
const today = new Date().toISOString().split("T")[0];
taskDueDateInput.setAttribute("min", today);

// Initialize the application
function initApp() {
  loadTasks();

  // set Event Listeners
  taskForm.addEventListener("submit", handleAddEditTask);
  taskFilter.addEventListener("change", renderTasks);
  taskSort.addEventListener("change", renderTasks);

  // Initial rendering
  renderTasks();
  updateStats();
}

function updateStats() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high"
  ).length;

  totalTasksElement.textContent = totalTasks;
  completedTasksElement.textContent = completedTasks;
  pendingTasksElement.textContent = pendingTasks;
  highPriorityTasksElement.textContent = highPriorityTasks;
}

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);

    // Convert string dates back to Date objects for proper sorting
    tasks.forEach((task) => (task.dueDate = new Date(task.dueDate)));
  }
}

// Handle form submission for adding or editing tasks
function handleAddEditTask(event) {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const priority = taskPrioritySelect.value;
  const dueDate = new Date(taskDueDateInput.value);

  // Validate Inputs
  if (!title || !priority || !taskDueDateInput.value) {
    alerts("please fill in all fields");
    return;
  }

  if (editingTaskId !== null) {
    // Edit an Existing Task
    const taskIndex = tasks.findIndex((task) => task.id === editingTaskId);
    if (taskIndex >= 0) {
      tasks[taskIndex].title = title;
      tasks[taskIndex].priority = priority;
      tasks[taskIndex].dueDate = dueDate;

      // Reset editing state
      editingTaskId = null;
      document.getElementById("add-task-btn").textContent = "Add Task";
    }
  } else {
    // Create a New Task
    const newTask = {
      id: Date.now().toString(),
      title,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date(),
    };
    tasks.push(newTask);
  }

  // Reset form
  taskForm.reset();

  // Save to local Storage, update UI
  saveTasksToLocalStorage();
  renderTasks();
  updateStats();
}

// Save tasks to LocalStorage
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  let filteredTasks = [...tasks];

  // Apply filter
  const filterValue = taskFilter.value;
  if (filterValue === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  } else if (filterValue === "incomplete") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  }

  // Apply sort
  const sortValue = taskSort.value;
  switch (sortValue) {
    case "date-asc":
      filteredTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case "date-desc":
      filteredTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case "priority":
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      filteredTasks.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
      break;
    default:
      break;
  }

  // clear the Task List
  taskList.innerHTML = "";
  // Show message if no tasks
  if (!filteredTasks.length) {
    taskList.innerHTML =
      '<li class="no-tasks">No tasks yet. Add your first task above</li>';
    return;
  }

  // // Render Tasks
  filteredTasks.forEach((task) => {
    const taskItemLi = document.createElement("li");
    taskItemLi.className = `task__list-item priority-${task.priority}`;
    if (task.completed) {
      taskItemLi.classList.add("completed");
    }

    // Format date for display
    const formattedDate = task.dueDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    taskItemLi.innerHTML = `<div class="task__content">
      <div class="task__title">${task.title}</div>
      <div class="task__meta">
        <span class="task-priority priority-${task.priority}">
          ${capitalizeFirstLetter(task.priority)} Priority
        </span>
        <span class="task-due-date">Due: ${formattedDate}</span>
      </div>
      <div class="task__actions">
        ${
          task.completed
            ? `<button class="btn btn__task btn__task-incomplete" data-id="${task.id}" data-action="toggle">Mark Incomplete</button>`
            : `<button class="btn btn__task btn__task-complete" data-id="${task.id}" data-action="toggle">Complete</button>`
        }
        <button class="btn btn-task btn-edit" data-id="${
          task.id
        }" data-action="edit">
          Edit
        </button>
        <button class="btn btn-task btn-delete" data-id="${
          task.id
        }" data-action="delete">
          Delete
        </button>
      </div>
    </div>`;

    taskList.appendChild(taskItemLi);
  });

  // Add event listeners to task buttons
  document.querySelectorAll(".task__actions button").forEach((button) => {
    button.addEventListener("click", handleTaskAction);
  });
}

function handleTaskAction(event) {
  const button = event.currentTarget;
  const taskId = button.getAttribute("data-id");
  const taskAction = button.getAttribute("data-action");

  switch (taskAction) {
    case "toggle":
      toggleTaskCompletion(taskId);
      break;
    case "edit":
      editTask(taskId);
      break;
    case "delete":
      deleteTask(taskId);
      break;

    default:
      break;
  }
}

function toggleTaskCompletion(taskId) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex >= 0) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveTasksToLocalStorage();
    renderTasks();
    updateStats();
  }
}

function editTask(taskId) {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    editingTaskId = taskId;

    taskTitleInput.value = task.title;
    taskPrioritySelect.value = task.priority;

    // Format date for input
    const year = task.dueDate.getFullYear();
    const month = String(task.dueDate.getMonth() + 1).padStart(2, "0");
    const day = String(task.dueDate.getDate()).padStart(2, "0");
    taskDueDateInput.value = `${year}-${month}-${day}`;

    document.getElementById("add-task-btn").textContent = "Update Task";
    // Scroll to form
    document
      .querySelector(".task__form-box")
      .scrollIntoView({ behavior: "smooth" });
  }
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasksToLocalStorage(tasks);
  renderTasks();
  updateStats();
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize App when DOM is ready
document.addEventListener("DOMContentLoaded", initApp);
