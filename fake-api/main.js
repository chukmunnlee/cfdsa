const express = require('express')
const morgan = require('morgan')

const otel = require('./telemetry')
const metadata = require('./package.json')
const { parseArgs} = require('./options')

const options = parseArgs()

const version = options.version
const PORT = options.port
const API_KEY = options.apiKey
const HTTP_X_API_KEY = 'X-API_KEY'

const app = express()
const metrics = new otel.Telemetry(metadata.name, version)

const reqCounter = metrics.meter.createCounter('request_total', 'Total number of requests')
const reqDuration = metrics.meter.createHistogram('request_duration_ms', 'Request duration in ms')
const currReqsCounter = metrics.meter.createUpDownCounter('request_current_total', 'Total number of current requests')

app.use(morgan('common'))

app.get('/api/data', (req, resp) => {
  const delay = Math.floor(Math.random() * 3000)
  const start = Date.now()
  const attr = { version, path: req.path }

  currReqsCounter.add(1, attr)

  resp.on('finish', () => {
    reqDuration.record(Date.now() - start, attr)
    currReqsCounter.add(-1, attr)
  })

  setTimeout(() => {
    reqCounter.add(1, attr)
    const reqAPIKey = req.get(HTTP_X_API_KEY)
    const payload = { version, timestamp: Date.now() }

    if (!!options.uid)
      payload['uid'] = options.uid

    if (!!API_KEY) {
      if (reqAPIKey != API_KEY) {
        delete payload.version
        payload['message'] = 'Fail authentication!'
        resp.status(401).json(payload)
        return
      }
    }

    resp.status(200).json(payload)

  }, delay)
})

app.get('/healthz', (_, resp) => {
  resp.status(200).json({ timestamp: Date.now() })
})

app.use((req, resp) => {
	resp.status(404)
		.json({ error: `Resource not found: ${req.path}`})
})

app.listen(PORT, () => {
	console.info(`Application started on port ${PORT} at ${new Date()}`)
  console.info(`Auth enabled: ${!!options.apiKey}`)
  metrics.start()
})
