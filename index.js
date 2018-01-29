const { parse } = require('url')
const { resolve } = require('path')
const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const dir = resolve(__dirname, 'client')
const quiet = !dev
const conf = require('./next.config')
const ip = process.env.IP
const port = process.env.PORT || 3000

const api = require('./api')
const getRoutes = require('./client/routes')

const app = next({ dev, dir, quiet, conf })
const handle = app.getRequestHandler()
const routes = getRoutes()

app.prepare()
    .then(() => {
        const server = express()

        server.use('/api', api)

        server.get('*', (req, res) => {
            const parsedUrl = parse(req.url, true)
            const { pathname, query = {} } = parsedUrl
            const route = routes[pathname]
            if (route) {
                return app.render(req, res, route.page, route.query)
            }
            return handle(req, res)
        })

        server.listen(port, ip, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://${ip || 'localhost'}:${port}`);
        });
    })
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    })
