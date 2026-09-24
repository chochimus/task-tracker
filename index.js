#!/usr/bin/env node
const fs = require("node:fs/promises");
const path = require("node:path");
const DATA_FILE = path.join(__dirname, 'task_data.json');

class Task {
  constructor({id, description, status = 'todo', createdAt, updatedAt}) {
    this.id = id;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt ?? Date.now();
    this.updatedAt = updatedAt ?? this.createdAt;
  }
}

class TaskManager {
  constructor(tasks) {
    this.tasks = tasks.map(task => new Task(task));
  }
  getNextId() {
    if (this.tasks.length === 0) return 1;

    return Math.max(...this.tasks.map(task => task.id)) + 1;
  }
  getTasks(filter) {
    if (filter) {
      return this.tasks.filter(task => task.status === filter)
    }
    return this.tasks;
  }
  addTask(description) {
    let task = new Task({id: this.getNextId(), description});
    this.tasks.push(task);
    return task;
  }
  updateTask(id, description) {
    let task = this.tasks.find(task => task.id === Number(id));
    
    if (!task) {
      console.error(`No task with id ${id}.`);
      return;
    }
    if (description) {
      task.description = description;
    }
    task.updatedAt = Date.now();
  }
  updateStatus(id, status) {
    let task = this.tasks.find(task => task.id === Number(id));

    if (!task) {
      console.error(`No task with id ${id}`);
      return;
    }
    task.status = status;
    task.updatedAt = Date.now();
  }
  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== Number(id));
  }
}

async function loadTasks() {
  try {
    let data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw new Error("Error reading file");
  }
}

async function saveTasks(tasks) {
  try {
    await fs.writeFile(DATA_FILE, 
      JSON.stringify(tasks)
    );
  } catch (error) {
    console.error('Unable to save task, try again.');
  }
}

function displayTasks(taskManager) {
  const VALID_FILTERS = ['done', 'todo', 'in-progress'];
  let filter = process.argv[3];
  if (filter && !VALID_FILTERS.includes(filter)) {
    console.error('Invalid filter chosen');
    return;
  }
  let tasks = taskManager.getTasks(filter);
  console.log(tasks.map(task => {
    return `ID: ${task.id}
    Description: ${task.description}
    Status: ${task.status}
    Created: ${new Date(task.createdAt).toLocaleString()}
    Last updated: ${new Date(task.updatedAt).toLocaleString()}`;
  }).join('\n'))
}

async function addTask(taskManager) {
  let description = process.argv[3];
  if (description) {
    let task = taskManager.addTask(description);
    await saveTasks(taskManager.getTasks());
    console.log(`Task added successfully (ID: ${task.id})`);
  } else {
    console.error('No description given');
  }
}

async function updateTask(taskManager) {
  let id = process.argv[3];
  let description = process.argv[4];

  if (!id || !description) {
    console.error('Field missing.');
    return;
  }
  taskManager.updateTask(id, description);
  await saveTasks(taskManager.getTasks());
}

async function markInProgress(taskManager) {
  let id = process.argv[3];
  
  if (!id) {
    console.error('Field missing.');
    return;
  }
  taskManager.updateStatus(id, 'in-progress');
  await saveTasks(taskManager.getTasks());
}

async function markDone(taskManager) {
  let id = process.argv[3];

  if (!id) {
    console.error('Field missing.');
    return;
  }
  taskManager.updateStatus(id, 'done');
  await saveTasks(taskManager.getTasks());
}

async function deleteTask(taskManager) {
  let id = process.argv[3];

  if (!id) {
    console.error('No id given');
    return;
  }

  taskManager.deleteTask(id);
  await saveTasks(taskManager.getTasks());
}

(async function main() {
  const OPERATIONS = ['add', 'list', 'update', 'delete', 'mark-in-progress', 'mark-done']
  let operation = process.argv[2]?.toLowerCase();
  
  if (!operation || !OPERATIONS.includes(operation)) {
    console.error("Unknown command");
    return;
  }

  let taskManager = new TaskManager(await loadTasks());


  switch (operation) {
    case 'add':
      await addTask(taskManager);
      break;
    case 'list':
      displayTasks(taskManager);
      break;
    case 'update':
      await updateTask(taskManager);
      break;
    case 'delete':
      await deleteTask(taskManager);
      break;
    case 'mark-in-progress':
      await markInProgress(taskManager);
      break;  
    case 'mark-done':
      await markDone(taskManager);
      break;
    default:
      break;
  }

})();
