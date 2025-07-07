import express from 'express'
import path from 'path'
import {logReq} from './middlewares.js'
import pg from 'pg'

const { Pool } = pg


const __dirname = path.resolve()
const PORT = process.env.PORT ?? 3001
const PORTDB = 5432
const app = express()
const selectAndFrom ="SELECT messsage_id, messsage_title, messsage_text ,to_char(message_date_create, 'YYYY-MM-DD') AS message_date_create FROM public.messsages "

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Bazh_lab-2',
    password: 'root',
    port: 5432,
})

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'templates'))

app.use(express.static(path.resolve(__dirname, 'static')))
app.use(logReq)


app.get('/', async (req, res) => {
    try {
        const result = await pool.query(
          selectAndFrom + "ORDER BY message_date_create DESC, messsage_title DESC"
        )
        res.render('index', { data: result.rows })
      } catch (err) {
        console.error('Ошибка выполнения запроса', err)
        res.status(500).send('Ошибка сервера')
      }
})
app.get('/message/:id', async (req, res) => {
  const id = req.params.id
  try {
    const result = await pool.query(selectAndFrom + "WHERE messsage_id = $1", [id])
    if (result.rows.length === 0) {
      return res.status(404).send('Message not found')
    }
    const message = result.rows[0]
    res.render('message', { message })
  } catch (error) {
    console.error('Error executing query', error)
    res.status(500).send('Internal Server Error')
  }
})

app.listen(PORT, () => {
    console.log(`Сервер запущен... \n Порт сайта: ${PORT}.. \n Порт БД: ${PORTDB}..`)
})