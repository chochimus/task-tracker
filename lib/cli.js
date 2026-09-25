const { loadTasks, saveTasks } = require("../lib/taskStorage");
const { TaskManager } = require("./taskManager");

function formatTask(task) {
  return `ID: ${task.id}
    Description: ${task.description}
    Status: ${task.status}
    Created: ${new Date(task.createdAt).toLocaleString()}
    Last updated: ${new Date(task.updatedAt).toLocaleString()}`;
}

function displayTasks(taskManager, filter) {
  const VALID_FILTERS = ['done', 'todo', 'in-progress'];
  if (filter && !VALID_FILTERS.includes(filter)) {
    console.error('Invalid filter chosen');
    return;
  }

  let tasks = taskManager.getTasks(filter);
  console.log(tasks.map(formatTask).join('\n'))
}

async function addTask(taskManager, description) {
  if (!description) {
    console.error('No description given');
    return;
  }
  
  let task = taskManager.addTask(description);
  await saveTasks(taskManager.getTasks());
  
  console.log(`Task added successfully (ID: ${task.id})`);
}

async function updateTask(taskManager, id, description) {
  if (!id || !description) {
    console.error('Field missing.');
    return;
  }

  let task = taskManager.updateTask(id, description);

  if (!task) {
    console.error(`No task with given ID.`)
    return;
  }

  await saveTasks(taskManager.getTasks());
}

async function updateTaskStatus(taskManager, id, status) {
  if (!id) {
    console.error('Field missing.');
    return;
  }
  
  let task = taskManager.updateStatus(id, status);
  
  if (!task) {
    console.error(`No task with id ${id}`);
    return;
  }

  await saveTasks(taskManager.getTasks());
}

async function deleteTask(taskManager, id) {
  if (!id) {
    console.error('No id given');
    return;
  }

  taskManager.deleteTask(id);
  await saveTasks(taskManager.getTasks());
}

function parseArgs(argv) {
  return {
    operation: argv[2]?.toLowerCase(),
    args: argv.slice(3),
  };
}

async function run(argv) {
  const { operation, args } = parseArgs(argv);

  const OPERATIONS = [
    'add',
    'list',
    'update',
    'delete',
    'mark-in-progress',
    'mark-done'
  ];

  if (!operation || !OPERATIONS.includes(operation)) {
    console.error('Unknown command');
    return;
  }

  const taskManager = new TaskManager(await loadTasks());

  switch (operation) {
    case 'add':
      await addTask(taskManager, args[0]);
      break;
    case 'list':
      displayTasks(taskManager, args[0]);
      break;
    case 'update':
      await updateTask(taskManager, args[0], args[1]);
      break;
    case 'delete':
      await deleteTask(taskManager, args[0]);
      break;
    case 'mark-in-progress':
      await updateTaskStatus(taskManager, args[0], 'in-progress');
      break;  
    case 'mark-done':
      await updateTaskStatus(taskManager, args[0], 'done');
      break;
    default:
      break;
  }
}

module.exports = { run };