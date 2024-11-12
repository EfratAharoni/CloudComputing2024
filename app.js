const express = require('express')
const app = express()
const port = 5000

app.set("view engine", "ejs")
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/about', (req, res) => {
  res.render('pages/about')
})

app.get('/blog', (req, res) => {
  res.render('pages/blog')
})
app.get('/contact', (req, res) => {
  res.render('pages/contact')
})
app.get('/index', (req, res) => {
  res.render('pages/index')
})
app.get('/recipes', (req, res) => {
  res.render('pages/recipes')
})

app.get('/logIn', (req, res) => {
  res.render('pages/logIn') 
})

app.get('/signUp', (req, res) => {
  res.render('pages/signUp') 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

