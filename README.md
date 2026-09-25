# Task Tracker
    A simple command-line task tracker built with Node.js. Tasks are stored locally in a JSON file and can be added, updated, deleted, and filtered by status

## Requirements
    - developed with Node.js 22+
    - npm

## Features
    - add new tasks
    - update task descriptions
    - mark tasks as in-progress or done
    - delete tasks
    - list all tasks
    - filter tasks by status
    - persist tasks locally using JSON

## Installation

1. Clone the repository

    ```bash
    git clone git@github.com:chochimus/task-tracker.git
    cd task-tracker
    ```

2. Link the CLI globally:

    ```bash
    npm link
    ```

## Usage

Once linked the `task-cli` command can be used from any directory

    ```bash
    # Adding a new task
    task-cli add "Buy groceries"
    # Output: Task added successfully (ID: 1)

    # Updating and deleting tasks
    task-cli update 1 "Buy groceries and cook dinner"
    task-cli delete 1

    # Marking a task as in progress or done
    task-cli mark-in-progress 1
    task-cli mark-done 1

    # Listing all tasks
    task-cli list

    # Listing tasks by status
    task-cli list done
    task-cli list todo
    task-cli list in-progress

    ```

## Storage

tasks are stored in `task_data.json`.

tasks are represented by an object with an ID, description, status, creation timestamp, and last updated timestamp.

```json
[
    {
        "id":1,
        "description":"Buy groceries",
        "status":"todo",
        "createdAt":1790136195541,
        "updatedAt":1790136195541
    }
]
```
## Project Structure

```text
task-tracker/
├── bin/
│   └── task-cli.js       # CLI entry point
├── lib/
│   ├── Task.js           # Task entity
│   ├── TaskManager.js    # Task management logic
│   ├── cli.js            # CLI commands and argument handling
│   └── taskStorage.js    # JSON persistence
├── task_data.json        # Local task data
├── package.json
└── README.md
```

# Acknowledgments

This project was developed based on the Task Tracker project from [roadmap.sh](https://roadmap.sh/projects/task-tracker)