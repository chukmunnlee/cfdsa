const express = require('express')
const { join } = require('path')

const PORT = parseInt(process.env.PORT) || 3000

const app = express()

app.get('/api/products', (req, resp) => {
  fetch('https://dummyjson.com/products/category-list')
    .then(result => result.json())
    .then(result => { resp.status(200).json(result) })
    .catch(error => { resp.status(500).json(error) })
})

app.get('/api/product/:category', (req, resp) => {
  const skip = parseInt(req.query.skip) || 0
  const limit = parseInt(req.query.limit) || 4
  const category = req.params['category']
  fetch(`https://dummyjson.com/products/category/${category}?skip=${skip}&limit=${limit}`)
    .then(result => result.json())
    .then(result => result.products ?? [])
    .then(result => result.map(r => (
        {
          id: r.id,
          title: r.title,
          description: r.description,
          brand: r.brand,
          price: r.price,
          thumbnail: r.thumbnail,
          rating: r.rating,
          stock: r.stock,
        }
    )))
    .then(result => { resp.status(200).json(result) })
    .catch(error => { resp.status(500).json(error) })
})

app.use(express.static(join(__dirname, 'public')))

app.listen(PORT, () => {
  console.info(`Application started on port ${PORT}`)
})
