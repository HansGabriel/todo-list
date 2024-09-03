// Define an interface for a Task
interface Task {
  text: string;
  completed: boolean;
  dueDate?: string;
}

// Get DOM elements
const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const dueDateInput = document.getElementById(
  "dueDateInput"
) as HTMLInputElement;
const addButton = document.getElementById("addButton") as HTMLButtonElement;
const sortOptions = document.getElementById("sortOptions") as HTMLSelectElement;
const taskList = document.getElementById("taskList") as HTMLUListElement;

// Event listeners
addButton.addEventListener("click", addTask);
sortOptions.addEventListener("change", sortTasks);

// Function to add a task
function addTask(): void {
  const taskText: string = taskInput.value.trim();
  const dueDate: string = dueDateInput.value;

  if (taskText !== "") {
    const task: Task = {
      text: taskText,
      completed: false,
      dueDate: dueDate ? dueDate : undefined,
    };

    const tasks: Task[] = getTasksFromLocalStorage();
    tasks.push(task);
    saveTasksToLocalStorage(tasks);
    renderTasks(tasks);

    taskInput.value = "";
    dueDateInput.value = "";
  }
}

// Function to render tasks
function renderTasks(tasks: Task[]): void {
  taskList.innerHTML = "";

  tasks.forEach((task: Task) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task";
    taskItem.innerHTML = `
      <span class="${task.completed ? "completed" : ""} ${
      isExpired(task.dueDate) ? "expired" : ""
    }">
        ${task.text} ${task.dueDate ? `(Due: ${task.dueDate})` : ""}
      </span>
      <button onclick="removeTask('${task.text}')">Delete</button>
    `;

    taskItem.addEventListener("click", function () {
      task.completed = !task.completed;
      saveTasksToLocalStorage(tasks);
      renderTasks(tasks);
    });

    taskList.appendChild(taskItem);
  });
}

// Function to remove a task
function removeTask(taskText: string): void {
  let tasks: Task[] = getTasksFromLocalStorage();
  tasks = tasks.filter((task: Task) => task.text !== taskText);
  saveTasksToLocalStorage(tasks);
  renderTasks(tasks);
}

// Function to check if a task is expired
function isExpired(dueDate?: string): boolean {
  if (!dueDate) return false;
  const currentDate = new Date().toISOString().split("T")[0];
  return dueDate < currentDate;
}

// Function to sort tasks
function sortTasks(): void {
  const sortOption: string = sortOptions.value;
  let tasks: Task[] = getTasksFromLocalStorage();

  if (sortOption === "alphabetical") {
    tasks.sort((a: Task, b: Task) => a.text.localeCompare(b.text));
  } else if (sortOption === "status") {
    tasks.sort((a: Task, b: Task) => Number(a.completed) - Number(b.completed));
  }

  renderTasks(tasks);
}

// Function to get tasks from local storage
function getTasksFromLocalStorage(): Task[] {
  const tasks: string | null = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

// Function to save tasks to local storage
function saveTasksToLocalStorage(tasks: Task[]): void {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
  const tasks: Task[] = getTasksFromLocalStorage();
  renderTasks(tasks);
});
