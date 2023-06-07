const express = require('express')
const fs = require('fs')
var bodyParser = require('body-parser')

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let isi = fs.readFileSync('data.json')
let data = JSON.parse(isi)

app.use(express.static('public'))

app.get('/', (req, res) => {
  const jsonData = fs.readFileSync('data.json', 'utf8')
  const data = JSON.parse(jsonData)

  res.render('index', { data })
})

app.get('/add', (req, res) => {
  res.render('add')
})

app.post('/add', (req, res) => {
  const newData = {
    "id": data.length + 1,
    "integer": req.body.integer,
    "string": req.body.string,
    "float": req.body.float,
    "date": req.body.date ? req.body.date : "kosong",
    "boolean": req.body.boolean
  }
  data.push(newData)
  fs.writeFileSync('data.json', JSON.stringify(data, null, 3))

  res.redirect('/')
})

app.get('/delete/:id', (req, res) => {
  const id = req.params.id
  let indexDelete = ''
  for (i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      indexDelete = i
    }
  }
  data.splice(indexDelete, 1)
  fs.writeFileSync('data.json', JSON.stringify(data, null, 4))
  res.redirect('/')
})

app.get('/edit/:id', (req, res) => {
  const id = req.params.id
  let item = {}
  for(i = 0; i < data.length; i++){
    if(data[i].id == id ){
      item["id"] = data[i].id
      item["string"] = data[i].string
      item["integer"] = data[i].integer
      item["float"] = data[i].float
      item["date"] = data[i].date ? req.body.date : "kosong",
      item["boolean"] = data[i].boolean
    }
  }
  res.render('edit',{item})
})

app.post('/edit/:id', (req, res) => {
  const id = req.params.id
  for(i = 0; i < data.length; i++){
    if(data[i].id == id ){
      data[i].id = id
      data[i].string = req.body.string
      data[i].integer = req.body.integer
      data[i].float = req.body.float
      data[i].date = req.body.date ? req.body.date : "kosong",
      data[i].boolean = req.body.boolean
    }
  }
  fs.writeFileSync('data.json', JSON.stringify(data, null, 4))
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})