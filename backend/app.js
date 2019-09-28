const express = require('express');
const cors = require('./middlewares/cors')
const createSession = require('./middlewares/create-session')
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
require('./db').connect('blog');

const app = express();

app.use(express.json());
app.use(cors);
app.use(createSession);

app.use('/api/posts', postsRouter)
app.use('/api/users', usersRouter)

const port = process.env.PORT || 5000;

let server = app.listen(port, () => {
    console.log("listening to port " + port)
})

process.on('SIGINT', () => { console.log("Bye bye!"); server.close(); process.exit(); });