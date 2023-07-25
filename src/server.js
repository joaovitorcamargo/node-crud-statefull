const http = require('node:http')
const { json } = require('./middleware/json');
const { routes } = require('./routes');
const { log } = require('node:console');

const server = http.createServer(async (req, res) =>{
    const {method, url} = req

    await json(req, res);

    const route = routes.find((route) => {
        return method === route.method && route.path.test(url)
    })

    if(route) {
        const routeParams = url.match(route.path)

        req.params = {...routeParams.groups}

        return route.handler(req, res)
    }

    return res.writeHead(404).end()
})

server.listen(3333)