const fs = require('node:fs/promises')
const path = require('path')
const {URL} = require('url')

const currentPath = path.join(__dirname, '../db.json');

class Database {
    #tasks = {}

    constructor() {
        fs.readFile(currentPath, 'utf8')
        .then((data) => {
            this.#tasks = JSON.parse(data)
        }).catch(() => {
            this.#persist()
        })
    }

    select(table) {
        const data = this.#tasks[table] ?? []
        return data
    }

    create(table, data) {
        Array.isArray(this.#tasks[table]) ?
            this.#tasks[table].push(data) :
            this.#tasks[table] = [data]

        this.#persist()

        return data
    }

    update(table, id, data) {
        const currentIndexTask = this.#tasks[table].findIndex((task) => task.id === id)

        if(currentIndexTask > -1) {
            this.#tasks[table][currentIndexTask] = {
                id,
                created_at: this.#tasks[table][currentIndexTask].created_at,
                completed_at: data.completed_at ?? this.#tasks[table][currentIndexTask].completed_at,
                updated_at: Date.now(),
                title: data.title ?? this.#tasks[table][currentIndexTask].title,
                description: data.description ?? this.#tasks[table][currentIndexTask].description
            }
        }

        this.#persist()

    }

    #persist() {
        fs.writeFile(currentPath, JSON.stringify(this.#tasks))
    }

}

module.exports = {
    Database
}