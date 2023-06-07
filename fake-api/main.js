const express = require('express')
const morgan = require('morgan')

const version = process.argv.length >= 3? process.argv[2]: 'v1'
const PORT = parseInt(process.env.PORT) || 3000

const app = express()

app.use(morgan('common'))

app.get('/api/data', (req, resp) => {
	resp.json({ version })
})

app.use((req, resp) => {
	resp.status(404)
		.json({ error: `Resource not found: ${req.path}`})
})

app.listen(PORT, () => {
	console.info(`Application started on port ${PORT} at ${new Date()}`)
})
