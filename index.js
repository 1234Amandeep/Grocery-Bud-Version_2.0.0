const { request, response } = require('express')
const express = require('express')
const DatabaseStore = require('nedb')
const db = new DatabaseStore('database.db')
db.loadDatabase()
db.persistence.setAutocompactionInterval(5000)

const server = express()
server.listen(1700, () => {
  console.log('listing from 1700');
})
server.use(express.static('public'))
server.use(express.json())

server.get('/api', (request, response) => {
  db.find({}, (err, data) => { 
    response.json(data)
   })
})
server.post('/api/add', (request, response) => {
  addToDatabase(request.body)
  response.send({
    body: "I have recieved your post thank you!"
  })
})

server.post('/api/remove', (request, response) => {
  const query = { pk: parseInt(request.body.pk) }
  db.remove(query, {}, (removedNum) => {console.log('item removed');})
  
  response.send({
    body: "Item has been removed successfully thank you!"
  })
})

server.post('/api/clearall', (request, response) => {
  clearAllFromDatabase(request.body)
  response.send({
    body: "Whole db has been cleared!"
  })
})

server.post('/api/edit', (request, response) => {
  const query = { pk: parseInt(request.body.id) }

  db.update(query, { $set: { item: request.body.value } }, { multi: true }, (err, numReplaced) => {console.log('item edited');})
// db.update({ pk: 1678189147683 }, { $set: { item: 'chicken' } }, { multi: true }, function (err, numReplaced) {});
  response.send({
    body: "Item has been edited successfully"
  })
})

function addToDatabase(data)
{
  db.insert(data, () => { console.log('Item added...') })
}





function clearAllFromDatabase(data)
{ 
  db.remove({}, { multi: true }, (removedNum) => { console.log('db empty') })
}





























