const express = require('express')
const morgan = require('morgan')

const otel = require('./telemetry')

const version = process.argv.length >= 3? process.argv[2]: 'v1'
const PORT = parseInt(process.env.PORT) || 3000

const app = express()
const metrics = new otel.Telemetry('fake-api', version)

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
    resp.status(200).json({ version, timestamp: Date.now() })
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
  metrics.start()
})
