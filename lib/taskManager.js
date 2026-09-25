const { Task } = require('./task');

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
      return null;
    }

    task.description = description;
    task.updatedAt = Date.now();
    return task;
  }
  updateStatus(id, status) {
    let task = this.tasks.find(task => task.id === Number(id));

    if (!task) {
      return null;
    }
    task.status = status;
    task.updatedAt = Date.now();
    return task;
  }
  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== Number(id));
  }
}

module.exports = { TaskManager };