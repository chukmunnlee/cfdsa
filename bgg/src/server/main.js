import express from "express";
import { join, dirname } from "path"
import { fileURLToPath } from 'url'

import { BGGDatabase } from "./bggdb.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbUser = process.env['BGG_DB_USER'] || 'root'
const dbPassword = process.env['BGG_DB_PASSWORD'] || 'changeit'
const dbHost = process.env['BGG_DB_HOST'] || '127.0.0.1'
const appPort = parseInt(process.env['BGG_PORT']) || 3000

const bggdb = new BGGDatabase(dbUser, dbPassword, dbHost)

const app = express()

app.get('/api/search', (req, resp) => {
  if (!req.query['q'])
    return resp.status(400)
        .json({
          timestamp: Date.now(),
          message: 'Missing search term q'
        })

    bggdb.findGamesByName(req.query.q)
      .then(result => resp.status(200).json(result))
      .catch(error => 
        resp.status(500)
          .json({ 
            timestamp: Date.now(),
            message: 'Failed',
            error
          })
      )
})

app.get('/api/game/:gid', (req, resp) => {
  const gid = parseInt(req.params.gid)

  Promise.all([ bggdb.findGameByGameId(gid), bggdb.findCommentsByGameId(gid) ])
    .then(results => {
      if (!results[0])
        return resp.status(404)
          .json({
            timestamp: Date.now(),
            message: `Gid not found: ${gid}`,
          })
      resp.status(200).json({
        ...results[0],
        comments: results[1]
      }) 
    })
    .catch(error =>
      resp.status(500)
        .json({ 
          timestamp: Date.now(),
          message: 'Failed',
          error
        })
    )
})

app.get('/healthz', (_, resp) => {
  bggdb.ping()
    .then(() => {
      resp.status(200)
        .json({ 
          timestamp: Date.now(),
          message: `Application is healthy`
        })
    })
    .catch(error => {
      resp.status(500)
        .json({ 
          timestamp: Date.now(),
          message: `Application not healthy`,
          error
        })
    })

})

app.use(express.static(join(__dirname, 'public')))

app.use((req, resp) => {
  resp.status(404)
    .json({ 
      timestamp: Date.now(),
      message: `Resource '${req.url}' not found` 
    })
})

bggdb.connect()
app.listen(appPort, () => {
  console.info(`Application started on port ${appPort} at ${new Date()}`)
})

process.on('SIGTERM', () => {
  console.info('Application terminating. Shutting down connection pool')
  bggdb.disconnect()
})

