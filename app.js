import express from 'express'
import { db } from './db/dbConnection.js'
const app = express()
const port = 6060

db
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))