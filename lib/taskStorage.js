const fs = require("node:fs/promises");
const path = require("node:path");
const DATA_FILE = path.join(__dirname, '..', 'task_data.json');

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

module.exports = {loadTasks, saveTasks};