class Task {
  constructor({id, description, status = 'todo', createdAt, updatedAt}) {
    this.id = id;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt ?? Date.now();
    this.updatedAt = updatedAt ?? this.createdAt;
  }
}

module.exports = { Task };