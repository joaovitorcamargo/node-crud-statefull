const {randomUUID} = require('node:crypto');
const {Database} = require('./database');
const { handleRouteParams } = require('./utils/handle-route-params');

const database = new Database();

const routes = [
    {
        method: 'GET',
        path: handleRouteParams('/tasks'),
        handler: (req, res) => {
            const tasks = database.select('tasks')
            return res.writeHead(200).end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: handleRouteParams('/tasks'),
        handler: (req, res) => {
            const task = {
                id: randomUUID(),
                title: req.body.title,
                description: req.body.description,
                completed_at: null,
                created_at: Date.now(),
                updated_at: null
            }

            database.create('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: handleRouteParams('/tasks/:id'),
        handler:(req, res) => {
            const {id} = req.params
            const {title, description} = req.body

            database.update('tasks',id, {
                title,
                description
            })

            return res.writeHead(200).end()
        }
    }
]

module.exports = {
    routes
}