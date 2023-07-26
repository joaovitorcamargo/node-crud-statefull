const http = require('node:http')
const { json } = require('./middleware/json');
const { routes } = require('./routes');
const {generate} = require("csv-generate")
const {parse} = require("csv-parse")

const server = http.createServer(async (req, res) =>{
    const {method, url} = req

    await json(req, res);

    const route = routes.find((route) => {
        return method === route.method && route.path.test(url)
    })

    if(route) {
        const routeParams = url.match(route.path)

        const {query, ...params} = routeParams.groups
        
        req.params = params

        req.query = query ? query.substr(1).split('&').reduce((accumulator, currentValue) => {
            const [key, value] = currentValue.split('=')
            accumulator[key] = value
            return accumulator
        }, {}) : null

        return route.handler(req, res)
    }

    return res.writeHead(404).end()
})

server.listen(3333)